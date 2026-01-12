import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage - Page Object para el Dashboard del Reclutador
 * Representa la página principal donde el reclutador puede navegar a diferentes secciones
 */
export class DashboardPage extends BasePage {
  // Selectores de elementos de la página
  private readonly logoSelector = 'img[alt="LTI Logo"]';
  private readonly titleSelector = 'h1:has-text("Dashboard del Reclutador")';
  private readonly addCandidateButtonSelector = 'a[href="/add-candidate"]';
  private readonly positionsButtonSelector = 'a[href="/positions"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navegar al dashboard
   */
  async goto() {
    await this.navigate('/');
    await this.waitForDashboardToLoad();
  }

  /**
   * Esperar a que el dashboard cargue completamente
   */
  async waitForDashboardToLoad() {
    await this.waitForSelector(this.logoSelector);
    await this.waitForSelector(this.titleSelector);
  }

  /**
   * Hacer click en el botón de "Añadir Candidato"
   * Navega a la página de añadir candidato
   */
  async clickAddCandidate() {
    await this.page.click(this.addCandidateButtonSelector);
    await this.page.waitForURL('/add-candidate');
  }

  /**
   * Hacer click en el botón de "Ver Posiciones"
   * Navega a la página de posiciones
   */
  async clickPositions() {
    await this.page.click(this.positionsButtonSelector);
    await this.page.waitForURL('/positions');
  }

  /**
   * Verificar que todos los elementos del dashboard son visibles
   */
  async verifyDashboardIsVisible() {
    await expect(this.page.locator(this.logoSelector)).toBeVisible();
    await expect(this.page.locator(this.titleSelector)).toBeVisible();
    await expect(this.page.locator(this.addCandidateButtonSelector)).toBeVisible();
    await expect(this.page.locator(this.positionsButtonSelector)).toBeVisible();
  }

  /**
   * Verificar el título del dashboard
   */
  async verifyTitle() {
    await expect(this.page.locator(this.titleSelector)).toContainText('Dashboard del Reclutador');
  }

  /**
   * Verificar que el logo es visible
   */
  async verifyLogoIsVisible() {
    await expect(this.page.locator(this.logoSelector)).toBeVisible();
  }

  /**
   * Verificar que el botón de añadir candidato está visible
   */
  async verifyAddCandidateButtonIsVisible() {
    await expect(this.page.locator(this.addCandidateButtonSelector)).toBeVisible();
  }

  /**
   * Verificar que el botón de posiciones está visible
   */
  async verifyPositionsButtonIsVisible() {
    await expect(this.page.locator(this.positionsButtonSelector)).toBeVisible();
  }
}

