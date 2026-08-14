import type { Alumno } from "@/modules/alumnos/domain/alumno";
import { alumnoSchema } from "@/modules/alumnos/domain/schema";
import type { Cobro } from "@/modules/cobros/domain/cobro";
import { cobroSchema } from "@/modules/cobros/domain/schema";
import type { Ejercicio } from "@/modules/ejercicios/domain/ejercicio";
import { ejercicioSchema } from "@/modules/ejercicios/domain/schema";
import type { PlantillaEjercicio, PlantillaSesion } from "@/modules/plantillas/domain/plantilla";
import {
  plantillaEjercicioSchema,
  plantillaSesionSchema,
} from "@/modules/plantillas/domain/schema";
import type { RegistroProgreso } from "@/modules/progresos/domain/registro-progreso";
import { registroProgresoSchema } from "@/modules/progresos/domain/schema";
import type { RutinaEjercicio, RutinaSesion } from "@/modules/rutinas/domain/rutina";
import { rutinaEjercicioSchema, rutinaSesionSchema } from "@/modules/rutinas/domain/schema";
import type { Usuario } from "@/modules/usuarios/domain/usuario";
import { usuarioSchema } from "@/modules/usuarios/domain/schema";
import type { EntitySheetMapper, SheetRecord } from "./mapper";
import {
  asString,
  parseBoolean,
  parseNullableNumber,
  parseNullableString,
  parseNumber,
  toSheetCell,
  validateEntity,
} from "./mapper";

function recordFromEntity(entity: object): SheetRecord {
  return Object.fromEntries(
    Object.entries(entity).map(([header, value]) => [header, toSheetCell(value)]),
  );
}

export const usuarioMapper: EntitySheetMapper<Usuario> = {
  headers: ["Usuario_ID", "Alumno_ID", "Email", "Rol", "Activo", "UID_Auth"],
  idHeader: "Usuario_ID",
  fromRecord: (row) =>
    validateEntity(usuarioSchema, {
      Usuario_ID: asString(row.Usuario_ID),
      Alumno_ID: parseNullableString(row.Alumno_ID),
      Email: asString(row.Email),
      Rol: asString(row.Rol),
      Activo: parseBoolean(row.Activo),
      UID_Auth: asString(row.UID_Auth),
    }) as Usuario,
  toRecord: recordFromEntity,
};

export const alumnoMapper: EntitySheetMapper<Alumno> = {
  headers: [
    "Alumno_ID",
    "Documento",
    "Nombre",
    "Apellido",
    "Fecha_Nacimiento",
    "Celular",
    "Mail",
    "Fecha_Alta",
    "Objetivo",
    "Dolencia",
    "Observaciones",
  ],
  idHeader: "Alumno_ID",
  fromRecord: (row) =>
    validateEntity(alumnoSchema, {
      Alumno_ID: asString(row.Alumno_ID),
      Documento: asString(row.Documento),
      Nombre: asString(row.Nombre),
      Apellido: asString(row.Apellido),
      Fecha_Nacimiento: asString(row.Fecha_Nacimiento),
      Celular: asString(row.Celular),
      Mail: asString(row.Mail),
      Fecha_Alta: asString(row.Fecha_Alta),
      Objetivo: asString(row.Objetivo),
      Dolencia: asString(row.Dolencia),
      Observaciones: asString(row.Observaciones),
    }) as Alumno,
  toRecord: recordFromEntity,
};

export const cobroMapper: EntitySheetMapper<Cobro> = {
  headers: [
    "Cobro_ID",
    "Alumno_ID",
    "Mes_Abonado",
    "Fecha_Pago",
    "Importe",
    "Estado_Pago",
    "Medio_Pago",
  ],
  idHeader: "Cobro_ID",
  fromRecord: (row) =>
    validateEntity(cobroSchema, {
      Cobro_ID: asString(row.Cobro_ID),
      Alumno_ID: asString(row.Alumno_ID),
      Mes_Abonado: asString(row.Mes_Abonado),
      Fecha_Pago: parseNullableString(row.Fecha_Pago),
      Importe: parseNumber(row.Importe),
      Estado_Pago: asString(row.Estado_Pago),
      Medio_Pago: asString(row.Medio_Pago),
    }) as Cobro,
  toRecord: recordFromEntity,
};

export const ejercicioMapper: EntitySheetMapper<Ejercicio> = {
  headers: [
    "Catalogo_ID",
    "Tipo_de_Ejercicio",
    "Ejercicio",
    "Video",
    "Aclaraciones",
    "Video_Adicional",
    "Activo",
  ],
  idHeader: "Catalogo_ID",
  fromRecord: (row) =>
    validateEntity(ejercicioSchema, {
      Catalogo_ID: asString(row.Catalogo_ID),
      Tipo_de_Ejercicio: asString(row.Tipo_de_Ejercicio),
      Ejercicio: asString(row.Ejercicio),
      Video: asString(row.Video),
      Aclaraciones: asString(row.Aclaraciones),
      Video_Adicional: asString(row.Video_Adicional),
      Activo: parseBoolean(row.Activo),
    }) as Ejercicio,
  toRecord: recordFromEntity,
};

export const plantillaSesionMapper: EntitySheetMapper<PlantillaSesion> = {
  headers: [
    "Plantilla_Sesion_ID",
    "Fecha_Carga",
    "Nombre_Plantilla",
    "Objetivo",
    "Grupo_Muscular_1",
    "Grupo_Muscular_2",
    "Notas",
  ],
  idHeader: "Plantilla_Sesion_ID",
  fromRecord: (row) =>
    validateEntity(plantillaSesionSchema, {
      Plantilla_Sesion_ID: asString(row.Plantilla_Sesion_ID),
      Fecha_Carga: asString(row.Fecha_Carga),
      Nombre_Plantilla: asString(row.Nombre_Plantilla),
      Objetivo: asString(row.Objetivo),
      Grupo_Muscular_1: asString(row.Grupo_Muscular_1),
      Grupo_Muscular_2: asString(row.Grupo_Muscular_2),
      Notas: asString(row.Notas),
    }) as PlantillaSesion,
  toRecord: recordFromEntity,
};

