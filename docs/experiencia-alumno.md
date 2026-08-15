# Experiencia del alumno

La ruta `/entrenamientos` y sus detalles requieren rol `ALUMNO`. El servidor obtiene siempre el `Alumno_ID` desde la sesión validada y la fila correspondiente de `Usuarios`; ninguna ruta, query o carga enviada por el navegador puede seleccionar al alumno efectivo.

Antes de devolver un detalle o cambiar su estado, el servicio carga la sesión por ID y compara `Rutina_Sesion.Alumno_ID` con el alumno autenticado. Una discrepancia se rechaza aunque el usuario conozca el UUID de otra rutina.

El listado agrupa las rutinas propias en próximas y anteriores usando la fecha planificada. Una rutina vencida permanece accesible como pendiente y una completada sigue disponible. El detalle reconstruye bloques y ejercicios ordenados y combina la composición con una lectura agrupada del catálogo completo, incluidos ejercicios archivados.

La acción de completado recibe únicamente un booleano. `Fecha_Completado` se genera en backend con la fecha de Argentina; al volver a pendiente se limpia. Los parámetros de prescripción son de solo lectura.
