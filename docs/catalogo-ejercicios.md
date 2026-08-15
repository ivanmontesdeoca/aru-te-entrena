# Catálogo de ejercicios

La administración se encuentra en `/admin/ejercicios`. El listado admite búsqueda por nombre, tipo y estado, y muestra tarjetas compactas para evitar tablas anchas en dispositivos móviles.

## Identificadores y referencias

Los IDs heredados se tratan como cadenas opacas y nunca se modifican. Las altas generan un UUID en el servicio backend. La edición conserva siempre el `Catalogo_ID`, por lo que plantillas, rutinas y progresos existentes continúan apuntando al mismo ejercicio y reciben sus datos descriptivos actualizados cuando vuelvan a consultarlo.

## Archivado

Archivar actualiza `Activo` a `FALSE`; reactivar lo devuelve a `TRUE`. No existe borrado físico. El repositorio excluye archivados por defecto para futuras selecciones, mientras que la administración usa `includeArchived` para consultarlos y filtrarlos.

## Videos

`Video` y `Video_Adicional` son opcionales, pero deben contener URLs completas cuando están presentes. La ficha abre esos enlaces en una pestaña separada con aislamiento `noopener`/`noreferrer`; la aplicación no almacena ni reproduce archivos de video.

Todas las escrituras pasan por endpoints `/api/admin/ejercicios/*`, validan origen y requieren nuevamente rol `ADMIN` en el servidor.
