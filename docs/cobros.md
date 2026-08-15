# Gestión administrativa de cobros

La gestión de `/admin/cobros` requiere rol `ADMIN` y permite listar, filtrar, crear y editar registros. Los identificadores se generan en backend y cada `Alumno_ID` se valida contra la tabla `Alumnos`.

Los estados admitidos son `PAGADO` y `PENDIENTE`; los medios son `EFECTIVO` y `TRANSFERENCIA`. Un registro pagado exige fecha, mientras que uno pendiente puede conservarla vacía. El importe se almacena como número no negativo sin símbolos ni unidades.

El resumen se deriva de los cobros filtrados: cantidad registrada, suma de importes pagados y cantidad pendiente. No se agregaron tablas ni procesos contables.

La capa de cobros depende únicamente de los repositorios `Cobros` y `Alumnos`. No consulta ni modifica `Usuarios.Activo`; el acceso a la aplicación continúa bajo control manual de la entrenadora.
