import { Page, expect } from '@playwright/test';

/**
 * CustomAssertions - Aserciones personalizadas para tests más legibles
 * Encapsula validaciones comunes con mensajes descriptivos
 */
export class CustomAssertions {
  /**
   * Verificar que la URL contiene un fragmento específico
   * @param page - Instancia de la página
   * @param urlFragment - Fragmento esperado en la URL
   */
  static async assertUrlContains(page: Page, urlFragment: string) {
    const url = page.url();
    expect(url, `URL debería contener "${urlFragment}" pero es: ${url}`).toContain(urlFragment);
  }

  /**
   * Verificar que un elemento es visible
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param message - Mensaje personalizado (opcional)
   */
  static async assertElementVisible(
    page: Page, 
    selector: string,
    message?: string
  ) {
    const defaultMessage = `Elemento "${selector}" debería ser visible`;
    await expect(page.locator(selector), message || defaultMessage).toBeVisible();
  }

  /**
   * Verificar que un elemento NO es visible
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param message - Mensaje personalizado (opcional)
   */
  static async assertElementNotVisible(
    page: Page, 
    selector: string,
    message?: string
  ) {
    const defaultMessage = `Elemento "${selector}" NO debería ser visible`;
    await expect(page.locator(selector), message || defaultMessage).not.toBeVisible();
  }

  /**
   * Verificar que un elemento contiene texto específico
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param text - Texto esperado
   */
  static async assertElementHasText(
    page: Page, 
    selector: string, 
    text: string
  ) {
    await expect(
      page.locator(selector),
      `Elemento "${selector}" debería contener texto "${text}"`
    ).toContainText(text);
  }

  /**
   * Verificar que el título de la página es correcto
   * @param page - Instancia de la página
   * @param title - Título esperado
   */
  static async assertPageTitle(page: Page, title: string) {
    await expect(page, `Título de página debería ser "${title}"`).toHaveTitle(title);
  }

  /**
   * Verificar que un elemento está habilitado
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   */
  static async assertElementEnabled(page: Page, selector: string) {
    await expect(
      page.locator(selector),
      `Elemento "${selector}" debería estar habilitado`
    ).toBeEnabled();
  }

  /**
   * Verificar que un elemento está deshabilitado
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   */
  static async assertElementDisabled(page: Page, selector: string) {
    await expect(
      page.locator(selector),
      `Elemento "${selector}" debería estar deshabilitado`
    ).toBeDisabled();
  }

  /**
   * Verificar que un elemento tiene un atributo específico
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param attribute - Nombre del atributo
   * @param value - Valor esperado del atributo
   */
  static async assertElementHasAttribute(
    page: Page,
    selector: string,
    attribute: string,
    value: string
  ) {
    await expect(
      page.locator(selector),
      `Elemento "${selector}" debería tener atributo "${attribute}" con valor "${value}"`
    ).toHaveAttribute(attribute, value);
  }

  /**
   * Verificar el número de elementos que coinciden con un selector
   * @param page - Instancia de la página
   * @param selector - Selector CSS
   * @param count - Número esperado de elementos
   */
  static async assertElementCount(
    page: Page,
    selector: string,
    count: number
  ) {
    await expect(
      page.locator(selector),
      `Debería haber exactamente ${count} elemento(s) que coincidan con "${selector}"`
    ).toHaveCount(count);
  }

  /**
   * Verificar que un input tiene un valor específico
   * @param page - Instancia de la página
   * @param selector - Selector CSS del input
   * @param value - Valor esperado
   */
  static async assertInputValue(
    page: Page,
    selector: string,
    value: string
  ) {
    await expect(
      page.locator(selector),
      `Input "${selector}" debería tener valor "${value}"`
    ).toHaveValue(value);
  }

  /**
   * Verificar que la URL es exactamente la esperada
   * @param page - Instancia de la página
   * @param expectedUrl - URL completa esperada
   */
  static async assertUrl(page: Page, expectedUrl: string) {
    const currentUrl = page.url();
    expect(currentUrl, `URL debería ser "${expectedUrl}" pero es "${currentUrl}"`).toBe(expectedUrl);
  }

  /**
   * Verificar que un elemento tiene una clase CSS específica
   * @param page - Instancia de la página
   * @param selector - Selector CSS del elemento
   * @param className - Nombre de la clase
   */
  static async assertElementHasClass(
    page: Page,
    selector: string,
    className: string
  ) {
    await expect(
      page.locator(selector),
      `Elemento "${selector}" debería tener la clase "${className}"`
    ).toHaveClass(new RegExp(className));
  }
}

