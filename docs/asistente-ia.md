# Asistente IA para planificación

La función está disponible sólo para `ADMIN` en `/admin/rutinas/nueva`. La entrenadora elige **Crear con IA**, genera una propuesta, la revisa y puede cargarla en el editor normal. Ni la llamada, ni la aclaración, ni la vista previa escriben en Google Sheets. La persistencia ocurre únicamente al pulsar **Guardar rutina** dentro del editor.

## Datos enviados a OpenAI

Se aplica minimización. Se envían solamente:

- objetivo general, dolencia y observaciones del alumno;
- objetivo particular, foco, duración, cantidad aproximada de bloques e indicaciones de la solicitud;
- aclaración profesional, sólo si hubo una ronda;
- hasta tres rutinas recientes, reducidas a título, fecha, notas y prescripción útil;
- ejercicios activos: `Catalogo_ID`, tipo, nombre y aclaraciones.

No se envían nombre, apellido, documento, nacimiento, teléfono, email, cobros, UID, credenciales ni URLs de video. Preguntas y respuestas de aclaración permanecen en el estado temporal del navegador.

## Seguridad y validación

El endpoint exige rol `ADMIN`, valida origen y recupera el alumno por `Alumno_ID` en backend. La respuesta usa Structured Outputs con Zod. Después de recibirla, el servicio comprueba nuevamente que cada `Catalogo_ID` existe y está activo. Un ID externo o archivado invalida toda la propuesta.

La IA puede devolver `READY` o `NEEDS_CLARIFICATION`. Se permite una sola pregunta con hasta cinco opciones y respuesta libre. Tras responder, debe generar o indicar que la información continúa siendo insuficiente.

## Proveedor y operación

Se utiliza Responses API con `gpt-5.4-mini`, esfuerzo bajo, timeout de 30 segundos y sin reintentos automáticos. El modelo ofrece Structured Outputs y un equilibrio adecuado entre calidad, latencia y costo para una tarea estructurada y supervisada. Los logs conservan sólo éxito/fallo, código seguro, modelo, latencia y tokens; nunca prompt ni datos del alumno.

Configurar `OPENAI_API_KEY` sólo en el servidor. No utilizar prefijo `NEXT_PUBLIC_`.
