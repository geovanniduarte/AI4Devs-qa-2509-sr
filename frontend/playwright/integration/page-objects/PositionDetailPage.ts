import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PositionDetailPage - Page Object para la página de detalle de una posición
 * Maneja la visualización del flujo de entrevistas, candidatos y detalles de la posición
 */
export class PositionDetailPage extends BasePage {
  // Selectores de elementos de la página
  private readonly positionTitle = 'h2';
  private readonly backButton = 'button:has-text("Volver a Posiciones"), a:has-text("Volver")';
  private readonly interviewFlowSection = 'text=Flujo de Entrevistas, h3:has-text("Flujo"), h4:has-text("Proceso")';
  private readonly candidatesSection = 'text=Candidatos, h3:has-text("Candidatos")';
  private readonly interviewSteps = '.interview-step, .step, .stage';
  private readonly candidateCards = '.candidate-card, .candidate';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Esperar a que la página de detalle cargue
   */
  async waitForPageToLoad() {
    await this.waitForSelector(this.positionTitle);
  }

  /**
   * Verificar que el título de la posición es el esperado
   * @param expectedTitle - Título esperado de la posición
   */
  async verifyPositionTitle(expectedTitle: string) {
    await expect(this.page.locator(this.positionTitle)).toContainText(expectedTitle);
  }

  /**
   * Verificar que la sección de flujo de entrevistas es visible
   */
  async verifyInterviewFlowIsVisible() {
    // Intentar encontrar el texto del flujo de entrevistas con diferentes variaciones
    const flowSection = this.page.locator(this.interviewFlowSection).first();
    await expect(flowSection).toBeVisible();
  }

  /**
   * Verificar que la sección de candidatos es visible
   */
  async verifyCandidatesSection() {
    const candidatesSection = this.page.locator(this.candidatesSection).first();
    await expect(candidatesSection).toBeVisible();
  }

  /**
   * Hacer click en el botón de volver a posiciones
   */
  async clickBackToPositions() {
    await this.page.locator(this.backButton).first().click();
    await this.page.waitForURL('/positions');
  }

  /**
   * Verificar que hay pasos de entrevista visibles
   */
  async verifyInterviewStepsAreVisible() {
    const steps = this.page.locator(this.interviewSteps);
    const count = await steps.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Obtener el número de pasos de entrevista
   * @returns Número de pasos de entrevista
   */
  async getInterviewStepsCount(): Promise<number> {
    return await this.page.locator(this.interviewSteps).count();
  }

  /**
   * Obtener el número de candidatos mostrados
   * @returns Número de candidatos
   */
  async getCandidatesCount(): Promise<number> {
    return await this.page.locator(this.candidateCards).count();
  }

  /**
   * Verificar que el contenido de la posición está cargado
   * Verifica que los elementos principales están presentes
   */
  async verifyPositionContentLoaded() {
    await expect(this.page.locator(this.positionTitle)).toBeVisible();
    
    // Verificar que al menos una de estas secciones es visible
    const flowVisible = await this.page.locator(this.interviewFlowSection).first().isVisible().catch(() => false);
    const candidatesVisible = await this.page.locator(this.candidatesSection).first().isVisible().catch(() => false);
    
    expect(flowVisible || candidatesVisible).toBeTruthy();
  }

  /**
   * Verificar información específica de la posición
   * @param details - Objeto con detalles a verificar
   */
  async verifyPositionDetails(details: {
    title?: string;
    status?: string;
    description?: string;
  }) {
    if (details.title) {
      await this.verifyPositionTitle(details.title);
    }
    
    if (details.status) {
      await expect(this.page.getByText(details.status)).toBeVisible();
    }
    
    if (details.description) {
      await expect(this.page.getByText(details.description)).toBeVisible();
    }
  }

  /**
   * Verificar que el botón de volver es visible
   */
  async verifyBackButtonIsVisible() {
    await expect(this.page.locator(this.backButton).first()).toBeVisible();
  }

  /**
   * Tomar screenshot de la sección de flujo de entrevistas
   * @param name - Nombre del archivo de screenshot
   */
  async screenshotInterviewFlow(name: string) {
    const flowSection = this.page.locator(this.interviewFlowSection).first();
    await flowSection.screenshot({
      path: `playwright/integration/evidence/screenshots/${name}.png`
    });
  }

  /**
   * Verificar que una etapa específica del proceso existe
   * @param stageName - Nombre de la etapa
   */
  async verifyStageExists(stageName: string) {
    await expect(this.page.getByText(stageName)).toBeVisible();
  }

  /**
   * Scroll a la sección de candidatos
   */
  async scrollToCandidatesSection() {
    const candidatesSection = this.page.locator(this.candidatesSection).first();
    await candidatesSection.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll a la sección de flujo de entrevistas
   */
  async scrollToInterviewFlowSection() {
    const flowSection = this.page.locator(this.interviewFlowSection).first();
    await flowSection.scrollIntoViewIfNeeded();
  }
}

