# Aru te entrena

MVP responsive para administrar alumnos, cobros, ejercicios, plantillas, rutinas y progresos. Firebase Authentication resuelve identidad y Google Sheets conserva los datos del negocio.

## Desarrollo

```bash
pnpm install
copy .env.example .env.local
pnpm dev
```

Comprobaciones:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Las integraciones reales no forman parte de la suite unitaria. Requieren credenciales locales, un spreadsheet de prueba compatible y se ejecutan explícitamente con `pnpm test:integration`. Cada prueba genera identificadores `ARU_TEST_*` y debe limpiar únicamente sus propios registros.

## Flujos del MVP

- **ADMIN:** inicia sesión, gestiona alumnos y accesos, catálogo, plantillas, rutinas y cobros; consulta progreso desde la ficha del alumno.
- **ALUMNO:** inicia sesión, consulta sus entrenamientos, registra o edita progreso opcional, revisa historial y marca entrenamientos como completados.

No existe registro público. La administradora habilita el acceso y Firebase envía el mecanismo para establecer o recuperar la contraseña.

La configuración de servicios externos está documentada en `docs/configuracion.md`.
La arquitectura de persistencia está resumida en `docs/persistencia-google-sheets.md`.
El flujo de autenticación y autorización está documentado en `docs/autenticacion.md`.
La gestión administrativa de alumnos está documentada en `docs/gestion-alumnos.md`.
El catálogo administrativo está documentado en `docs/catalogo-ejercicios.md`.
La gestión de plantillas está documentada en `docs/plantillas.md`.
La gestión administrativa de rutinas está documentada en `docs/rutinas.md`.
La experiencia del alumno está documentada en `docs/experiencia-alumno.md`.
El registro e historial de progreso está documentado en `docs/progreso.md`.
La gestión administrativa de cobros está documentada en `docs/cobros.md`.
La visión consolidada de capas, módulos, seguridad y lecturas principales está en `docs/arquitectura.md`.
El modelo definitivo de las nueve hojas está en `docs/modelo-datos.md`.
