import { z } from "zod";
import { uuidSchema } from "@/modules/shared/domain/schemas";
export const usuarioSchema = z.object({ Usuario_ID: uuidSchema, Alumno_ID: uuidSchema.nullable(), Email: z.email().transform((v) => v.toLowerCase()), Rol: z.enum(["ADMIN", "ALUMNO"]), Activo: z.boolean(), UID_Auth: z.string().min(1) }).superRefine((v, ctx) => { if (v.Rol === "ALUMNO" && !v.Alumno_ID) ctx.addIssue({ code: "custom", path: ["Alumno_ID"], message: "Alumno_ID es obligatorio para el rol ALUMNO" }); });
export type UsuarioInput = z.input<typeof usuarioSchema>;
