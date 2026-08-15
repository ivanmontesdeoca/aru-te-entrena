# Arquitectura del MVP

## Capas

- `src/app`: páginas y endpoints de Next.js. Las páginas privadas autorizan en servidor y los endpoints vuelven a exigir sesión, rol y origen confiable.
- `src/modules/*/domain`: entidades, contratos de repositorio y errores del dominio.
- `src/modules/*/application`: casos de uso y validación de reglas. No conocen Google Sheets ni componentes React.
- `src/infrastructure`: adaptadores de Firebase y Google Sheets.
- `src/components`: interfaz reutilizable para administración, alumno y elementos base.

Google Sheets se accede mediante encabezados, no posiciones fijas. Los mapeadores convierten filas a entidades validadas con Zod y viceversa; las escrituras usan `valueInputOption: RAW`. Los repositorios detectan encabezados faltantes, IDs duplicados y filas incompatibles.

## Autenticación y autorización

Firebase Authentication valida email y contraseña. El backend verifica el ID token con Firebase Admin, busca exactamente un `Usuarios.UID_Auth` activo y emite una cookie de sesión `HttpOnly`. `Usuarios` mantiene `Rol`, `Activo` y `Alumno_ID` como fuente de verdad.

Los endpoints del alumno derivan siempre `Alumno_ID` de la sesión. Nunca confían en un identificador enviado por el navegador para decidir propiedad. Los cambios administrativos exigen rol `ADMIN` y validan el origen para mitigar CSRF.

La resolución de usuario está memoizada durante un mismo render de servidor. Así, el layout y la página comparten la verificación sin relajar la comprobación en requests posteriores.

## Módulos

- Alumnos: ficha, acceso Firebase, activación y desactivación.
- Cobros: registro, filtros y resumen; no cambia el estado de acceso.
- Catálogo: ejercicios activos o archivados y enlaces de video.
- Plantillas: sesiones modelo con bloques y ejercicios ordenados.
- Rutinas: copia independiente de una plantilla, personalizable por alumno.
- Entrenamientos: vista del alumno y estado completado.
- Progreso: marcas opcionales por `Alumno_ID + Catalogo_ID`, con edición e historial.

## Operaciones aproximadas de lectura

Cada acceso privado necesita una lectura de `Usuarios` además de la verificación Firebase. Antes de la memoización, las páginas con layout privado repetían esa resolución (dos lecturas de `Usuarios`); ahora realizan una por render.

- `/entrenamientos`: 1 lectura de `Usuarios` + 1 de `Rutina_Sesion`.
- Detalle de entrenamiento: 1 de `Usuarios` + lecturas agrupadas de sesión, ejercicios, catálogo y progreso. No lee una vez por ejercicio.
- Última marca: se obtiene de la única lectura agrupada de progreso del detalle.
- Historial: 1 de `Usuarios` + ejercicio, sesión y progreso; el historial se filtra por `Catalogo_ID`.
- Plantillas y editor de rutina: cargan colecciones relacionadas de forma agrupada; no existe un patrón N+1 por ejercicio.

Google Sheets no ofrece transacciones ni control de versión. El alcance actual supone una sola administradora y volumen reducido; ediciones manuales simultáneas pueden sobrescribir cambios.
