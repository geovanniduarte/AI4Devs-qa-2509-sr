import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E del proyecto LTI
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directorio donde se encuentran los tests
  testDir: './playwright/integration/tests',
  
  // Carpeta para screenshots, videos y otros artefactos
  outputDir: './playwright/integration/evidence/test-results',
  
  // Timeout para cada test individual
  timeout: 30 * 1000,
  
  // Configuración global de expect
  expect: {
    /**
     * Timeout máximo para aserciones expect()
     */
    timeout: 5000
  },
  
  // Ejecutar tests en paralelo para mayor velocidad
  fullyParallel: true,
  
  // Fallar el build si se dejó test.only() por error
  forbidOnly: !!process.env.CI,
  
  // Reintentar tests que fallen (útil en CI para tests flaky)
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers en paralelo
  workers: process.env.CI ? 1 : undefined,
  
  // Reporters: HTML para visualización local y lista para terminal
  reporter: [
    ['html', { outputFolder: './playwright/integration/evidence/html-report' }],
    ['list'],
    ['json', { outputFile: './playwright/integration/evidence/results.json' }]
  ],
  
  // Configuración compartida para todos los tests
  use: {
    // URL base de la aplicación frontend
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Capturar screenshot solo cuando falle el test
    screenshot: 'only-on-failure',
    
    // Grabar video solo cuando falle el test
    video: 'retain-on-failure',
    
    // Capturar trazas para debugging (solo en fallos)
    trace: 'retain-on-failure',
    
    // Timeouts para navegación
    navigationTimeout: 10000,
    actionTimeout: 5000,
  },

  // Proyectos para diferentes navegadores
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Tests en móvil (opcional)
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Servidor web dev - Playwright iniciará el frontend automáticamente
  // Descomenta esto si quieres que Playwright inicie el servidor
  /* webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  }, */
});

