# Gestión de alumnos y accesos

Todas las páginas y operaciones de este módulo exigen rol `ADMIN` en el servidor.

## Flujo de alta

1. `POST /api/admin/alumnos` valida los datos y genera `Alumno_ID` mediante UUID en el backend.
2. La ficha queda inicialmente sin acceso, salvo que la administradora elija crearlo.
3. `POST /api/admin/alumnos/:id/acceso` normaliza y valida el email, comprueba `Usuarios`, crea Firebase Authentication y luego la fila `Usuarios` con rol `ALUMNO`.
4. Si falla Sheets después de crear Firebase, el servicio elimina compensatoriamente la cuenta Firebase.
5. El navegador administrador solicita a Firebase el correo de restablecimiento. Firebase Admin no envía emails por sí mismo; usar el SDK cliente evita incorporar otro proveedor.

El reenvío usa el mismo mecanismo. Las contraseñas, tokens y enlaces de acción no se almacenan ni registran.

## Estado del acceso

Al deshabilitar se conserva el alumno, la fila `Usuarios` y la cuenta Firebase. Se cambia `Usuarios.Activo` y se revocan los refresh tokens. La autorización de la Etapa 3 vuelve a consultar `Usuarios`, por lo que una sesión deja de ser aceptada inmediatamente.

Al habilitar se actualiza la misma fila y el alumno puede autenticarse nuevamente, sin crear otra cuenta.

## Rutas

- `/admin/alumnos`: listado y búsqueda.
- `/admin/alumnos/nuevo`: alta sin ID proporcionado por el cliente.
- `/admin/alumnos/:id`: datos personales, entrenamiento y acceso.
- `/api/admin/alumnos/*`: endpoints administrativos protegidos.
