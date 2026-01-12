import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PositionsPage - Page Object para la página de lista de posiciones
 * Maneja la visualización, filtrado y navegación de posiciones
 */
export class PositionsPage extends BasePage {
  // Selectores de elementos de la página
  private readonly backToDashboardButton = 'button:has-text("Volver al Dashboard")';
  private readonly positionCards = '.card';
  private readonly positionCardTitle = '.card h5, .card .card-title';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar a la página de posiciones
   */
  async goto() {
    await this.navigate('/positions');
    await this.waitForPageToLoad();
  }

  /**
   * Esperar a que la página cargue completamente
   * Usa getByRole para ser independiente del nivel de heading (h1, h2, etc.)
   */
  async waitForPageToLoad() {
    await this.page.getByRole('heading', { name: 'Posiciones' }).waitFor({ state: 'visible' });
  }

  /**
   * Filtrar posiciones por estado
   * Usa data-testid para identificar el select de estado de forma estable
   * @param status - Estado de la posición (open, filled, closed, draft)
   */
  async filterByStatus(status: string) {
    await this.page.getByTestId('status-filter').selectOption(status);
    // Esperar un momento para que se aplique el filtro
    await this.page.waitForTimeout(500);
  }

  /**
   * Obtener la tarjeta de una posición por su título
   * @param title - Título de la posición
   * @returns Locator de la tarjeta de posición
   */
  async getPositionByTitle(title: string): Promise<Locator> {
    return this.page.locator(`.card:has-text("${title}")`);
  }

  /**
   * Hacer click en una posición específica por su título
   * @param title - Título de la posición
   */
  async clickPositionByTitle(title: string) {
    const position = await this.getPositionByTitle(title);
    await position.click();
  }

  /**
   * Verificar que una posición existe en la lista
   * @param title - Título de la posición
   */
  async verifyPositionExists(title: string) {
    const position = await this.getPositionByTitle(title);
    await expect(position).toBeVisible();
  }

  /**
   * Verificar el número de posiciones mostradas
   * @param expectedCount - Número esperado de posiciones
   */
  async verifyPositionCount(expectedCount: number) {
    const positions = this.page.locator(this.positionCards);
    await expect(positions).toHaveCount(expectedCount);
  }

  /**
   * Verificar que hay al menos N posiciones
   * @param minCount - Mínimo número de posiciones esperadas
   */
  async verifyMinimumPositionCount(minCount: number) {
    const positions = this.page.locator(this.positionCards);
    const count = await positions.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  /**
   * Hacer click en el botón de volver al dashboard
   */
  async clickBackToDashboard() {
    await this.page.click(this.backToDashboardButton);
    await this.page.waitForURL('/');
  }

  /**
   * Abrir el detalle de una posición
   * @param positionTitle - Título de la posición a abrir
   */
  async openPosition(positionTitle: string) {
    await this.clickPositionByTitle(positionTitle);
    // Esperar a que se navegue a la página de detalle
    await this.page.waitForURL(/\/positions\/\d+/);
  }

  /**
   * Obtener todas las tarjetas de posiciones visibles
   * @returns Array de locators de tarjetas
   */
  async getAllPositionCards(): Promise<Locator> {
    return this.page.locator(this.positionCards);
  }

  /**
   * Obtener los títulos de todas las posiciones visibles
   * @returns Array con los títulos de las posiciones
   */
  async getAllPositionTitles(): Promise<string[]> {
    const titleElements = this.page.locator(this.positionCardTitle);
    const count = await titleElements.count();
    const titles: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await titleElements.nth(i).textContent();
      if (text) titles.push(text.trim());
    }
    
    return titles;
  }

  /**
   * Verificar que el filtro de estado está visible
   */
  async verifyFilterIsVisible() {
    await expect(this.page.getByTestId('status-filter')).toBeVisible();
  }

  /**
   * Verificar que el título de la página es correcto
   * Usa getByRole para ser más resiliente
   */
  async verifyPageTitle() {
    await expect(this.page.getByRole('heading', { name: 'Posiciones' })).toBeVisible();
  }

  /**
   * Buscar una posición por texto en su contenido
   * @param searchText - Texto a buscar
   * @returns True si encuentra al menos una posición con ese texto
   */
  async searchPositionByText(searchText: string): Promise<boolean> {
    const cards = this.page.locator(`.card:has-text("${searchText}")`);
    const count = await cards.count();
    return count > 0;
  }
}

