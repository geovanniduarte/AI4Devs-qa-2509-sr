**Prompt 1**

Explicame que es playwright, para que sirve y como se utiliza, usa diagrama en mermaid para demostrar todo su flujo de trabajo dentro de la estructura del proyecto actual LTI


**Prompt 2**

In Plan Mode

as a senior architect expert in BDD using playwright

#Preparación del entorno

Integra Playwright en el proyecto en el modulo /frontend (dependencias + instalación de navegadores).
Configura el runner y el baseURL para apuntar al entorno correcto.
Añade scripts en package.json para ejecutar las pruebas y generar/abrir reportes.

# Flujos a probar

- dashboard -> add-candidate

- dashboard -> positions -> Senior Full-Stack Engineer (Ver proceso)


#Estructura de tests

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