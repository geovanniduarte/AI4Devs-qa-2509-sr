# Playwright E2E Tests - LTI Talent Tracking System

Suite completa de pruebas end-to-end (E2E) para el sistema LTI utilizando Playwright y siguiendo principios de Behavior-Driven Development (BDD).

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecución de Tests](#ejecución-de-tests)
- [Flujos Cubiertos](#flujos-cubiertos)
- [Page Object Model](#page-object-model)
- [Fixtures y Datos de Prueba](#fixtures-y-datos-de-prueba)
- [Evidencias y Reportes](#evidencias-y-reportes)
- [Mejores Prácticas](#mejores-prácticas)
- [Troubleshooting](#troubleshooting)

## 📖 Descripción

Esta suite de pruebas E2E automatiza los flujos críticos del sistema LTI (Talent Tracking System), incluyendo:
- Gestión de candidatos (creación, visualización)
- Gestión de posiciones (listado, detalle, filtrado)
- Flujos de entrevistas

Utiliza el patrón **Page Object Model (POM)** para mantener el código organizado y reutilizable, y sigue principios **BDD (Given-When-Then)** en todos los escenarios de prueba.

## 🔧 Requisitos Previos

Antes de ejecutar los tests, asegúrate de tener:

- **Node.js**: v16 o superior
- **npm**: v7 o superior
- **Servicios corriendo**:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:3010`
  - Base de datos: PostgreSQL en puerto 5432

## 📦 Instalación

### ✅ Estado: Dependencias Instaladas

Las dependencias de Playwright ya están instaladas en el proyecto. Los navegadores (Chromium, Firefox, WebKit) han sido descargados.

### Verificar Instalación

```bash
# Verificar versión de Playwright
npx playwright --version

# Debería mostrar: Version 1.40.0 o superior
```

Si necesitas reinstalar los navegadores:

Si necesitas reinstalar los navegadores:

```bash
cd frontend
npx playwright install
```

```bash
npx playwright --version
```

## 📁 Estructura del Proyecto

```
frontend/playwright/integration/
├── evidence/                  # Artefactos generados
│   ├── screenshots/          # Screenshots manuales y de fallos
│   ├── test-results/         # Resultados de tests (auto-generados)
│   └── html-report/          # Reportes HTML (auto-generados)
├── fixtures/                 # Datos de prueba
│   ├── test-data.ts         # Candidatos y posiciones mock
│   └── files/               # Archivos de prueba (CVs)
│       └── sample-cv.pdf
├── helpers/                  # Utilidades reutilizables
│   ├── wait-utils.ts        # Esperas inteligentes
│   └── assertions.ts        # Aserciones personalizadas
├── page-objects/             # Page Object Models
│   ├── BasePage.ts          # Clase base con métodos comunes
│   ├── DashboardPage.ts     # Dashboard del reclutador
│   ├── AddCandidatePage.ts  # Formulario de añadir candidato
│   ├── PositionsPage.ts     # Lista de posiciones
│   └── PositionDetailPage.ts # Detalle de posición
└── tests/                    # Tests E2E organizados por flujo
    ├── add-candidate.spec.ts     # 8 tests: Flujo de añadir candidato
    └── positions-flow.spec.ts    # 11 tests: Flujo de posiciones
```

## 🚀 Ejecución de Tests

### Comandos Principales

```bash
# Ejecutar todos los tests (headless)
npm run test:e2e

# Ejecutar con UI interactiva de Playwright
npm run test:e2e:ui

# Ejecutar con navegador visible
npm run test:e2e:headed

# Ejecutar en modo debug
npm run test:e2e:debug

# Ejecutar solo en Chromium
npm run test:e2e:chrome

# Ver reporte HTML de última ejecución
npm run test:e2e:report
```

### Ejecutar Tests Específicos

```bash
# Solo tests de candidatos
npx playwright test add-candidate.spec.ts

# Solo tests de posiciones
npx playwright test positions-flow.spec.ts

# Un test específico
npx playwright test add-candidate.spec.ts -g "Debe crear un candidato básico"
```

### Ejecutar en Diferentes Navegadores

```bash
# Solo Firefox
npx playwright test --project=firefox

# Solo WebKit (Safari)
npx playwright test --project=webkit

# Todos los navegadores
npx playwright test --project=chromium --project=firefox --project=webkit
```

## 📝 Flujos Cubiertos

### Flujo 1: Añadir Candidato

**Archivo:** `tests/add-candidate.spec.ts`  
**Total:** 8 tests

| # | Escenario | Descripción |
|---|-----------|-------------|
| 1 | Navegación básica | Dashboard → Formulario de candidato |
| 2 | Creación mínima | Candidato con solo campos obligatorios |
| 3 | Creación completa | Candidato con educación, experiencia y CV |
| 4 | Múltiples experiencias | Añadir 2+ experiencias laborales |
| 5 | Múltiples educaciones | Añadir 2+ educaciones |
| 6 | Validación de campos | Verificar mensajes de error |
| 7 | Persistencia de datos | Datos no se pierden al añadir secciones |
| 8 | Flujo completo E2E | Dashboard → Formulario → Crear → Éxito |

### Flujo 2: Posiciones

**Archivo:** `tests/positions-flow.spec.ts`  
**Total:** 11 tests

| # | Escenario | Descripción |
|---|-----------|-------------|
| 1 | Navegación | Dashboard → Lista de posiciones |
| 2 | Visualización | Mostrar todas las posiciones |
| 3 | Filtrado | Filtrar por estado (Open, Cerrado) |
| 4 | Abrir detalle | Ver "Senior Full-Stack Engineer" |
| 5 | Flujo de entrevistas | Verificar sección de flujo |
| 6 | Navegación inversa | Volver a lista desde detalle |
| 7 | Información de tarjetas | Validar contenido de posiciones |
| 8 | Botón dashboard | Verificar navegación a dashboard |
| 9 | Flujo completo E2E | Dashboard → Posiciones → Detalle |
| 10 | Contenido completo | Verificar todos los elementos |
| 11 | Búsqueda | Encontrar posición por título |

## 🏗️ Page Object Model

### ¿Qué es POM?

El **Page Object Model** es un patrón de diseño que:
- Encapsula elementos y acciones de cada página en una clase
- Mejora la mantenibilidad del código
- Reduce la duplicación
- Hace los tests más legibles

### Page Objects Disponibles

#### 1. BasePage

**Propósito:** Clase base con métodos comunes a todas las páginas.

```typescript
// Ejemplo de uso
const page = new BasePage(page);
await page.navigate('/dashboard');
await page.waitForPageLoad();
await page.takeScreenshot('mi-screenshot');
```

**Métodos principales:**
- `navigate(path)` - Navegar a una ruta
- `waitForPageLoad()` - Esperar carga completa
- `takeScreenshot(name)` - Capturar pantalla
- `clickElement(selector)` - Hacer click
- `fillInput(selector, value)` - Llenar campo
- `getByTestId(testId)` - Selector por data-testid

#### 2. DashboardPage

**Propósito:** Página principal del reclutador.

```typescript
const dashboard = new DashboardPage(page);
await dashboard.goto();
await dashboard.verifyDashboardIsVisible();
await dashboard.clickAddCandidate();
await dashboard.clickPositions();
```

#### 3. AddCandidatePage

**Propósito:** Formulario de creación de candidatos.

```typescript
const addCandidate = new AddCandidatePage(page);
await addCandidate.goto();
await addCandidate.fillBasicInfo(candidateData);
await addCandidate.addEducation(educationData);
await addCandidate.addWorkExperience(experienceData);
await addCandidate.uploadCV('path/to/cv.pdf');
await addCandidate.submitForm();
await addCandidate.verifySuccessMessage();
```

#### 4. PositionsPage

**Propósito:** Lista de posiciones disponibles.

```typescript
const positions = new PositionsPage(page);
await positions.goto();
await positions.filterByStatus('Open');
await positions.verifyPositionExists('Senior Engineer');
await positions.openPosition('Senior Engineer');
```

#### 5. PositionDetailPage

**Propósito:** Detalle de una posición específica.

```typescript
const detail = new PositionDetailPage(page);
await detail.verifyPositionTitle('Senior Engineer');
await detail.verifyInterviewFlowIsVisible();
await detail.verifyCandidatesSection();
await detail.clickBackToPositions();
```

## 🎲 Fixtures y Datos de Prueba

### Ubicación

`fixtures/test-data.ts`

### Candidatos Predefinidos

```typescript
import { testCandidates } from '../fixtures/test-data';

// Candidato completo (con educación, experiencia, CV)
testCandidates.validCandidate

// Candidato mínimo (solo campos obligatorios)
testCandidates.minimalCandidate

// Candidato senior (para múltiples experiencias)
testCandidates.seniorCandidate

// Candidato junior (recién graduado)
testCandidates.juniorCandidate

// Datos inválidos (para pruebas de validación)
testCandidates.invalidCandidate
```

### Posiciones

```typescript
import { testPositions } from '../fixtures/test-data';

testPositions.seniorFullStack    // "Senior Full-Stack Engineer"
testPositions.juniorFrontend     // "Junior Frontend Developer"
testPositions.dataScientist      // "Data Scientist"
```

### Cómo Usar Fixtures

```typescript
test('Mi test', async ({ page }) => {
  const candidate = testCandidates.validCandidate;
  await addCandidatePage.fillBasicInfo(candidate);
  await addCandidatePage.submitForm();
});
```

## 📊 Evidencias y Reportes

### Screenshots

Los screenshots se generan en dos casos:

1. **Manuales:** Capturados explícitamente en el test
   ```typescript
   await page.screenshot({ 
     path: 'playwright/integration/evidence/screenshots/mi-test.png',
     fullPage: true 
   });
   ```

2. **Automáticos:** Cuando un test falla (configurado en `playwright.config.ts`)

**Ubicación:** `playwright/integration/evidence/screenshots/`

### Videos

Se graban automáticamente cuando un test falla.

**Ubicación:** `playwright/integration/evidence/test-results/`

### Reportes HTML

Después de ejecutar los tests:

```bash
npm run test:e2e:report
```

El reporte incluye:
- Estado de cada test (✅ Pass / ❌ Fail)
- Duración de ejecución
- Screenshots de fallos
- Videos de fallos
- Trazas interactivas para debugging

**Ubicación:** `playwright/integration/evidence/html-report/`

### Reportes JSON

Para integración con CI/CD:

**Ubicación:** `playwright/integration/evidence/results.json`

## ✅ Mejores Prácticas

### 1. Selectores Estables

**Orden de preferencia:**

```typescript
// 1. data-testid (MEJOR)
page.getByTestId('add-candidate-button')

// 2. Roles ARIA (BUENO)
page.getByRole('button', { name: 'Añadir Candidato' })

// 3. Texto visible (ACEPTABLE)
page.getByText('Añadir Candidato')

// 4. CSS/XPath (EVITAR)
page.locator('.btn-primary')  // Frágil
```

### 2. Esperas Inteligentes

```typescript
// ❌ MAL: Espera ciega
await page.waitForTimeout(3000);

// ✅ BIEN: Espera con condición
await page.waitForSelector('[data-testid="success-message"]');
await page.waitForURL('/dashboard');
await expect(page.locator('.alert')).toBeVisible();
```

### 3. Patrón Given-When-Then

```typescript
test('Descripción del test', async ({ page }) => {
  // Given: Estado inicial (precondiciones)
  await dashboardPage.goto();
  await dashboardPage.verifyDashboardIsVisible();
  
  // When: Acción del usuario
  await dashboardPage.clickAddCandidate();
  
  // Then: Resultado esperado
  await expect(page).toHaveURL('/add-candidate');
  await addCandidatePage.waitForPageToLoad();
});
```

### 4. Independencia de Tests

Cada test debe:
- ✅ Poder ejecutarse individualmente
- ✅ No depender del orden de ejecución
- ✅ Limpiar su propio estado (si es necesario)
- ✅ Usar `beforeEach` para setup común

### 5. Nombres Descriptivos

```typescript
// ❌ MAL
test('test 1', ...)

// ✅ BIEN
test('Debe crear un candidato con información básica', ...)
```

## 🔧 Troubleshooting

### Problema: Tests fallan con "Timeout"

**Solución:**
```bash
# Aumentar timeout en playwright.config.ts
timeout: 60 * 1000  // 60 segundos
```

### Problema: "Cannot find module '@playwright/test'"

**Solución:**
```bash
cd frontend
npm install
npx playwright install
```

### Problema: Navegadores no se instalan

**Solución:**
```bash
# Reinstalar navegadores manualmente
npx playwright install --with-deps
```

### Problema: Puerto 3000 no responde

**Solución:**
```bash
# Verificar que el frontend está corriendo
cd frontend
npm start

# O configurar otra URL
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e
```

### Problema: Tests pasan localmente pero fallan en CI

**Causas comunes:**
- Esperas insuficientes (red más lenta)
- Resolución de pantalla diferente
- Timeouts muy cortos

**Solución:**
```typescript
// En playwright.config.ts, para CI:
retries: process.env.CI ? 2 : 0
timeout: process.env.CI ? 60000 : 30000
```

### Problema: "Element not found"

**Debug:**
```bash
# Ejecutar en modo debug
npm run test:e2e:debug

# Ver el test paso a paso con UI
npm run test:e2e:ui
```

## 📚 Recursos Adicionales

- [Documentación oficial de Playwright](https://playwright.dev)
- [Mejores prácticas de Playwright](https://playwright.dev/docs/best-practices)
- [Selectores en Playwright](https://playwright.dev/docs/selectors)
- [Debugging en Playwright](https://playwright.dev/docs/debug)

## 👥 Contribuir

Para añadir nuevos tests:

1. Identifica el flujo a probar
2. Crea/actualiza el Page Object necesario
3. Añade datos mock en `fixtures/test-data.ts` si es necesario
4. Escribe el test en `tests/` siguiendo el patrón BDD
5. Ejecuta y verifica que pasa
6. Captura screenshots en puntos clave

## 📝 Notas Importantes

- **Pre-requisito:** Asegúrate de que backend y frontend están corriendo antes de ejecutar tests
- **Base de datos:** Los tests asumen que hay datos iniciales (posiciones, etc.)
- **Screenshots:** Se guardan en `evidence/screenshots/` - no los subas a git (están en `.gitignore`)
- **CI/CD:** Los tests están configurados para reintentar 2 veces en CI si fallan

---

**Última actualización:** 2026-01-12  
**Versión de Playwright:** 1.40.0  
**Mantenedor:** Equipo LTI QA

