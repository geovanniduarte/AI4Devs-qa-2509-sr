---
name: Playwright BDD Integration
overview: "Integración completa de Playwright en el proyecto LTI siguiendo principios BDD, incluyendo configuración, estructura de carpetas, Page Objects, helpers, fixtures y tests E2E para los flujos: añadir candidato y ver detalle de posición."
todos:
  - id: install-config
    content: Instalar Playwright y crear configuración base (playwright.config.ts + scripts)
    status: in_progress
  - id: folder-structure
    content: Crear estructura completa de carpetas playwright/integration/
    status: pending
    dependencies:
      - install-config
  - id: base-helpers
    content: Implementar BasePage y helpers (wait-utils, assertions)
    status: pending
    dependencies:
      - folder-structure
  - id: fixtures
    content: Crear fixtures con datos de prueba (test-data.ts + sample-cv.pdf)
    status: pending
    dependencies:
      - folder-structure
  - id: page-objects
    content: Implementar todos los Page Objects (Dashboard, AddCandidate, Positions, PositionDetail)
    status: pending
    dependencies:
      - base-helpers
      - fixtures
  - id: tests-candidate
    content: Crear tests E2E flujo añadir candidato (add-candidate.spec.ts)
    status: pending
    dependencies:
      - page-objects
  - id: tests-positions
    content: Crear tests E2E flujo posiciones (positions-flow.spec.ts)
    status: pending
    dependencies:
      - page-objects
  - id: documentation
    content: Crear README.md con documentación completa de la suite
    status: pending
    dependencies:
      - tests-candidate
      - tests-positions
  - id: validation
    content: Ejecutar suite completa y validar que todos los tests pasan
    status: pending
    dependencies:
      - tests-candidate
      - tests-positions
---

# Integración de Playwright con BDD en LTI

## Estructura General

Crearemos una suite completa de pruebas E2E en [`frontend/`](frontend/) siguiendo el patrón Page Object Model y principios BDD (Given-When-Then).

## Fase 1: Instalación y Configuración Base

### 1.1 Instalar Playwright

- Instalar `@playwright/test` como dependencia de desarrollo en [`frontend/package.json`](frontend/package.json)
- Nota: Los navegadores se instalarán posteriormente con `npx playwright install`

### 1.2 Crear Configuración Principal

- Crear [`frontend/playwright.config.ts`](frontend/playwright.config.ts) con:
- testDir: `./playwright/integration`
- baseURL: `http://localhost:3000` (configurable por env)
- outputDir para evidencias
- Reporters: HTML, JSON, list
- Configuración de timeouts (30s test, 5s expect)
- Retry: 0 local, 2 en CI
- Proyectos: Chromium, Firefox, WebKit
- Screenshots/videos: solo en fallos
- Trace: retener en fallos

### 1.3 Actualizar Scripts NPM

- Agregar en [`frontend/package.json`](frontend/package.json):
- `test:e2e`: ejecutar todos los tests
- `test:e2e:ui`: modo UI interactivo
- `test:e2e:headed`: con navegador visible
- `test:e2e:debug`: modo debug
- `test:e2e:report`: abrir reporte HTML
- `test:e2e:chrome`: solo Chromium

## Fase 2: Estructura de Carpetas

### 2.1 Crear Estructura Completa

Crear la siguiente jerarquía en `frontend/`:

```javascript
playwright/
└── integration/
    ├── evidence/              # Artefactos
    │   ├── screenshots/       # Manuales
    │   ├── test-results/      # Auto-generados
    │   └── html-report/       # Reportes
    ├── fixtures/              # Datos de prueba
    │   ├── test-data.ts
    │   └── files/
    │       └── sample-cv.pdf
    ├── helpers/               # Utilidades
    │   ├── wait-utils.ts
    │   └── assertions.ts
    ├── page-objects/          # Page Objects
    │   ├── BasePage.ts
    │   ├── DashboardPage.ts
    │   ├── AddCandidatePage.ts
    │   ├── PositionsPage.ts
    │   └── PositionDetailPage.ts
    └── tests/                 # Tests E2E
        ├── add-candidate.spec.ts
        └── positions-flow.spec.ts
```



