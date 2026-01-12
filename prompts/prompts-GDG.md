**Prompt 1**

Explicame que es playwright, para que sirve y como se utiliza, usa diagrama en mermaid para demostrar todo su flujo de trabajo dentro de la estructura del proyecto actual LTI


**Prompt 2**

In Plan Mode

as a senior architect expert in BDD using playwright

# Preparación del entorno

Integra Playwright en el proyecto en el modulo /frontend (dependencias + instalación de navegadores).
Configura el runner y el baseURL para apuntar al entorno correcto.
Añade scripts en package.json para ejecutar las pruebas y generar/abrir reportes.

# Flujos a probar

- dashboard -> add-candidate

- dashboard -> positions -> Senior Full-Stack Engineer (Ver proceso)


# Estructura de tests

- Crea la carpeta de pruebas E2E frontend/playwright/integration

- Evidencias en frontend/playwright/integration/evidence

- Organiza las pruebas por flujos (no por componentes).

- Usa nombres claros para los archivos (positions.spec.ts, newcandidate.spec.ts, etc.).


# Cada escenario debe incluir:

Navegación al punto inicial del flujo.
Interacciones reales del usuario (clicks, inputs, selects).


# Buenas prácticas mínimas

Usa selectores estables (ideal: data-testid, roles accesibles, texto visible).
Reutiliza lógica repetida con helpers y/o Page Objects cuando mejore la claridad.
Mantén pruebas reproducibles (estado controlado, datos consistentes, independencia entre tests).
Evitar esperas manuales “a ciegas”; preferir condiciones observables.
Validaciones con expect(...) sobre elementos/estado visible.

**Prompt 3**

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Flujo: Dashboard -> Posiciones -> Detalle de Posición >> Debe filtrar posiciones por estado
- Location: positions-flow.spec.ts:73:7

# Error details

```
TimeoutError: page.selectOption: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('select#statusFilter, select[name="status"]')


   at ../page-objects/PositionsPage.ts:40

  38 |    */
  39 |   async filterByStatus(status: string) {
> 40 |     await this.page.selectOption(this.filterSelect, status);
     |                     ^
  41 |     // Esperar un momento para que se aplique el filtro
  42 |     await this.page.waitForTimeout(500);
  43 |   }
    at PositionsPage.filterByStatus (/Users/gguerrero/Desktop/PERSONAL/ESTUDIAR/AI4Devs/Modulo 11/AI4Devs-qa-2509-sr/frontend/playwright/integration/page-objects/PositionsPage.ts:40:21)
    at /Users/gguerrero/Desktop/PERSONAL/ESTUDIAR/AI4Devs/Modulo 11/AI4Devs-qa-2509-sr/frontend/playwright/integration/tests/positions-flow.spec.ts:79:25
```
# Page snapshot

```yaml
- generic [ref=e3]:
  - button "Volver al Dashboard" [ref=e4] [cursor=pointer]
  - heading "Posiciones" [level=2] [ref=e5]
  - generic [ref=e6]:
    - textbox "Buscar por título" [ref=e8]
    - textbox [ref=e10]:
      - /placeholder: Buscar por fecha
    - combobox [ref=e12]:
      - option "Estado" [selected]
      - option "Abierto"
      - option "Contratado"
      - option "Cerrado"
      - option "Borrador"
    - combobox [ref=e14]:
      - option "Manager" [selected]
      - option "John Doe"
      - option "Jane Smith"
      - option "Alex Jones"
  - generic [ref=e15]:
    - generic [ref=e18]:
      - generic [ref=e19]: Senior Full-Stack Engineer
      - paragraph [ref=e20]:
        - strong [ref=e21]: "Manager:"
        - text: hr@lti.com
        - strong [ref=e22]: "Deadline:"
        - text: 30/12/2024
      - generic [ref=e23]: Open
      - generic [ref=e24]:
        - button "Ver proceso" [ref=e25] [cursor=pointer]
        - button "Editar" [ref=e26] [cursor=pointer]
    - generic [ref=e29]:
      - generic [ref=e30]: Data Scientist
      - paragraph [ref=e31]:
        - strong [ref=e32]: "Manager:"
        - text: hr@lti.com
        - strong [ref=e33]: "Deadline:"
        - text: 30/12/2024
      - generic [ref=e34]: Open
      - generic [ref=e35]:
        - button "Ver proceso" [ref=e36] [cursor=pointer]
        - button "Editar" [ref=e37] [cursor=pointer]
```

# Test source

