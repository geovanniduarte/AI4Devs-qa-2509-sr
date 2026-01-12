import { Page } from '@playwright/test';

/**
 * WaitUtils - Utilidades para esperas inteligentes en los tests
 * Evita esperas ciegas y hace los tests más robustos
 */
export class WaitUtils {
  /**
   * Esperar a que una respuesta de API específica se complete
   * @param page - Instancia de la página
   * @param urlPattern - Patrón de URL o RegExp de la API
   * @param timeout - Timeout en milisegundos (default: 10000)
   */
  static async waitForApiResponse(
    page: Page, 
    urlPattern: string | RegExp,
    timeout: number = 10000
  ) {
    return await page.waitForResponse(
      response => {
        const url = response.url();
        const matches = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);
        return matches && response.status() === 200;
      },
      { timeout }
    );
  }

  /**
   * Esperar a que la red esté inactiva (todas las peticiones completadas)
   * @param page - Instancia de la página
   */
  static async waitForNetworkIdle(page: Page) {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Esperar a que un elemento sea visible
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param timeout - Timeout en milisegundos (default: 5000)
   */
  static async waitForElement(
    page: Page, 
    selector: string, 
    timeout: number = 5000
  ) {
    await page.waitForSelector(selector, { 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Esperar a que un elemento NO sea visible
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param timeout - Timeout en milisegundos (default: 5000)
   */
  static async waitForElementToDisappear(
    page: Page, 
    selector: string, 
    timeout: number = 5000
  ) {
    await page.waitForSelector(selector, { 
      state: 'hidden', 
      timeout 
    });
  }

  /**
   * Esperar a que múltiples peticiones de API se completen
   * @param page - Instancia de la página
   * @param urlPatterns - Array de patrones de URL
   */
  static async waitForMultipleApiResponses(
    page: Page,
    urlPatterns: (string | RegExp)[]
  ) {
    const promises = urlPatterns.map(pattern => 
      this.waitForApiResponse(page, pattern)
    );
    await Promise.all(promises);
  }

  /**
   * Esperar a que la URL cambie
   * @param page - Instancia de la página
   * @param urlPattern - Patrón de URL esperado
   */
  static async waitForURLChange(page: Page, urlPattern: string | RegExp) {
    await page.waitForURL(urlPattern);
  }

  /**
   * Esperar a que un texto específico aparezca en la página
   * @param page - Instancia de la página
   * @param text - Texto a esperar
   * @param timeout - Timeout en milisegundos (default: 5000)
   */
  static async waitForText(
    page: Page, 
    text: string, 
    timeout: number = 5000
  ) {
    await page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Esperar condición personalizada
   * @param page - Instancia de la página
   * @param condition - Función que retorna boolean
   * @param timeout - Timeout en milisegundos (default: 5000)
   */
  static async waitForCondition(
    page: Page,
    condition: () => Promise<boolean>,
    timeout: number = 5000
  ) {
    await page.waitForFunction(condition, { timeout });
  }
}

