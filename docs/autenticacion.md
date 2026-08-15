# Autenticación y autorización

La aplicación autentica email y contraseña en el navegador mediante Firebase Authentication. El ID token se envía una única vez a `POST /api/auth/session`; el backend lo verifica con Firebase Admin y vuelve a resolver el usuario por `UID_Auth` en la hoja `Usuarios`.

La sesión se guarda en la cookie `aru_session`, con `HttpOnly`, `SameSite=Lax`, duración limitada y `Secure` en producción. El cliente usa persistencia de Firebase en memoria y cierra su sesión local después de crear la cookie, por lo que no guarda tokens en `localStorage`.

## Fuente de autorización

`Usuarios` es la fuente de verdad para `Rol`, `Activo` y `Alumno_ID`. Los helpers privados vuelven a consultar esa tabla en cada acceso relevante:

- `getCurrentUser()` requiere una sesión válida y un único usuario activo.
- `requireAdmin()` exige el rol `ADMIN`.
- `requireAlumno()` exige el rol `ALUMNO`.
- `getAuthenticatedAlumnoId()` devuelve exclusivamente el `Alumno_ID` asociado al usuario autenticado.

Las rutas `/admin` y `/entrenamientos` tienen una comprobación preliminar de presencia de cookie y una autorización real en sus layouts de servidor. Los endpoints privados deben utilizar los mismos helpers y no aceptar un `Alumno_ID` del navegador como identidad efectiva.

## Cierre y recuperación

`POST /api/auth/logout` expira la cookie de sesión. El cliente también cierra la sesión de Firebase y redirige a `/login`. La pantalla `/recuperar-clave` envía el correo de restablecimiento mediante Firebase con una respuesta genérica para no revelar si una dirección está registrada.

Firebase Admin prioriza Application Default Credentials mediante `GOOGLE_APPLICATION_CREDENTIALS`. Las credenciales manuales antiguas se conservan únicamente como alternativa de compatibilidad.
