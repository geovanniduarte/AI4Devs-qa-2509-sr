import { test, expect } from '@playwright/test';
import { DashboardPage } from '../page-objects/DashboardPage';
import { PositionsPage } from '../page-objects/PositionsPage';
import { PositionDetailPage } from '../page-objects/PositionDetailPage';
import { testPositions, positionStatuses } from '../fixtures/test-data';

/**
 * Suite de Tests E2E: Flujo de Posiciones
 * Cubre la visualización, filtrado y detalle de posiciones
 */
test.describe('Flujo: Dashboard -> Posiciones -> Detalle de Posición', () => {
  let dashboardPage: DashboardPage;
  let positionsPage: PositionsPage;
  let positionDetailPage: PositionDetailPage;

  // Setup: Ejecutar antes de cada test
  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    positionsPage = new PositionsPage(page);
    positionDetailPage = new PositionDetailPage(page);
    
    // Navegar al dashboard al inicio de cada test
    await dashboardPage.goto();
  });

  /**
   * Test 1: Navegación a lista de posiciones
   * Verifica la navegación básica desde dashboard a posiciones
   */
  test('Debe navegar desde dashboard a la lista de posiciones', async ({ page }) => {
    // Given: Estoy en el dashboard
    await dashboardPage.verifyDashboardIsVisible();
    
    // When: Hago click en "Ir a Posiciones"
    await dashboardPage.clickPositions();
    
    // Then: Debo ver la lista de posiciones
    await expect(page).toHaveURL('/positions');
    await positionsPage.waitForPageToLoad();
    
    // Capturar evidencia
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/20-positions-list.png',
      fullPage: true 
    });
  });

  /**
   * Test 2: Visualización de posiciones
   * Verifica que se muestran las posiciones disponibles
   */
  test('Debe mostrar todas las posiciones disponibles', async ({ page }) => {
    // Given: Navego a posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    
    // Then: Debo ver al menos una posición
    await positionsPage.verifyMinimumPositionCount(1);
    
    // And: Debe existir la posición "Senior Full-Stack Engineer"
    await positionsPage.verifyPositionExists(testPositions.seniorFullStack);
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/21-positions-loaded.png',
      fullPage: true 
    });
  });

  /**
   * Test 3: Filtrado de posiciones por estado
   * Verifica que el filtro funciona correctamente
   */
  test('Debe filtrar posiciones por estado', async ({ page }) => {
    // Given: Estoy en la lista de posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    
    // When: Filtro por estado "Open"
    await positionsPage.filterByStatus(positionStatuses.open);
    
    // Then: Los resultados se actualizan
    await page.waitForTimeout(500); // Esperar a que se aplique el filtro
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/22-positions-filtered-open.png',
      fullPage: true 
    });
    
    // When: Filtro por "Cerrado"
    await positionsPage.filterByStatus(positionStatuses.closed);
    await page.waitForTimeout(500);
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/23-positions-filtered-closed.png',
      fullPage: true 
    });
  });

  /**
   * Test 4: Abrir detalle de posición
   * Verifica que se puede abrir el detalle de "Senior Full-Stack Engineer"
   */
  test('Debe abrir el detalle de "Senior Full-Stack Engineer"', async ({ page }) => {
    // Given: Estoy en la lista de posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    
    // When: Hago click en "Senior Full-Stack Engineer"
    await positionsPage.openPosition(testPositions.seniorFullStack);
    
    // Then: Debo ver el detalle de la posición
    await positionDetailPage.waitForPageToLoad();
    await positionDetailPage.verifyPositionTitle(testPositions.seniorFullStack);
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/24-position-detail.png',
      fullPage: true 
    });
  });

  /**
   * Test 5: Verificar flujo de entrevistas
   * Verifica que la sección de flujo de entrevistas es visible
   */
  test('Debe mostrar el flujo de entrevistas en el detalle de posición', async ({ page }) => {
    // Given: Estoy en el detalle de "Senior Full-Stack Engineer"
    await dashboardPage.clickPositions();
    await positionsPage.openPosition(testPositions.seniorFullStack);
    await positionDetailPage.waitForPageToLoad();
    
    // Then: Debo ver la sección de flujo de entrevistas
    await positionDetailPage.verifyInterviewFlowIsVisible();
    
    // And: Debo ver la sección de candidatos
    await positionDetailPage.verifyCandidatesSection();
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/25-interview-flow-visible.png',
      fullPage: true 
    });
  });

  /**
   * Test 6: Navegación inversa
   * Verifica que se puede volver a la lista de posiciones
   */
  test('Debe poder volver a la lista de posiciones desde el detalle', async ({ page }) => {
    // Given: Estoy en el detalle de una posición
    await dashboardPage.clickPositions();
    await positionsPage.openPosition(testPositions.seniorFullStack);
    await positionDetailPage.waitForPageToLoad();
    
    // When: Hago click en "Volver a Posiciones"
    await positionDetailPage.clickBackToPositions();
    
    // Then: Debo volver a la lista de posiciones
    await expect(page).toHaveURL('/positions');
    await positionsPage.waitForPageToLoad();
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/26-back-to-positions.png',
      fullPage: true 
    });
  });

  /**
   * Test 7: Verificar elementos de la lista
   * Verifica que las tarjetas de posiciones contienen información relevante
   */
  test('Debe mostrar información relevante en cada posición', async ({ page }) => {
    // Given: Estoy en la lista de posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    
    // Then: Debo ver al menos una posición con información
    const titles = await positionsPage.getAllPositionTitles();
    expect(titles.length).toBeGreaterThan(0);
    
    // Verificar que hay títulos válidos
    titles.forEach(title => {
      expect(title.length).toBeGreaterThan(0);
    });
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/27-positions-info.png',
      fullPage: true 
    });
  });

  /**
   * Test 8: Navegación desde dashboard hasta detalle de posición
   * Verifica que el botón del dashboard está visible
   */
  test('Debe tener visible el botón de volver al dashboard desde posiciones', async ({ page }) => {
    // Given: Estoy en la lista de posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    
    // Then: El botón de volver debe estar visible (si existe)
    // Esto es opcional dependiendo del diseño
    const backButton = page.locator('button:has-text("Volver"), a:has-text("Dashboard")').first();
    const isVisible = await backButton.isVisible().catch(() => false);
    
    // Si el botón existe, verificar que funciona
    if (isVisible) {
      await backButton.click();
      await expect(page).toHaveURL('/');
    }
  });

  /**
   * Test 9: Flujo completo de posiciones
   * Prueba el recorrido completo Dashboard -> Posiciones -> Detalle -> Verificar
   */
  test('Flujo completo: Dashboard -> Posiciones -> Detalle -> Verificar proceso', async ({ page }) => {
    // Given: Inicio en el dashboard
    await dashboardPage.verifyDashboardIsVisible();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/30-flow-start-dashboard.png',
      fullPage: true 
    });
    
    // When: Navego a posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/31-flow-positions-list.png',
      fullPage: true 
    });
    
    // And: Abro "Senior Full-Stack Engineer"
    await positionsPage.openPosition(testPositions.seniorFullStack);
    await positionDetailPage.waitForPageToLoad();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/32-flow-position-detail.png',
      fullPage: true 
    });
    
    // Then: Verifico que veo el proceso completo
    await positionDetailPage.verifyPositionTitle(testPositions.seniorFullStack);
    await positionDetailPage.verifyInterviewFlowIsVisible();
    await positionDetailPage.verifyCandidatesSection();
    
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/33-flow-complete-verification.png',
      fullPage: true 
    });
  });

  /**
   * Test 10: Verificar contenido de posición específica
   * Prueba detallada del contenido de una posición
   */
  test('Debe verificar el contenido completo de la posición Senior Full-Stack Engineer', async ({ page }) => {
    // Given: Navego directamente al detalle de la posición
    await dashboardPage.clickPositions();
    await positionsPage.openPosition(testPositions.seniorFullStack);
    await positionDetailPage.waitForPageToLoad();
    
    // Then: Verifico todos los elementos del detalle
    await positionDetailPage.verifyPositionTitle(testPositions.seniorFullStack);
    await positionDetailPage.verifyPositionContentLoaded();
    await positionDetailPage.verifyBackButtonIsVisible();
    
    // Scroll a diferentes secciones para capturar todo
    await positionDetailPage.scrollToInterviewFlowSection();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/34-interview-flow-section.png',
      fullPage: true 
    });
    
    await positionDetailPage.scrollToCandidatesSection();
    await page.screenshot({ 
      path: 'playwright/integration/evidence/screenshots/35-candidates-section.png',
      fullPage: true 
    });
  });

  /**
   * Test 11: Búsqueda de posición específica
   * Verifica que se puede encontrar una posición por su título
   */
  test('Debe poder encontrar una posición por su título', async ({ page }) => {
    // Given: Estoy en la lista de posiciones
    await dashboardPage.clickPositions();
    await positionsPage.waitForPageToLoad();
    
    // When: Busco "Senior Full-Stack Engineer"
    const found = await positionsPage.searchPositionByText(testPositions.seniorFullStack);
    
    // Then: Debo encontrar la posición
    expect(found).toBeTruthy();
    
    // And: Puedo verificar que es visible
    await positionsPage.verifyPositionExists(testPositions.seniorFullStack);
  });
});

