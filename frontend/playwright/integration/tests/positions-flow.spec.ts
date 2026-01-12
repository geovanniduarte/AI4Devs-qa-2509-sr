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
 
});

