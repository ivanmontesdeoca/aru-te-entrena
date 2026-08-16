# Desarrollo incremental con IA

Este proyecto se construyó mediante un proceso incremental asistido por IA, con decisiones funcionales y validación final a cargo de una persona. La IA se utilizó como colaboradora técnica para analizar requisitos, proponer estructuras, implementar cambios y ejecutar comprobaciones; no sustituyó la revisión profesional ni la aceptación humana.

## Enfoque utilizado

El trabajo se dividió en etapas acotadas. Cada etapa definió explícitamente:

- objetivo y alcance;
- funcionalidades incluidas y excluidas;
- reglas de negocio que debían conservarse;
- pruebas mínimas;
- criterios para detenerse y solicitar revisión.

La implementación comenzó por tipos, validaciones, contratos e infraestructura. Después se incorporaron persistencia, autenticación, módulos administrativos, experiencia del alumno, progreso, cobros, asistencia de IA y ajustes visuales. La preparación de producción se trató como una etapa separada del despliegue.

## Ciclo de cada etapa

1. Aclarar decisiones ambiguas antes de cambiar el modelo.
2. Inspeccionar el código y documentación existentes.
3. Implementar únicamente el alcance aprobado.
4. Ejecutar TypeScript, ESLint y pruebas focalizadas.
5. Usar integraciones reales sólo cuando eran necesarias y con datos identificables de prueba.
6. Detenerse para revisión humana antes de avanzar.
7. Incorporar hallazgos de pruebas manuales como correcciones focalizadas.

Este ciclo permitió detectar diferencias entre corrección técnica y experiencia real. Por ejemplo, los recorridos manuales sirvieron para ajustar navegación, feedback y patrones de búsqueda sin rehacer la arquitectura aprobada.

## Decisiones y supervisión humana

Las reglas funcionales fueron confirmadas de forma explícita: modelo de progreso, estado de entrenamientos, roles, alta administrativa, privacidad del asistente y límites del flujo de aclaración. Cuando una decisión dependía del criterio profesional de la entrenadora, la IA debía pedir una aclaración o indicar información insuficiente.

La aceptación visual también fue humana. Las comprobaciones automáticas validaron tipos, reglas y build, pero no se utilizaron como sustituto de la revisión de identidad, legibilidad, responsive y flujo de uso.

## Pruebas y seguridad

Se priorizaron pruebas unitarias para reglas de dominio y pruebas focalizadas para recorridos críticos. Las integraciones externas se mantuvieron separadas para evitar consumo accidental de cuotas. Los registros de integración utilizan nombres reservados de prueba y deben limpiar sólo los datos que crean.

Durante el desarrollo se mantuvieron estas restricciones:

- no incluir secretos ni credenciales en código o Git;
- no mostrar tokens, cookies, claves ni contraseñas;
- no enviar datos personales innecesarios al proveedor de IA;
- no confiar en identificadores de alumno enviados por el navegador;
- no desplegar ni modificar infraestructura externa sin autorización específica;
- no alterar permisos de Git automáticamente ante un bloqueo del entorno.

## Uso de IA dentro del producto

El asistente de planificación de la aplicación es distinto de la IA utilizada durante el desarrollo. En el producto, la generación está limitada al rol `ADMIN`, usa contexto minimizado, devuelve una estructura validada y nunca persiste automáticamente. La entrenadora revisa y edita antes de guardar.

## Límites del enfoque

La asistencia de IA puede acelerar análisis e implementación, pero requiere revisión de código, pruebas reproducibles y validación humana. El historial de etapas no prueba por sí solo comportamiento en producción: configuración de dominios, credenciales, cuotas y smoke tests deben verificarse en el entorno definitivo antes del lanzamiento.
