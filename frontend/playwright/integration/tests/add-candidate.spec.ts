import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';
import { AddCandidatePage } from '../page-objects/AddCandidatePage';
import { testCandidates } from '../fixtures/test-data';

/**
 * Suite de Tests E2E: Flujo de Añadir Candidato
 * Cubre el journey completo desde el dashboard hasta la creación de un candidato
 */
test.describe('Flujo: Dashboard -> Añadir Candidato', () => {
  let dashboardPage: DashboardPage;
  let addCandidatePage: AddCandidatePage;

  // Setup: Ejecutar antes de cada test
  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    addCandidatePage = new AddCandidatePage(page);
    
    // Navegar al dashboard al inicio de cada test
    await dashboardPage.goto();
  });

  /**
   * Test 1: Navegación básica
   * Verifica que se puede navegar desde el dashboard al formulario
   */
  test('Debe navegar desde dashboard a formulario de añadir candidato', async ({ page }) => {
    // Given: Estoy en el dashboard
    await dashboardPage.verifyDashboardIsVisible();
    
    // When: Hago click en "Añadir Nuevo Candidato"
    await dashboardPage.clickAddCandidate();
    
    // Then: Debo ver el formulario de añadir candidato
    await expect(page).toHaveURL('/add-candidate');
    await addCandidatePage.waitForPageToLoad();
    
    // Capturar evidencia
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/01-add-candidate-form.png',
      fullPage: true 
    });
  });

  /**
   * Test 2: Creación de candidato con información mínima
   * Verifica que se puede crear un candidato con solo campos obligatorios
   */
  test('Debe crear un candidato con información básica', async ({ page }) => {
    // Given: Estoy en el formulario de añadir candidato
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    
    // When: Completo el formulario con datos básicos
    const candidateData = testCandidates.minimalCandidate;
    await addCandidatePage.fillBasicInfo(candidateData);
    
    // Capturar formulario completado
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/02-form-filled-basic.png',
      fullPage: true 
    });
    
    // And: Envío el formulario
    await addCandidatePage.submitForm();
    
    // Then: Debo ver mensaje de éxito
    await addCandidatePage.verifySuccessMessage();
    
    // Capturar mensaje de éxito
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/03-candidate-created-success.png',
      fullPage: true 
    });
  });

  /**
   * Test 3: Creación de candidato completo
   * Verifica el flujo completo con educación, experiencia y CV
   */
  test('Debe crear un candidato completo con educación y experiencia', async ({ page }) => {
    // Given: Estoy en el formulario de añadir candidato
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    
    // When: Completo el formulario con todos los datos
    const candidateData = testCandidates.validCandidate;
    await addCandidatePage.fillAndSubmitCandidate(candidateData);
    
    // Then: Debo ver mensaje de éxito
    await addCandidatePage.verifySuccessMessage();
    
    // Capturar evidencia final
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/04-complete-candidate-success.png',
      fullPage: true 
    });
  });

  /**
   * Test 4: Añadir múltiples experiencias laborales
   * Verifica que se pueden añadir varias experiencias
   */
  test('Debe poder añadir múltiples experiencias laborales', async ({ page }) => {
    // Given: Estoy en el formulario
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    
    // When: Añado información básica
    await addCandidatePage.fillBasicInfo(testCandidates.seniorCandidate);
    
    // And: Añado primera experiencia
    await addCandidatePage.addWorkExperience({
      company: 'Company A',
      position: 'Developer',
      description: 'First job',
      startDate: '2015-01-01',
      endDate: '2018-12-31'
    });
    
    // And: Añado segunda experiencia
    await addCandidatePage.addWorkExperience({
      company: 'Company B',
      position: 'Senior Developer',
      description: 'Second job',
      startDate: '2019-01-01',
      endDate: '2024-01-01'
    });
    
    // Then: Debo ver ambas experiencias en el formulario
    await expect(page.locator('input[value="Company A"]')).toBeVisible();
    await expect(page.locator('input[value="Company B"]')).toBeVisible();
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/05-multiple-experiences.png',
      fullPage: true 
    });
  });

  /**
   * Test 5: Añadir múltiples educaciones
   * Verifica que se pueden añadir varias educaciones
   */
  test('Debe poder añadir múltiples educaciones', async ({ page }) => {
    // Given: Estoy en el formulario
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    
    // When: Añado información básica
    await addCandidatePage.fillBasicInfo(testCandidates.juniorCandidate);
    
    // And: Añado primera educación
    await addCandidatePage.addEducation({
      institution: 'University A',
      title: 'Bachelor Degree',
      startDate: '2015-09-01',
      endDate: '2019-06-30'
    });
    
    // And: Añado segunda educación
    await addCandidatePage.addEducation({
      institution: 'Online Academy',
      title: 'Certification',
      startDate: '2020-01-01',
      endDate: '2020-06-30'
    });
    
    // Then: Debo ver ambas educaciones en el formulario
    await expect(page.locator('input[value="University A"]')).toBeVisible();
    await expect(page.locator('input[value="Online Academy"]')).toBeVisible();
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/06-multiple-educations.png',
      fullPage: true 
    });
  });

  /**
   * Test 6: Validación de campos requeridos
   * Verifica que el formulario valida campos obligatorios
   */
  test('Debe validar campos requeridos', async ({ page }) => {
    // Given: Estoy en el formulario
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    
    // When: Intento enviar sin completar campos requeridos
    await addCandidatePage.submitForm();
    
    // Then: Debo ver mensajes de validación
    // Verificar que hay elementos de error visibles
    const errorElements = page.locator('.invalid-feedback, .error-message, .text-danger, :invalid');
    const count = await errorElements.count();
    expect(count).toBeGreaterThan(0);
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/07-validation-errors.png',
      fullPage: true 
    });
  });

  /**
   * Test 7: Verificar que los campos se mantienen después de añadir secciones
   * Asegura que los datos no se pierden al añadir educación o experiencia
   */
  test('Debe mantener los datos al añadir secciones', async ({ page }) => {
    // Given: Estoy en el formulario
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    
    // When: Lleno campos básicos
    const candidateData = testCandidates.seniorCandidate;
    await addCandidatePage.fillBasicInfo(candidateData);
    
    // And: Añado una educación
    await addCandidatePage.addEducation(candidateData.education!);
    
    // Then: Los campos básicos deben mantener sus valores
    await addCandidatePage.verifyFieldValue('firstName', candidateData.firstName);
    await addCandidatePage.verifyFieldValue('lastName', candidateData.lastName);
    await addCandidatePage.verifyFieldValue('email', candidateData.email);
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/08-data-persistence.png',
      fullPage: true 
    });
  });

  /**
   * Test 8: Flujo completo end-to-end
   * Prueba el recorrido completo desde dashboard hasta confirmación
   */
  test('Flujo completo: Dashboard -> Formulario -> Crear -> Éxito', async ({ page }) => {
    // Given: Inicio en el dashboard
    await dashboardPage.verifyDashboardIsVisible();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/10-flow-start-dashboard.png',
      fullPage: true 
    });
    
    // When: Navego a añadir candidato
    await dashboardPage.clickAddCandidate();
    await addCandidatePage.waitForPageToLoad();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/11-flow-form-loaded.png',
      fullPage: true 
    });
    
    // And: Completo y envío el formulario
    const candidateData = testCandidates.validCandidate;
    await addCandidatePage.fillAndSubmitCandidate(candidateData);
    
    // Then: Verifico el éxito del proceso
    await addCandidatePage.verifySuccessMessage();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/12-flow-complete-success.png',
      fullPage: true 
    });
  });
});

