# Persistencia con Google Sheets

La infraestructura de persistencia se organiza en cuatro piezas:

- `GoogleSheetsClient`: acceso de bajo nivel a la API con `valueInputOption: RAW`.
- mapeadores: convierten registros identificados por encabezado a entidades y viceversa.
- `GoogleSheetsRepository`: implementa listado, búsqueda por ID, creación, actualización y upsert.
- repositorios concretos: agregan consultas propias de cada dominio.

## Validación

Cada lectura valida los encabezados esperados y luego aplica el esquema Zod de la entidad. Los errores incluyen pestaña, número físico de fila y campos incompatibles. También se detectan encabezados e IDs duplicados.

Las columnas se resuelven por nombre. El orden físico puede cambiar sin afectar el mapeo, siempre que el conjunto de encabezados siga siendo exacto.

## Identificadores

Los registros nuevos deben generar UUID. Para conservar el catálogo preexistente, `Catalogo_ID` y sus claves foráneas aceptan además identificadores heredados de texto no vacío.

## Eliminación

Los repositorios no ofrecen borrado físico. `replaceForSesion` permite crear y actualizar elementos, pero rechaza una operación que implique retirar filas mientras el modelo no defina archivado o eliminación segura para esas entidades.

## Concurrencia

La actualización localiza primero el número de fila mediante el ID y luego escribe la fila completa. Esto es suficiente para una sola administradora, pero no ofrece control de versión frente a ediciones manuales concurrentes. Una futura ampliación multiadministrador deberá incorporar versión optimista o migrar a una base transaccional.

## Pruebas

`pnpm test` ejecuta pruebas unitarias sin conexión. `pnpm test:integration` requiere `GOOGLE_SHEETS_SPREADSHEET_ID` y Application Default Credentials. La integración crea registros identificables, verifica las operaciones y limpia únicamente los UUID generados durante la ejecución.
