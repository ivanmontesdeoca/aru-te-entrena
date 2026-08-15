# Modelo de datos

El spreadsheet contiene nueve pestañas. Los registros nuevos usan UUID, salvo que `Catalogo_ID` preserve un identificador heredado no vacío.

1. `Usuarios`: `Usuario_ID`, `Alumno_ID`, `Email`, `Rol`, `Activo`, `UID_Auth`.
2. `Alumnos`: `Alumno_ID`, `Documento`, `Nombre`, `Apellido`, `Fecha_Nacimiento`, `Celular`, `Mail`, `Fecha_Alta`, `Objetivo`, `Dolencia`, `Observaciones`.
3. `Cobros`: `Cobro_ID`, `Alumno_ID`, `Mes_Abonado`, `Fecha_Pago`, `Importe`, `Estado_Pago`, `Medio_Pago`.
4. `Catalogo_de_Ejercicios`: `Catalogo_ID`, `Tipo_de_Ejercicio`, `Ejercicio`, `Video`, `Aclaraciones`, `Video_Adicional`, `Activo`.
5. `Plantilla_Sesion`: `Plantilla_Sesion_ID`, `Nombre_Plantilla`, `Objetivo`, `Grupo_Muscular_1`, `Grupo_Muscular_2`, `Notas`.
6. `Plantilla_Ejercicio`: `Plantilla_Ejercicio_ID`, `Plantilla_Sesion_ID`, `Tipo_Bloque`, `Orden_Bloque`, `Orden_Ejercicio`, `Catalogo_ID`, `Reps_Tiempo`, `Series`, `Carga`, `Descanso`, `RIR`, `Observaciones`.
7. `Rutina_Sesion`: `Rutina_Sesion_ID`, `Alumno_ID`, `Dia_Entrenamiento_Semana`, `Fecha`, `Titulo`, `Notas_Generales`, `Plantilla_Sesion_Origen_ID`, `Entrenamiento_Completado`, `Fecha_Completado`.
8. `Rutina_Ejercicio`: `Rutina_Ejercicio_ID`, `Rutina_Sesion_ID`, `Catalogo_ID`, `Tipo_Bloque`, `Orden_Bloque`, `Orden_Ejercicio`, `Instrumento_Alternativo`, `Reps_Tiempo`, `Series`, `Carga`, `Descanso`, `RIR`, `Observaciones`.
9. `Registro_Progreso`: `Registro_ID`, `Alumno_ID`, `Rutina_Ejercicio_ID`, `Catalogo_ID`, `Fecha_Registro`, `Meta_Peso`, `Meta_Repeticiones`, `Meta_Tiempo`.

## Reglas principales

- Una rutina se copia desde una plantilla; editarla no modifica la plantilla de origen.
- Un ejercicio archivado permanece visible en datos históricos, pero no se ofrece para nuevas selecciones.
- El progreso se consulta por alumno y ejercicio de catálogo, por lo que atraviesa distintas rutinas.
- Las tres métricas de progreso son opcionales individualmente. Guardar exige al menos una, conserva el cero explícito y nunca crea filas al completar una rutina.
- Completar una rutina es independiente del progreso y el MVP conserva sólo el último estado de completado de esa sesión.
- Los cobros no habilitan ni deshabilitan usuarios.
- No se implementa borrado físico de negocio.