### 2.2 Actualizar .gitignore

- Agregar en [`frontend/.gitignore`](frontend/.gitignore):
- `/playwright/integration/evidence/test-results/`
- `/playwright/integration/evidence/html-report/`
- `/playwright/.cache/`

## Fase 3: Implementar Base y Helpers

### 3.1 BasePage

- Crear `frontend/playwright/integration/page-objects/BasePage.ts`
- Métodos comunes:
- `navigate(path)`: navegación
- `waitForPageLoad()`: espera de carga
- `takeScreenshot(name)`: capturas
- `clickElement()`, `fillInput()`: interacciones
- `getByTestId()`, `getByRole()`, `getByText()`: selectores

### 3.2 Helpers de Esperas

- Crear `frontend/playwright/integration/helpers/wait-utils.ts`
- Funciones:
- `waitForApiResponse()`: esperar respuesta de API
- `waitForNetworkIdle()`: red inactiva
- `waitForElement()`: elemento visible

### 3.3 Helpers de Aserciones

- Crear `frontend/playwright/integration/helpers/assertions.ts`
- Funciones:
- `assertUrlContains()`: verificar URL
- `assertElementVisible()`: elemento visible
- `assertElementHasText()`: verificar texto

## Fase 4: Fixtures y Datos de Prueba

### 4.1 Crear Datos de Test

- Crear `frontend/playwright/integration/fixtures/test-data.ts`
- Definir interfaces TypeScript para:
- `CandidateData`: candidatos de prueba
- `testCandidates`: objeto con variantes (validCandidate, minimalCandidate, seniorCandidate)
- `testPositions`: nombres de posiciones a probar

### 4.2 Archivos de Prueba

- Crear `frontend/playwright/integration/fixtures/files/sample-cv.pdf`
- Este PDF será usado en tests de upload

## Fase 5: Page Objects

### 5.1 DashboardPage

- Crear `frontend/playwright/integration/page-objects/DashboardPage.ts`
- Extender BasePage
- Selectores:
- Logo, título, botones de navegación
- Métodos:
- `goto()`: navegar al dashboard
- `clickAddCandidate()`: ir a añadir candidato
- `clickPositions()`: ir a posiciones
- `verifyDashboardIsVisible()`: validar elementos

### 5.2 AddCandidatePage

- Crear `frontend/playwright/integration/page-objects/AddCandidatePage.ts`
- Interface `CandidateData` con campos del formulario
- Métodos:
- `fillBasicInfo()`: llenar campos básicos
- `addEducation()`: añadir educación
- `addWorkExperience()`: añadir experiencia
- `uploadCV()`: subir archivo
- `submitForm()`: enviar formulario
- `verifySuccessMessage()`: verificar éxito
- `fillAndSubmitCandidate()`: flujo completo

### 5.3 PositionsPage

- Crear `frontend/playwright/integration/page-objects/PositionsPage.ts`
- Métodos:
- `goto()`: navegar a posiciones
- `filterByStatus()`: filtrar por estado
- `getPositionByTitle()`: obtener tarjeta de posición
- `clickPositionByTitle()`: abrir posición
- `verifyPositionExists()`: verificar existencia
- `openPosition()`: abrir detalle

### 5.4 PositionDetailPage

- Crear `frontend/playwright/integration/page-objects/PositionDetailPage.ts`
- Métodos:
- `verifyPositionTitle()`: verificar título
- `verifyInterviewFlowIsVisible()`: verificar flujo
- `verifyCandidatesSection()`: verificar candidatos
- `clickBackToPositions()`: volver a lista

## Fase 6: Tests E2E - Flujo Añadir Candidato

### 6.1 Crear Suite de Tests

- Crear `frontend/playwright/integration/tests/add-candidate.spec.ts`
- Usar `test.describe()` para agrupar