```ts
   1 | import { Page, expect, Locator } from '@playwright/test';
   2 | import { BasePage } from './BasePage';
   3 |
   4 | /**
   5 |  * PositionsPage - Page Object para la página de lista de posiciones
   6 |  * Maneja la visualización, filtrado y navegación de posiciones
   7 |  */
   8 | export class PositionsPage extends BasePage {
   9 |   // Selectores de elementos de la página
   10 |   private readonly backToDashboardButton = 'button:has-text("Volver al Dashboard")';
   11 |   private readonly filterSelect = 'select#statusFilter, select[name="status"]';
   12 |   private readonly positionCards = '.card';
   13 |   private readonly positionCardTitle = '.card h5, .card .card-title';
   14 |
   15 |   constructor(page: Page) {
   16 |     super(page);
   17 |   }
   18 |
   19 |   /**
   20 |    * Navegar a la página de posiciones
   21 |    */
   22 |   async goto() {
   23 |     await this.navigate('/positions');
   24 |     await this.waitForPageToLoad();
   25 |   }
   26 |
   27 |   /**
   28 |    * Esperar a que la página cargue completamente
   29 |    * Usa getByRole para ser independiente del nivel de heading (h1, h2, etc.)
   30 |    */
   31 |   async waitForPageToLoad() {
   32 |     await this.page.getByRole('heading', { name: 'Posiciones' }).waitFor({ state: 'visible' });
   33 |   }
   34 |
   35 |   /**
   36 |    * Filtrar posiciones por estado
   37 |    * @param status - Estado de la posición (Open, Cerrado, etc.)
   38 |    */
   39 |   async filterByStatus(status: string) {
>  40 |     await this.page.selectOption(this.filterSelect, status);
      |                     ^ TimeoutError: page.selectOption: Timeout 5000ms exceeded.
   41 |     // Esperar un momento para que se aplique el filtro
   42 |     await this.page.waitForTimeout(500);
   43 |   }
   44 |
   45 |   /**
   46 |    * Obtener la tarjeta de una posición por su título
   47 |    * @param title - Título de la posición
   48 |    * @returns Locator de la tarjeta de posición
   49 |    */
   50 |   async getPositionByTitle(title: string): Promise<Locator> {
   51 |     return this.page.locator(`.card:has-text("${title}")`);
   52 |   }
   53 |
   54 |   /**
   55 |    * Hacer click en una posición específica por su título
   56 |    * @param title - Título de la posición
   57 |    */
   58 |   async clickPositionByTitle(title: string) {
   59 |     const position = await this.getPositionByTitle(title);
   60 |     await position.click();
   61 |   }
   62 |
   63 |   /**
   64 |    * Verificar que una posición existe en la lista
   65 |    * @param title - Título de la posición
   66 |    */
   67 |   async verifyPositionExists(title: string) {
   68 |     const position = await this.getPositionByTitle(title);
   69 |     await expect(position).toBeVisible();
   70 |   }
   71 |
   72 |   /**
   73 |    * Verificar el número de posiciones mostradas
   74 |    * @param expectedCount - Número esperado de posiciones
   75 |    */
   76 |   async verifyPositionCount(expectedCount: number) {
   77 |     const positions = this.page.locator(this.positionCards);
   78 |     await expect(positions).toHaveCount(expectedCount);
   79 |   }
   80 |
   81 |   /**
   82 |    * Verificar que hay al menos N posiciones
   83 |    * @param minCount - Mínimo número de posiciones esperadas
   84 |    */
   85 |   async verifyMinimumPositionCount(minCount: number) {
   86 |     const positions = this.page.locator(this.positionCards);
   87 |     const count = await positions.count();
   88 |     expect(count).toBeGreaterThanOrEqual(minCount);
   89 |   }
   90 |
   91 |   /**
   92 |    * Hacer click en el botón de volver al dashboard
   93 |    */
   94 |   async clickBackToDashboard() {
   95 |     await this.page.click(this.backToDashboardButton);
   96 |     await this.page.waitForURL('/');
   97 |   }
   98 |
   99 |   /**
  100 |    * Abrir el detalle de una posición
  101 |    * @param positionTitle - Título de la posición a abrir
  102 |    */
  103 |   async openPosition(positionTitle: string) {
  104 |     await this.clickPositionByTitle(positionTitle);
  105 |     // Esperar a que se navegue a la página de detalle
  106 |     await this.page.waitForURL(/\/positions\/\d+/);
  107 |   }
  108 |
  109 |   /**
  110 |    * Obtener todas las tarjetas de posiciones visibles
  111 |    * @returns Array de locators de tarjetas
  112 |    */
  113 |   async getAllPositionCards(): Promise<Locator> {
  114 |     return this.page.locator(this.positionCards);
  115 |   }
  116 |
  117 |   /**
  118 |    * Obtener los títulos de todas las posiciones visibles
  119 |    * @returns Array con los títulos de las posiciones
  120 |    */
  121 |   async getAllPositionTitles(): Promise<string[]> {
  122 |     const titleElements = this.page.locator(this.positionCardTitle);
  123 |     const count = await titleElements.count();
  124 |     const titles: string[] = [];
  125 |     
  126 |     for (let i = 0; i < count; i++) {
  127 |       const text = await titleElements.nth(i).textContent();
  128 |       if (text) titles.push(text.trim());
  129 |     }
  130 |     
  131 |     return titles;
  132 |   }
  133 |
  134 |   /**
  135 |    * Verificar que el filtro de estado está visible
  136 |    */
  137 |   async verifyFilterIsVisible() {
  138 |     await expect(this.page.locator(this.filterSelect)).toBeVisible();
  139 |   }
  140 |
```