export const plantillaEjercicioMapper: EntitySheetMapper<PlantillaEjercicio> = {
  headers: [
    "Plantilla_Ejercicio_ID",
    "Plantilla_Sesion_ID",
    "Tipo_Bloque",
    "Orden_Bloque",
    "Orden_Ejercicio",
    "Catalogo_ID",
    "Reps_Tiempo",
    "Series",
    "Carga",
    "Descanso",
    "RIR",
    "Observaciones",
  ],
  idHeader: "Plantilla_Ejercicio_ID",
  fromRecord: (row) =>
    validateEntity(plantillaEjercicioSchema, {
      Plantilla_Ejercicio_ID: asString(row.Plantilla_Ejercicio_ID),
      Plantilla_Sesion_ID: asString(row.Plantilla_Sesion_ID),
      Tipo_Bloque: asString(row.Tipo_Bloque),
      Orden_Bloque: parseNumber(row.Orden_Bloque),
      Orden_Ejercicio: parseNumber(row.Orden_Ejercicio),
      Catalogo_ID: asString(row.Catalogo_ID),
      Reps_Tiempo: asString(row.Reps_Tiempo),
      Series: asString(row.Series),
      Carga: asString(row.Carga),
      Descanso: asString(row.Descanso),
      RIR: asString(row.RIR),
      Observaciones: asString(row.Observaciones),
    }) as PlantillaEjercicio,
  toRecord: recordFromEntity,
};

export const rutinaSesionMapper: EntitySheetMapper<RutinaSesion> = {
  headers: [
    "Rutina_Sesion_ID",
    "Alumno_ID",
    "Dia_Entrenamiento_Semana",
    "Fecha",
    "Titulo",
    "Notas_Generales",
    "Plantilla_Sesion_Origen_ID",
    "Entrenamiento_Completado",
    "Fecha_Completado",
  ],
  idHeader: "Rutina_Sesion_ID",
  fromRecord: (row) =>
    validateEntity(rutinaSesionSchema, {
      Rutina_Sesion_ID: asString(row.Rutina_Sesion_ID),
      Alumno_ID: asString(row.Alumno_ID),
      Dia_Entrenamiento_Semana: asString(row.Dia_Entrenamiento_Semana),
      Fecha: asString(row.Fecha),
      Titulo: asString(row.Titulo),
      Notas_Generales: asString(row.Notas_Generales),
      Plantilla_Sesion_Origen_ID: parseNullableString(row.Plantilla_Sesion_Origen_ID),
      Entrenamiento_Completado: parseBoolean(row.Entrenamiento_Completado),
      Fecha_Completado: parseNullableString(row.Fecha_Completado),
    }) as RutinaSesion,
  toRecord: recordFromEntity,
};

export const rutinaEjercicioMapper: EntitySheetMapper<RutinaEjercicio> = {
  headers: [
    "Rutina_Ejercicio_ID",
    "Rutina_Sesion_ID",
    "Catalogo_ID",
    "Tipo_Bloque",
    "Orden_Bloque",
    "Orden_Ejercicio",
    "Instrumento_Alternativo",
    "Reps_Tiempo",
    "Series",
    "Carga",
    "Descanso",
    "RIR",
    "Observaciones",
  ],
  idHeader: "Rutina_Ejercicio_ID",
  fromRecord: (row) =>
    validateEntity(rutinaEjercicioSchema, {
      Rutina_Ejercicio_ID: asString(row.Rutina_Ejercicio_ID),
      Rutina_Sesion_ID: asString(row.Rutina_Sesion_ID),
      Catalogo_ID: asString(row.Catalogo_ID),
      Tipo_Bloque: asString(row.Tipo_Bloque),
      Orden_Bloque: parseNumber(row.Orden_Bloque),
      Orden_Ejercicio: parseNumber(row.Orden_Ejercicio),
      Instrumento_Alternativo: asString(row.Instrumento_Alternativo),
      Reps_Tiempo: asString(row.Reps_Tiempo),
      Series: asString(row.Series),
      Carga: asString(row.Carga),
      Descanso: asString(row.Descanso),
      RIR: asString(row.RIR),
      Observaciones: asString(row.Observaciones),
    }) as RutinaEjercicio,
  toRecord: recordFromEntity,
};

export const registroProgresoMapper: EntitySheetMapper<RegistroProgreso> = {
  headers: [
    "Registro_ID",
    "Alumno_ID",
    "Rutina_Ejercicio_ID",
    "Catalogo_ID",
    "Fecha_Registro",
    "Meta_Peso",
    "Meta_Repeticiones",
    "Meta_Tiempo",
  ],
  idHeader: "Registro_ID",
  fromRecord: (row) =>
    validateEntity(registroProgresoSchema, {
      Registro_ID: asString(row.Registro_ID),
      Alumno_ID: asString(row.Alumno_ID),
      Rutina_Ejercicio_ID: asString(row.Rutina_Ejercicio_ID),
      Catalogo_ID: asString(row.Catalogo_ID),
      Fecha_Registro: asString(row.Fecha_Registro),
      Meta_Peso: parseNullableNumber(row.Meta_Peso),
      Meta_Repeticiones: parseNullableNumber(row.Meta_Repeticiones),
      Meta_Tiempo: parseNullableNumber(row.Meta_Tiempo),
    }) as RegistroProgreso,
  toRecord: recordFromEntity,
};
