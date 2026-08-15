# Sistema visual · Estudio Axis

La interfaz usa **Poppins** mediante `next/font` y los assets oficiales sin transformaciones:

- `public/brand/logo-estudio-axis-vertical.png`: login y piezas institucionales.
- `public/brand/logo-estudio-axis-horizontal.png`: header administrativo de escritorio.
- `public/brand/isotipo-estudio-axis.png`: headers compactos y favicon.

Los tamaños se adaptan manteniendo la relación de aspecto original.

## Tokens principales

Los tokens viven en `src/app/globals.css`:

- principal bosque `#114f3d`;
- secundario salvia `#98a67b`;
- acento agua `#69aaa2`;
- acento cálido durazno `#f1b382`;
- fondo crema `#fbf8f2`;
- superficie blanca `#ffffff`;
- texto principal `#17342c`.

Estados de éxito, advertencia, error y archivado combinan color, texto y un indicador visible; nunca dependen sólo del color.

## Responsive y accesibilidad

ADMIN prioriza escritorio y usa navegación compacta desplegable en móvil. ALUMNO prioriza tarjetas y acciones móviles. Los controles críticos mantienen una altura táctil mínima de 44 px, los campos numéricos sugieren teclado numérico, el foco es visible y se respeta `prefers-reduced-motion`.