### 6.2 Escenarios a Implementar

Cada test sigue patrón Given-When-Then:

1. **Navegación**: Dashboard → Formulario

- Given: En dashboard
- When: Click añadir candidato
- Then: Ver formulario, capturar screenshot

2. **Creación Básica**: Solo campos obligatorios

- Given: En formulario
- When: Llenar datos básicos + submit
- Then: Mensaje de éxito

3. **Creación Completa**: Con educación y experiencia

- Given: En formulario
- When: Llenar todo + submit
- Then: Éxito, capturar evidencia

4. **Múltiples Experiencias**: Añadir 2+ experiencias

- Given: En formulario
- When: Añadir múltiples secciones
- Then: Verificar en DOM

5. **Validaciones**: Submit sin datos

- Given: Formulario vacío
- When: Submit
- Then: Ver errores de validación

## Fase 7: Tests E2E - Flujo Posiciones

### 7.1 Crear Suite de Tests

- Crear `frontend/playwright/integration/tests/positions-flow.spec.ts`
- Usar `test.describe()` para agrupar

### 7.2 Escenarios a Implementar

1. **Navegación a Lista**: Dashboard → Posiciones

- Given: Dashboard visible
- When: Click ver posiciones
- Then: URL y lista correctas

2. **Mostrar Posiciones**: Listar todas

- Given: En lista
- Then: Al menos 1 posición, verificar "Senior Full-Stack Engineer"

3. **Filtrar por Estado**: Aplicar filtros

- Given: En lista
- When: Filtrar por "Open" y luego "Cerrado"
- Then: Capturar ambos estados

4. **Abrir Detalle**: Ver "Senior Full-Stack Engineer"

- Given: En lista
- When: Click en la posición
- Then: Ver detalle, verificar título

5. **Verificar Proceso**: Flujo de entrevistas

- Given: En detalle
- Then: Ver flujo de entrevistas, ver candidatos

6. **Navegación Inversa**: Volver a lista y dashboard

- Given: En detalle
- When: Click volver
- Then: URL correcta

7. **Flujo Completo**: Dashboard → Posiciones → Detalle → Verificar

- Navegar todo el flujo
- Capturar screenshots en cada paso
- Validar todo el proceso

## Fase 8: Mejoras en Componentes (Opcional)

### 8.1 Agregar data-testid

Sugerir agregar atributos `data-testid` en:

- [`frontend/src/components/RecruiterDashboard.js`](frontend/src/components/RecruiterDashboard.js):
- Botones: `add-candidate-button`, `positions-button`
- [`frontend/src/components/AddCandidateForm.js`](frontend/src/components/AddCandidateForm.js):
- Inputs: `firstName-input`, `lastName-input`, `email-input`, etc.
- [`frontend/src/components/Positions.tsx`](frontend/src/components/Positions.tsx):
- Filtro: `status-filter`
- Cards: `position-card-{id}`

Esto hará los tests más robustos y mantenibles.

## Fase 9: Documentación

### 9.1 README

- Crear `frontend/playwright/integration/README.md` con:
- Introducción a la suite
- Cómo ejecutar tests
- Estructura de carpetas explicada
- Convenciones y patrones
- Cómo añadir nuevos tests
- Troubleshooting común

## Orden de Ejecución Recomendado

1. Fase 1: Instalación y configuración
2. Fase 2: Estructura de carpetas
3. Fase 3: Base y helpers
4. Fase 4: Fixtures
5. Fase 5: Page Objects (orden: Base → Dashboard → AddCandidate → Positions → PositionDetail)
6. Fase 6: Tests añadir candidato
7. Fase 7: Tests posiciones
8. Fase 8: Mejoras opcionales
9. Fase 9: Documentación

## Validación Final

Antes de dar por terminado:

- Ejecutar `npm run test:e2e` → Todos los tests pasan
- Verificar reportes HTML generados
- Revisar screenshots en `evidence/`
- Confirmar que tests son independientes (ejecutar en orden aleatorio)