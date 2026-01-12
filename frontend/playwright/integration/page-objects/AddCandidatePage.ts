import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CandidateData } from '../fixtures/test-data';

/**
 * AddCandidatePage - Page Object para el formulario de añadir candidato
 * Maneja todas las interacciones con el formulario de creación de candidatos
 */
export class AddCandidatePage extends BasePage {
  // Selectores de campos básicos
  private readonly firstNameInput = 'input[name="firstName"]';
  private readonly lastNameInput = 'input[name="lastName"]';
  private readonly emailInput = 'input[name="email"]';
  private readonly phoneInput = 'input[name="phone"]';
  private readonly addressInput = 'input[name="address"]';
  
  // Selectores de botones
  private readonly addEducationButton = 'button:has-text("Añadir Educación")';
  private readonly addWorkExperienceButton = 'button:has-text("Añadir Experiencia Laboral")';
  private readonly submitButton = 'button[type="submit"]';
  
  // Selectores de mensajes
  private readonly successAlert = '.alert-success';
  private readonly errorAlert = '.alert-danger';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar a la página de añadir candidato
   */
  async goto() {
    await this.navigate('/add-candidate');
    await this.waitForPageToLoad();
  }

  /**
   * Esperar a que la página cargue completamente
   */
  async waitForPageToLoad() {
    await this.waitForSelector(this.firstNameInput);
  }

  /**
   * Llenar los campos básicos del formulario
   * @param data - Datos del candidato
   */
  async fillBasicInfo(data: CandidateData) {
    await this.page.fill(this.firstNameInput, data.firstName);
    await this.page.fill(this.lastNameInput, data.lastName);
    await this.page.fill(this.emailInput, data.email);
    await this.page.fill(this.phoneInput, data.phone);
    await this.page.fill(this.addressInput, data.address);
  }

  /**
   * Añadir información de educación
   * @param education - Datos de educación
   */
  async addEducation(education: CandidateData['education']) {
    if (!education) return;

    await this.page.click(this.addEducationButton);
    
    // Esperar a que aparezcan los campos de educación
    await this.page.waitForSelector('input[name="institution"]');
    
    // Llenar campos de educación (tomando el último añadido)
    const institutionInputs = await this.page.locator('input[name="institution"]');
    const titleInputs = await this.page.locator('input[name="title"]');
    
    const lastIndex = await institutionInputs.count() - 1;
    
    await institutionInputs.nth(lastIndex).fill(education.institution);
    await titleInputs.nth(lastIndex).fill(education.title);
    
    // Las fechas pueden requerir interacción especial con DatePicker
    // Por ahora, las omitimos o usamos selectores más específicos si es necesario
  }

  /**
   * Añadir experiencia laboral
   * @param experience - Datos de experiencia laboral
   */
  async addWorkExperience(experience: CandidateData['workExperience']) {
    if (!experience) return;

    await this.page.click(this.addWorkExperienceButton);
    
    await this.page.waitForSelector('input[name="company"]');
    
    // Llenar campos de experiencia (tomando el último añadido)
    const companyInputs = await this.page.locator('input[name="company"]');
    const positionInputs = await this.page.locator('input[name="position"]');
    const descriptionInputs = await this.page.locator('input[name="description"]');
    
    const lastIndex = await companyInputs.count() - 1;
    
    await companyInputs.nth(lastIndex).fill(experience.company);
    await positionInputs.nth(lastIndex).fill(experience.position);
    await descriptionInputs.nth(lastIndex).fill(experience.description);
  }

  /**
   * Subir un archivo CV
   * @param filePath - Ruta al archivo PDF
   */
  async uploadCV(filePath: string) {
    if (!filePath) return;
    
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Enviar el formulario
   */
  async submitForm() {
    await this.page.click(this.submitButton);
  }

  /**
   * Verificar que aparece el mensaje de éxito
   */
  async verifySuccessMessage() {
    await expect(this.page.locator(this.successAlert)).toBeVisible();
    await expect(this.page.locator(this.successAlert)).toContainText('Candidato creado exitosamente');
  }

  /**
   * Verificar que aparece un mensaje de error
   */
  async verifyErrorMessage() {
    await expect(this.page.locator(this.errorAlert)).toBeVisible();
  }

  /**
   * Llenar y enviar el formulario completo de candidato
   * Método de conveniencia que ejecuta todo el flujo
   * @param data - Datos completos del candidato
   */
  async fillAndSubmitCandidate(data: CandidateData) {
    await this.fillBasicInfo(data);
    
    if (data.education) {
      await this.addEducation(data.education);
    }
    
    if (data.workExperience) {
      await this.addWorkExperience(data.workExperience);
    }
    
    if (data.cvPath) {
      await this.uploadCV(data.cvPath);
    }
    
    await this.submitForm();
  }

  /**
   * Verificar que un campo tiene un valor específico
   * @param fieldName - Nombre del campo
   * @param expectedValue - Valor esperado
   */
  async verifyFieldValue(fieldName: string, expectedValue: string) {
    const selector = `input[name="${fieldName}"]`;
    await expect(this.page.locator(selector)).toHaveValue(expectedValue);
  }

  /**
   * Verificar que aparecen mensajes de validación
   */
  async verifyValidationErrors() {
    // Verificar que hay al menos un mensaje de error visible
    const errorMessages = this.page.locator('.invalid-feedback, .error-message, .text-danger');
    await expect(errorMessages.first()).toBeVisible();
  }

  /**
   * Contar cuántas secciones de educación hay
   */
  async countEducationSections(): Promise<number> {
    return await this.page.locator('input[name="institution"]').count();
  }

  /**
   * Contar cuántas secciones de experiencia laboral hay
   */
  async countWorkExperienceSections(): Promise<number> {
    return await this.page.locator('input[name="company"]').count();
  }
}

