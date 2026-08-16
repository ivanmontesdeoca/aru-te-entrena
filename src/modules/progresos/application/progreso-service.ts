import { randomUUID } from "node:crypto";
import type { EjercicioRepository } from "@/modules/ejercicios/domain/repository";
import type { RegistroProgresoRepository } from "../domain/repository";
import type { RutinaEjercicioRepository, RutinaSesionRepository } from "@/modules/rutinas/domain/repository";
import { registroProgresoSchema } from "../domain/schema";
import { progressMetricsSchema, type ProgressMetrics } from "./schemas";
import { ProgresoError } from "./errors";
export function createProgresoService({ progress, items, sessions, catalog, now = () => new Date() }: { progress: RegistroProgresoRepository; items: RutinaEjercicioRepository; sessions: RutinaSesionRepository; catalog: EjercicioRepository; now?: () => Date }) {
  async function ownedItem(alumnoId: string, itemId: string) { const item = await items.findById(itemId); if (!item) throw new ProgresoError("RUTINA_EJERCICIO_NOT_FOUND"); const session = await sessions.findById(item.Rutina_Sesion_ID); if (!session) throw new ProgresoError("RUTINA_NOT_FOUND"); if (session.Alumno_ID !== alumnoId) throw new ProgresoError("FORBIDDEN", 403); return item; }
  async function listForAlumno(alumnoId: string) { const [rows, allCatalog, allItems] = await Promise.all([progress.findAll(), catalog.findAll({ includeArchived: true }), items.findAll()]); const byCatalog = new Map(allCatalog.map((item) => [item.Catalogo_ID, item])); const byItem = new Map(allItems.map((item) => [item.Rutina_Ejercicio_ID, item])); return rows.filter((row) => row.Alumno_ID === alumnoId).sort((a, b) => b.Fecha_Registro.localeCompare(a.Fecha_Registro)).map((record) => ({ record, catalog: byCatalog.get(record.Catalogo_ID) ?? null, sessionId: byItem.get(record.Rutina_Ejercicio_ID)?.Rutina_Sesion_ID ?? null })); }
  return {
    async create(alumnoId: string, itemId: string, metricsInput: ProgressMetrics) { const metrics = progressMetricsSchema.parse(metricsInput); const item = await ownedItem(alumnoId, itemId); const record = registroProgresoSchema.parse({ Registro_ID: randomUUID(), Alumno_ID: alumnoId, Rutina_Ejercicio_ID: item.Rutina_Ejercicio_ID, Catalogo_ID: item.Catalogo_ID, Fecha_Registro: now().toISOString(), ...metrics }); await progress.create(record); return record; },
    async historyForItem(alumnoId: string, itemId: string) { const item = await ownedItem(alumnoId, itemId); return progress.findHistory(alumnoId, item.Catalogo_ID); },
    async historyDetailForItem(alumnoId: string, itemId: string) { const item = await ownedItem(alumnoId, itemId); const [history, exercise] = await Promise.all([progress.findHistory(alumnoId, item.Catalogo_ID), catalog.findById(item.Catalogo_ID)]); return { history, catalog: exercise, item }; },
    async updateOwn(alumnoId: string, id: string, metricsInput: ProgressMetrics) { const metrics = progressMetricsSchema.parse(metricsInput); const current = await progress.findById(id); if (!current) throw new ProgresoError("PROGRESS_NOT_FOUND"); if (current.Alumno_ID !== alumnoId) throw new ProgresoError("FORBIDDEN", 403); const updated = { ...current, ...metrics }; await progress.update(updated); return updated; },
    async listAdmin(alumnoId: string) { const [rows, allCatalog] = await Promise.all([progress.findAll(), catalog.findAll({ includeArchived: true })]); const byId = new Map(allCatalog.map((item) => [item.Catalogo_ID, item])); return rows.filter((row) => row.Alumno_ID === alumnoId).sort((a, b) => b.Fecha_Registro.localeCompare(a.Fecha_Registro)).map((record) => ({ record, catalog: byId.get(record.Catalogo_ID) ?? null })); },
    listForAlumno,
    async updateAdmin(id: string, metricsInput: ProgressMetrics) { const metrics = progressMetricsSchema.parse(metricsInput); const current = await progress.findById(id); if (!current) throw new ProgresoError("PROGRESS_NOT_FOUND"); const updated = { ...current, ...metrics }; await progress.update(updated); return updated; },
  };
}
