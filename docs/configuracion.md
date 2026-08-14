# Configuración externa

## Firebase Authentication

1. Crear un proyecto de Firebase y habilitar el proveedor **Email/Password**.
2. Registrar una aplicación web y copiar su configuración pública en las variables `NEXT_PUBLIC_FIREBASE_*`.
3. Crear credenciales de servicio para Firebase Admin y configurar las variables `FIREBASE_ADMIN_*` exclusivamente en el servidor.
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

## Convenciones numéricas

- `Meta_Peso`: número decimal en kilogramos.
- `Meta_Repeticiones`: entero no negativo.
- `Meta_Tiempo`: número decimal en segundos.
- `Importe`: número decimal en ARS.

La interfaz podrá mostrar unidades y formato argentino, pero Sheets debe conservar valores numéricos sin texto ni símbolos.

## Compatibilidad de identificadores

Los registros nuevos utilizan UUID. `Catalogo_ID` admite además identificadores de texto heredados no vacíos para conservar el catálogo existente; sus referencias en plantillas, rutinas y progreso aplican la misma regla. Los demás identificadores continúan validándose como UUID.
