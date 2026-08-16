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
El asistente supervisado de planificación y su política de privacidad están en `docs/asistente-ia.md`.
La identidad de marca, paleta y reglas responsive están documentadas en `docs/diseno-visual.md`.

## Deploy / Producción

Esta etapa prepara el proyecto pero no realiza el despliegue. La versión recomendada es Node.js 22 LTS, declarada en `package.json`.

1. Crear el entorno de producción y asignar las variables públicas durante el build y las server-only como secretos.
2. Configurar `APP_ORIGIN` con el origin HTTPS definitivo, sin comodines ni paths.
3. En Vercel, cargar el email y private key de la cuenta de servicio como variables; no utilizar una ruta `GOOGLE_APPLICATION_CREDENTIALS` de una computadora local.
4. Agregar el dominio final en Firebase Authentication → Authorized domains y revisar la plantilla de recuperación.
5. Desplegar sólo después de completar [el checklist pre-deploy](docs/pre-deploy-checklist.md).
6. Ejecutar un smoke test de login ADMIN/ALUMNO, autorización, Sheets, OpenAI, recuperación y logout sin usar datos reales innecesarios.

Servicios externos y riesgos operativos:

- Google Sheets API: cuotas por proyecto/usuario y posibles respuestas 429; evitar lecturas repetitivas.
- Firebase Authentication: cuotas, dominios autorizados y revocación de sesiones.
- OpenAI API: rate limits, disponibilidad y costo por tokens; la generación ocurre sólo por acción explícita de ADMIN.

La lista definitiva de variables y la estrategia de credenciales se encuentran en [configuración](docs/configuracion.md).
