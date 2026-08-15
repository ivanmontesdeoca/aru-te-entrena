import assert from "node:assert/strict";
import test from "node:test";
import type { Alumno } from "@/modules/alumnos/domain/alumno";
import type { AlumnoRepository } from "@/modules/alumnos/domain/repository";
import type { Ejercicio } from "@/modules/ejercicios/domain/ejercicio";
import type { EjercicioRepository } from "@/modules/ejercicios/domain/repository";
import type { PlantillaEjercicio, PlantillaSesion } from "@/modules/plantillas/domain/plantilla";
import type { PlantillaEjercicioRepository, PlantillaSesionRepository } from "@/modules/plantillas/domain/repository";
import type { RegistroProgreso } from "@/modules/progresos/domain/registro-progreso";
import type { RegistroProgresoRepository } from "@/modules/progresos/domain/repository";
import type { RutinaEjercicio, RutinaSesion } from "@/modules/rutinas/domain/rutina";
import type { RutinaEjercicioRepository, RutinaSesionRepository } from "@/modules/rutinas/domain/repository";
import { createRutinaAdminService } from "@/modules/rutinas/application/rutina-admin-service";
import { RutinaAdminError } from "@/modules/rutinas/application/errors";

class EntityStore<T extends object> {
  constructor(public values: T[], private readonly key: keyof T) {}
  findAll = async () => this.values;
  findById = async (id: string) => this.values.find((value) => value[this.key] === id) ?? null;
  create = async (value: T) => { this.values.push(value); };
  update = async (value: T) => { this.values = this.values.map((current) => current[this.key] === value[this.key] ? value : current); };
  save = this.update;
}

const alumno: Alumno = { Alumno_ID: "11111111-1111-4111-8111-111111111111", Documento: "ARU_TEST", Nombre: "Aru", Apellido: "Test", Fecha_Nacimiento: "1990-01-01", Celular: "", Mail: "test@example.invalid", Fecha_Alta: "2026-08-15", Objetivo: "", Dolencia: "", Observaciones: "" };
const catalogo: Ejercicio = { Catalogo_ID: "22222222-2222-4222-8222-222222222222", Tipo_de_Ejercicio: "Fuerza", Ejercicio: "Sentadilla", Video: "", Aclaraciones: "", Video_Adicional: "", Activo: true };
const sesion: RutinaSesion = { Rutina_Sesion_ID: "33333333-3333-4333-8333-333333333333", Alumno_ID: alumno.Alumno_ID, Dia_Entrenamiento_Semana: "Día 1", Fecha: "2026-08-15", Titulo: "ARU_TEST", Notas_Generales: "", Plantilla_Sesion_Origen_ID: null, Entrenamiento_Completado: false, Fecha_Completado: null };
const ejercicio: RutinaEjercicio = { Rutina_Ejercicio_ID: "44444444-4444-4444-8444-444444444444", Rutina_Sesion_ID: sesion.Rutina_Sesion_ID, Catalogo_ID: catalogo.Catalogo_ID, Tipo_Bloque: "Principal", Orden_Bloque: 1, Orden_Ejercicio: 1, Instrumento_Alternativo: "", Reps_Tiempo: "10", Series: "3", Carga: "", Descanso: "", RIR: "", Observaciones: "" };

function serviceWith(progressRows: RegistroProgreso[]) {
  const alumnos = new EntityStore([alumno], "Alumno_ID") as unknown as AlumnoRepository;
  const catalogStore = new EntityStore([catalogo], "Catalogo_ID");
  const catalog = Object.assign(catalogStore, { findAll: async () => catalogStore.values }) as unknown as EjercicioRepository;
  const templateStore = new EntityStore<PlantillaSesion>([], "Plantilla_Sesion_ID") as unknown as PlantillaSesionRepository;
  const templateItemsStore = new EntityStore<PlantillaEjercicio>([], "Plantilla_Ejercicio_ID");
  const templateItems = Object.assign(templateItemsStore, { findBySesion: async () => [] }) as unknown as PlantillaEjercicioRepository;
  const sessionStore = new EntityStore([sesion], "Rutina_Sesion_ID");
  const sessions = Object.assign(sessionStore, { findByAlumno: async () => [sesion], markCompleted: async () => {}, removeCreated: async () => {} }) as unknown as RutinaSesionRepository;
  const itemStore = new EntityStore([ejercicio], "Rutina_Ejercicio_ID");
  const items = Object.assign(itemStore, { findBySesion: async (id: string) => itemStore.values.filter((value) => value.Rutina_Sesion_ID === id), replaceForSesion: async (id: string, next: RutinaEjercicio[]) => { itemStore.values = [...itemStore.values.filter((value) => value.Rutina_Sesion_ID !== id), ...next]; } }) as unknown as RutinaEjercicioRepository;
  const progressStore = new EntityStore(progressRows, "Registro_ID");
  const progress = Object.assign(progressStore, { findHistory: async () => [], findLatest: async () => null }) as unknown as RegistroProgresoRepository;
  return createRutinaAdminService({ alumnos, catalog, templates: templateStore, templateItems, sessions, items, progress });
}

test("refuses to remove a routine occurrence that has progress", async () => {
  const progress = { Registro_ID: "progress-1", Alumno_ID: alumno.Alumno_ID, Rutina_Ejercicio_ID: ejercicio.Rutina_Ejercicio_ID, Catalogo_ID: catalogo.Catalogo_ID, Fecha_Registro: "2026-08-15", Meta_Peso: null, Meta_Repeticiones: 10, Meta_Tiempo: null } satisfies RegistroProgreso;
  const service = serviceWith([progress]);
  await assert.rejects(
    () => service.save(sesion.Rutina_Sesion_ID, sesion, []),
    (error: unknown) => error instanceof RutinaAdminError && error.code === "EXERCISE_HAS_PROGRESS",
  );
});
