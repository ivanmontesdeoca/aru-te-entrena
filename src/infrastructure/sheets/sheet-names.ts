export const SHEET_NAMES = {
  usuarios: "Usuarios",
  alumnos: "Alumnos",
  cobros: "Cobros",
  catalogoEjercicios: "Catalogo_de_Ejercicios",
  plantillaSesion: "Plantilla_Sesion",
  plantillaEjercicio: "Plantilla_Ejercicio",
  rutinaSesion: "Rutina_Sesion",
  rutinaEjercicio: "Rutina_Ejercicio",
  registroProgreso: "Registro_Progreso",
} as const;

export type SheetName = (typeof SHEET_NAMES)[keyof typeof SHEET_NAMES];
