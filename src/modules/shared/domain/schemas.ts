import { z } from "zod";
import type { DiaEntrenamiento } from "./primitives";

export const uuidSchema = z.string().uuid();
export const catalogoIdSchema = z.string().trim().min(1).max(200);
export const isoDateSchema = z.iso.date();
export const isoDateTimeSchema = z.iso.datetime({ offset: true });
export const optionalTextSchema = z.string().trim().max(2000).default("");
export const requiredTextSchema = z.string().trim().min(1).max(500);
export const positiveOrderSchema = z.number().int().positive();
export const diaEntrenamientoSchema = z.string().regex(/^Día [1-9]\d*$/) as z.ZodType<DiaEntrenamiento>;
export const optionalUrlSchema = z.union([z.url(), z.literal("")]);
