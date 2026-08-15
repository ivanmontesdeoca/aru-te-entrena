# Registro e historial de progreso

Registrar progreso es opcional e independiente de completar una rutina. No se crean filas automáticamente. Al guardar una marca se exige al menos una métrica, pero cada campo es individualmente opcional y el valor numérico `0` se conserva; los campos vacíos se persisten como celdas vacías mediante `null`.

El backend deriva `Alumno_ID` de la sesión, carga `Rutina_Ejercicio`, verifica la propiedad de su `Rutina_Sesion` y toma `Catalogo_ID` desde la composición. El navegador nunca decide alumno, catálogo ni fecha. `Registro_ID` y `Fecha_Registro` también se generan en backend.

La última marca y el historial se resuelven por `Alumno_ID + Catalogo_ID`, por lo que acompañan al ejercicio aunque aparezca en otra rutina. `Rutina_Ejercicio_ID` conserva el contexto original. Las lecturas del detalle agrupan todo el progreso del alumno para evitar una consulta por tarjeta.

La edición del alumno y la corrección administrativa solo reciben las tres métricas. Identificadores, propiedad, catálogo, contexto y fecha original se preservan. Los ejercicios archivados continúan resolviéndose contra el catálogo completo.
