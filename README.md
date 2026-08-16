# Aru te entrena

![Estudio Axis](public/brand/logo-estudio-axis-horizontal.png)

Aplicación web responsive para administrar alumnos, cobros, ejercicios, plantillas y rutinas, y para que cada alumno consulte sus entrenamientos y registre su progreso. El proyecto está construido como un MVP operativo para un estudio de entrenamiento de escala pequeña.

> Estado: MVP completo y auditado para preparar un futuro despliegue. Este repositorio no incluye credenciales, datos de producción ni infraestructura desplegada.

## Funcionalidades

### Administración

- Gestión de alumnos y activación o desactivación de acceso.
- Catálogo de ejercicios con videos, tipos y archivado controlado.
- Plantillas reutilizables organizadas en bloques.
- Creación y edición de rutinas por alumno.
- Asistente de IA supervisado para proponer rutinas antes de editarlas y guardarlas.
- Registro y seguimiento administrativo de cobros.
- Consulta de marcas de progreso desde la ficha del alumno.

### Alumno

- Inicio de sesión sin registro público.
- Próximos entrenamientos, historial y rutinas completadas.
- Detalle mobile-first con parámetros, indicaciones y videos.
- Registro opcional de peso, repeticiones o tiempo.
- Historial de marcas agrupado por ejercicio.
- Completado y reapertura de entrenamientos.
- Recuperación de contraseña mediante Firebase Authentication.

## Arquitectura

- **Next.js App Router + TypeScript:** interfaz, Server Components y Route Handlers.
- **Firebase Authentication:** identidad en cliente y sesiones verificadas con Firebase Admin.
- **Google Sheets:** persistencia desacoplada mediante repositorios y mapeadores por encabezado.
- **Zod:** validación en límites de dominio, persistencia y API.
- **OpenAI Responses API:** propuestas estructuradas y supervisadas de planificación.
- **Tailwind CSS:** sistema visual responsive con experiencia ADMIN y ALUMNO diferenciada.

La aplicación separa dominio, casos de uso e infraestructura. Google Sheets no se referencia desde la lógica de negocio, y los endpoints privados vuelven a validar sesión, usuario activo, rol y propiedad de los datos.

Más detalles en [Arquitectura](docs/arquitectura.md) y [Modelo de datos](docs/modelo-datos.md).

## IA supervisada

El asistente está disponible únicamente para `ADMIN` y no guarda automáticamente una propuesta. Minimiza el contexto enviado, utiliza Structured Outputs y valida nuevamente los identificadores de ejercicios contra el catálogo activo. Puede realizar como máximo una ronda de aclaración profesional.

La entrenadora conserva la decisión final: revisa la propuesta, la carga en el editor y sólo entonces puede guardarla. Véase [Asistente IA](docs/asistente-ia.md).

## Seguridad

- Sin registro público.
- Sesión en cookie `HttpOnly`, `Secure` en producción y `SameSite=Lax`.
- Roles `ADMIN` y `ALUMNO` comprobados en backend.
- `Alumno_ID` del alumno derivado exclusivamente de la sesión.
- Verificación estricta de `Origin` en operaciones mutables.
- Secretos exclusivamente server-side y archivos `.env*` excluidos de Git.
- Credenciales ADC por archivo sólo para desarrollo; variables secretas para entornos serverless.
- Errores públicos sanitizados y logs sin tokens, cookies, prompts completos ni credenciales.

La preparación productiva está resumida en [Configuración](docs/configuracion.md) y [Checklist pre-deploy](docs/pre-deploy-checklist.md).

## Desarrollo local

### Requisitos

- Node.js 22 LTS.
- pnpm 11.
- Proyecto Firebase con Email/Password habilitado.
- Spreadsheet con las nueve pestañas del modelo.
- Cuenta de servicio con los permisos mínimos necesarios.
- API key de OpenAI únicamente si se probará el asistente.

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

Completar `.env.local` con valores propios. Nunca versionar ese archivo ni copiar credenciales reales dentro del repositorio.

### Comprobaciones

```powershell
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Las integraciones reales son opt-in:

```powershell
pnpm test:integration
```

Requieren servicios y credenciales de prueba. Generan identificadores `ARU_TEST_*` y deben limpiar exclusivamente sus propios registros.

## Variables de entorno

Públicas, incluidas en el bundle web:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Server-only:

- `FIREBASE_ADMIN_PROJECT_ID`
- `APP_ORIGIN`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_APPLICATION_CREDENTIALS` — sólo desarrollo local con ADC.
- `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` — producción/serverless.
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — producción/serverless.
- `OPENAI_API_KEY`

Los valores y rutas de `.env.example` son deliberadamente ficticios.

## Documentación

| Tema | Documento |
| --- | --- |
| Arquitectura y seguridad | [docs/arquitectura.md](docs/arquitectura.md) |
| Configuración externa | [docs/configuracion.md](docs/configuracion.md) |
| Modelo de Google Sheets | [docs/modelo-datos.md](docs/modelo-datos.md) |
| Persistencia | [docs/persistencia-google-sheets.md](docs/persistencia-google-sheets.md) |
| Autenticación | [docs/autenticacion.md](docs/autenticacion.md) |
| Asistente IA | [docs/asistente-ia.md](docs/asistente-ia.md) |
| Desarrollo incremental con IA | [docs/desarrollo-con-ia.md](docs/desarrollo-con-ia.md) |
| Experiencia del alumno | [docs/experiencia-alumno.md](docs/experiencia-alumno.md) |
| Diseño visual | [docs/diseno-visual.md](docs/diseno-visual.md) |
| Preparación de producción | [docs/pre-deploy-checklist.md](docs/pre-deploy-checklist.md) |

La documentación restante describe alumnos, catálogo, plantillas, rutinas, progreso y cobros por módulo.

## Producción

El repositorio está preparado para un entorno serverless como Vercel, pero no realiza despliegues automáticamente. Antes de publicar una instancia se deben cargar secretos en el proveedor, configurar `APP_ORIGIN`, autorizar el dominio en Firebase y ejecutar el checklist de smoke tests.

Google Sheets, Firebase Authentication y OpenAI tienen cuotas o costos propios. La operación debe contemplar límites, respuestas 429 y presupuesto de tokens.

## Licencia

Este repositorio todavía no declara una licencia de uso.
