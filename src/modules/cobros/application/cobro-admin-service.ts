import { randomUUID } from "node:crypto";
import type { AlumnoRepository } from "@/modules/alumnos/domain/repository";
import type { CobroRepository } from "../domain/repository";
import { cobroSchema } from "../domain/schema";
import { CobroAdminError } from "./errors";
import { cobroFieldsSchema, type CobroFields } from "./schemas";
export function createCobroAdminService({ cobros, alumnos }: { cobros: CobroRepository; alumnos: AlumnoRepository }) {
  return {
    async options() { return (await alumnos.findAll()).sort((a,b)=>`${a.Apellido} ${a.Nombre}`.localeCompare(`${b.Apellido} ${b.Nombre}`)); },
    async list(filters: { search?: string; alumnoId?: string; month?: string; status?: string } = {}) { const [rows, students] = await Promise.all([cobros.findAll(), alumnos.findAll()]); const byId = new Map(students.map(student=>[student.Alumno_ID,student])); const search=(filters.search??"").trim().toLowerCase(); const entries=rows.filter(row=>{const student=byId.get(row.Alumno_ID);return(!search||`${student?.Nombre??""} ${student?.Apellido??""}`.toLowerCase().includes(search))&&(!filters.alumnoId||row.Alumno_ID===filters.alumnoId)&&(!filters.month||row.Mes_Abonado===filters.month)&&(!filters.status||filters.status==="TODOS"||row.Estado_Pago===filters.status);}).map(cobro=>({cobro,alumno:byId.get(cobro.Alumno_ID)??null})).sort((a,b)=>b.cobro.Mes_Abonado.localeCompare(a.cobro.Mes_Abonado)||String(b.cobro.Fecha_Pago??"").localeCompare(String(a.cobro.Fecha_Pago??""))); return { entries, summary: { registrados: entries.length, totalCobrado: entries.filter(x=>x.cobro.Estado_Pago==="PAGADO").reduce((sum,x)=>sum+x.cobro.Importe,0), pendientes: entries.filter(x=>x.cobro.Estado_Pago==="PENDIENTE").length } }; },
    async get(id:string){const cobro=await cobros.findById(id);if(!cobro)throw new CobroAdminError("COBRO_NOT_FOUND");return{cobro,students:await alumnos.findAll()};},
    async create(input:CobroFields){const fields=cobroFieldsSchema.parse(input);if(!(await alumnos.findById(fields.Alumno_ID)))throw new CobroAdminError("ALUMNO_NOT_FOUND",400);const cobro=cobroSchema.parse({...fields,Cobro_ID:randomUUID()});await cobros.create(cobro);return cobro;},
    async update(id:string,input:CobroFields){const fields=cobroFieldsSchema.parse(input);if(!(await cobros.findById(id)))throw new CobroAdminError("COBRO_NOT_FOUND");if(!(await alumnos.findById(fields.Alumno_ID)))throw new CobroAdminError("ALUMNO_NOT_FOUND",400);const cobro=cobroSchema.parse({...fields,Cobro_ID:id});await cobros.update(cobro);return cobro;},
    async recentForStudent(alumnoId:string,limit=5){return(await cobros.findByAlumno(alumnoId)).sort((a,b)=>b.Mes_Abonado.localeCompare(a.Mes_Abonado)||String(b.Fecha_Pago??"").localeCompare(String(a.Fecha_Pago??""))).slice(0,limit);}
  };
}
