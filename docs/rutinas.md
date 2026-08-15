# Gestión administrativa de rutinas

La Etapa 7 permite listar, buscar y filtrar rutinas, crear una para un alumno desde una plantilla y editar su composición. Todas las rutas y operaciones requieren rol `ADMIN` en el servidor.

## Clonado e independencia

Al crear una rutina se genera un `Rutina_Sesion_ID` nuevo y un `Rutina_Ejercicio_ID` nuevo para cada ocurrencia de la plantilla. Los parámetros se copian como valores propios y solo se conserva `Plantilla_Sesion_Origen_ID` como referencia informativa. Por eso, una modificación posterior de la plantilla no altera la rutina ya creada.

La composición se persiste por encabezado mediante `values.batchUpdate` y `valueInputOption: RAW`. Se actualizan las ocurrencias existentes, se reutilizan de forma localizada las filas liberadas y se vacían únicamente las filas sobrantes de esa rutina. No hay borrado físico general.

## Bloques, catálogo y progreso

Los bloques son agrupaciones lógicas reconstruidas desde `Tipo_Bloque`, `Orden_Bloque` y `Orden_Ejercicio`; no se agregó una entidad nueva. Al guardar, órdenes de bloques y ejercicios se normalizan desde 1.

El selector permite agregar solo ejercicios activos. Una ocurrencia existente cuyo ejercicio fue archivado continúa visible y puede conservarse, pero no se puede crear ni redirigir una ocurrencia hacia un ejercicio archivado.

Antes de retirar una ocurrencia, el servicio consulta `Registro_Progreso`. Si existe progreso asociado a su `Rutina_Ejercicio_ID`, rechaza la operación para preservar la referencia histórica.

## Consistencia

La sesión se actualiza antes de reemplazar su composición. Si falla el batch de ejercicios, se intenta restaurar la sesión anterior y se propaga el error. Al crear, si falla el clonado de ejercicios, se elimina de forma compensatoria únicamente la fila de sesión recién creada.
