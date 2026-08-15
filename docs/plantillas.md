# Gestión de plantillas

La interfaz administrativa representa la jerarquía `Sesión → Bloques → Ejercicios` sin agregar una entidad Bloque. Un bloque lógico es el conjunto de filas con el mismo `Orden_Bloque`; su nombre se almacena en `Tipo_Bloque` y la posición se reconstruye y normaliza al guardar.

## Orden y composición

El servicio agrupa los ejercicios por el orden de bloque recibido, ordena cada grupo y reasigna valores consecutivos desde 1. Esto evita huecos y duplicados. Un mismo `Catalogo_ID` puede aparecer varias veces porque cada ocurrencia conserva un `Plantilla_Ejercicio_ID` propio.

La composición se reemplaza mediante una única llamada `values.batchUpdate` con `RAW`: actualiza filas existentes, reutiliza filas retiradas para altas y vacía filas sobrantes. No se incorporó borrado físico general. Todas las entidades y referencias al catálogo se validan antes de la escritura batch.

Los datos generales de la sesión se actualizan antes de la composición. Si el batch falla, el servicio intenta restaurar la versión anterior de la sesión y propaga el error; nunca oculta una falla parcial.

## Catálogo y archivado

El selector ofrece únicamente ejercicios activos. Las filas de una plantilla existente se resuelven contra el catálogo completo, por lo que un ejercicio archivado sigue visible y marcado. Puede conservarse y editar sus parámetros, pero no agregarse como una ocurrencia nueva.

`Plantilla_Ejercicio` guarda solamente `Catalogo_ID` y parámetros; nombre, tipo, videos y aclaraciones se obtienen siempre del catálogo.
