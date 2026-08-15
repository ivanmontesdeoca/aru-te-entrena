# Configuración externa

## Firebase Authentication

1. Crear un proyecto de Firebase y habilitar el proveedor **Email/Password**.
2. Registrar una aplicación web y copiar su configuración pública en las variables `NEXT_PUBLIC_FIREBASE_*`.
3. Configurar `FIREBASE_ADMIN_PROJECT_ID`. Firebase Admin reutiliza `GOOGLE_APPLICATION_CREDENTIALS` mediante Application Default Credentials.
4. Configurar el dominio autorizado y la plantilla del email usado para establecer/restablecer contraseña.

## Google Sheets

1. Crear un proyecto en Google Cloud y habilitar Google Sheets API.
2. Crear una cuenta de servicio exclusiva.
3. Crear el spreadsheet con las pestañas declaradas en `src/infrastructure/sheets/sheet-names.ts`.
4. Compartir el spreadsheet con el email de la cuenta de servicio como editor.
5. Configurar `GOOGLE_SHEETS_SPREADSHEET_ID` en el servidor.
6. Para desarrollo local, configurar `GOOGLE_APPLICATION_CREDENTIALS` con la ruta absoluta al JSON descargado. Por ejemplo: `C:\\ruta\\local\\service-account.example.json`.
7. No copiar el JSON dentro del repositorio. Si excepcionalmente se guarda una copia local en el proyecto, utilizar `credentials/`, que está excluida por `.gitignore`.

La infraestructura prioriza Application Default Credentials cuando `GOOGLE_APPLICATION_CREDENTIALS` está definida. Como compatibilidad, si esa variable no existe se utilizan `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL` y `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.

El contenido del archivo JSON nunca debe imprimirse, registrarse ni exponerse al navegador. En un entorno productivo que proporcione identidad administrada, Application Default Credentials también puede funcionar sin un archivo local.

## Entornos

Copiar `.env.example` como `.env.local` para desarrollo y completar valores reales sin versionarlos. En Vercel, cargar las mismas variables desde la configuración del proyecto, separando Development, Preview y Production.

Las variables sin prefijo `NEXT_PUBLIC_` son secretas y nunca deben referenciarse desde componentes de cliente.

Variables necesarias:

- públicas: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`;
- servidor: `FIREBASE_ADMIN_PROJECT_ID`, `GOOGLE_SHEETS_SPREADSHEET_ID` y, en desarrollo local, `GOOGLE_APPLICATION_CREDENTIALS`;
- alternativas heredadas opcionales: pares de email y clave privada de Firebase Admin o Google Sheets declarados en `.env.example`.

`ARU_TEST_BASE_URL` es opcional y se utiliza sólo para habilitar las comprobaciones HTTP de ciertas integraciones contra un servidor local ya iniciado.

## OpenAI

Configurar `OPENAI_API_KEY` como secreto exclusivo del servidor. La aplicación la usa para el asistente de planificación mediante Responses API y nunca la expone al navegador ni la incluye en logs. La política de privacidad del contexto está documentada en `docs/asistente-ia.md`.

## Sesión y autorización

Firebase Authentication valida email y contraseña en el cliente con persistencia en memoria. El backend verifica el ID token, consulta `Usuarios` y emite una cookie `HttpOnly`, `SameSite=Lax`, segura en producción y limitada a cinco días. Cada acceso privado vuelve a consultar `Usuarios.Activo`, `Rol` y `Alumno_ID`.

## Convenciones numéricas

- `Meta_Peso`: número decimal en kilogramos.
- `Meta_Repeticiones`: entero no negativo.
- `Meta_Tiempo`: número decimal en segundos.
- `Importe`: número decimal en ARS.

La interfaz podrá mostrar unidades y formato argentino, pero Sheets debe conservar valores numéricos sin texto ni símbolos.

## Compatibilidad de identificadores

Los registros nuevos utilizan UUID. `Catalogo_ID` admite además identificadores de texto heredados no vacíos para conservar el catálogo existente; sus referencias en plantillas, rutinas y progreso aplican la misma regla. Los demás identificadores continúan validándose como UUID.
