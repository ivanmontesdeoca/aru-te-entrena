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
5. Configurar `GOOGLE_SHEETS_SPREADSHEET_ID` y las credenciales `GOOGLE_SERVICE_ACCOUNT_*` en el servidor.

## Entornos

Copiar `.env.example` como `.env.local` para desarrollo y completar valores reales sin versionarlos. En Vercel, cargar las mismas variables desde la configuración del proyecto, separando Development, Preview y Production.

Las variables sin prefijo `NEXT_PUBLIC_` son secretas y nunca deben referenciarse desde componentes de cliente.

## Convenciones numéricas

- `Meta_Peso`: número decimal en kilogramos.
- `Meta_Repeticiones`: entero no negativo.
- `Meta_Tiempo`: número decimal en segundos.
- `Importe`: número decimal en ARS.

La interfaz podrá mostrar unidades y formato argentino, pero Sheets debe conservar valores numéricos sin texto ni símbolos.
