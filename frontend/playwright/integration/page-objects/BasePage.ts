import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Clase base para todos los Page Objects
 * Contiene métodos comunes de navegación, interacción y espera
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navegar a una ruta específica
   * @param path - Ruta relativa (ej: '/dashboard', '/positions')
   */
  async navigate(path: string) {
    await this.page.goto(path);
  }

  /**
   * Esperar a que la página termine de cargar (network idle)
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Capturar screenshot de la página completa
   * @param name - Nombre del archivo (sin extensión)
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `playwright/integration/evidence/screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Hacer click en un elemento
   * @param selector - Selector CSS del elemento
   */
  async clickElement(selector: string) {
    await this.page.click(selector);
  }

  /**
   * Llenar un input con texto
   * @param selector - Selector CSS del input
   * @param value - Valor a ingresar
   */
  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  /**
   * Esperar a que un selector sea visible
   * @param selector - Selector CSS del elemento
   */
  async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * Obtener elemento por data-testid
   * @param testId - Valor del atributo data-testid
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Obtener elemento por rol ARIA
   * @param role - Rol ARIA (button, link, heading, etc.)
   * @param options - Opciones adicionales (name, etc.)
   */
  getByRole(role: any, options?: any): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Obtener elemento por texto visible
   * @param text - Texto exacto o expresión regular
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }

  /**
   * Esperar a que la URL contenga un patrón específico
   * @param urlPattern - Patrón de URL esperado
   */
  async waitForURL(urlPattern: string | RegExp) {
    await this.page.waitForURL(urlPattern);
  }

  /**
   * Seleccionar una opción de un dropdown
   * @param selector - Selector del select
   * @param value - Valor a seleccionar
   */
  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  /**
   * Subir un archivo
   * @param selector - Selector del input[type="file"]
   * @param filePath - Ruta del archivo
   */
  async uploadFile(selector: string, filePath: string) {
    await this.page.setInputFiles(selector, filePath);
  }

  /**
   * Scroll a un elemento
   * @param selector - Selector del elemento
   */
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Verificar que un elemento es visible
   * @param selector - Selector del elemento
   */
  async assertElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Verificar que un elemento contiene texto
   * @param selector - Selector del elemento
   * @param text - Texto esperado
   */
  async assertElementContainsText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
  }
}

