# Checklist pre-deploy

## Repositorio y build

- [ ] Git limpio
- [ ] Secretos fuera del repositorio y del historial
- [ ] Build de producción aprobado con Node.js 22 LTS
- [ ] TypeScript, ESLint y tests unitarios aprobados

## Variables y servicios

- [ ] Variables públicas Firebase configuradas para Production
- [ ] Variables server-only configuradas para Production
- [ ] `APP_ORIGIN` configurado con el origin HTTPS definitivo
- [ ] Credenciales Google configuradas sin ruta local
- [ ] Firebase Admin configurado
- [ ] `OPENAI_API_KEY` configurada sólo en servidor
- [ ] Spreadsheet compartido únicamente con la cuenta de servicio requerida
- [ ] Permisos IAM de la cuenta de servicio revisados con mínimo privilegio

## Firebase y acceso

- [ ] Dominio de producción autorizado en Firebase Authentication
- [ ] Recuperación de contraseña revisada: link, template, remitente, branding y Spam
- [ ] Login ADMIN probado
- [ ] Login ALUMNO probado
- [ ] Logout probado
- [ ] Usuario inactivo rechazado
- [ ] Acceso horizontal rechazado

## Smoke tests de producción

- [ ] Google Sheets: lectura y escritura controlada probadas
- [ ] OpenAI: generación ADMIN probada y salida estructurada validada
- [ ] Cookies verificadas como `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/` y duración limitada
- [ ] Origins no autorizados rechazados
- [ ] Responsive revisado en mobile y desktop
- [ ] Logos, favicon y assets cargan desde rutas públicas
- [ ] Mensajes de error no exponen detalles internos
- [ ] Cuotas, alertas y presupuesto OpenAI revisados
