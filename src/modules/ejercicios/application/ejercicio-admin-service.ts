import { randomUUID } from "node:crypto";
import type { EjercicioRepository } from "../domain/repository";
import { ejercicioSchema } from "../domain/schema";
import { EjercicioAdminError } from "./errors";
import { ejercicioFieldsSchema, type EjercicioFields } from "./schemas";

export function createEjercicioAdminService(repository: EjercicioRepository) {
  return {
    async list(filters: { search?: string; type?: string; status?: "active"|"archived"|"all" } = {}) {
      const all=await repository.findAll({includeArchived:true}); const search=(filters.search??"").trim().toLocaleLowerCase("es");
      const status=filters.status??"active";
      return all.filter((item)=>(!search||item.Ejercicio.toLocaleLowerCase("es").includes(search))&&(!filters.type||item.Tipo_de_Ejercicio===filters.type)&&(status==="all"||(status==="active"?item.Activo:!item.Activo))).sort((a,b)=>a.Ejercicio.localeCompare(b.Ejercicio,"es"));
    },
    async types(){return [...new Set((await repository.findAll({includeArchived:true})).map(item=>item.Tipo_de_Ejercicio))].sort((a,b)=>a.localeCompare(b,"es"));},
    async get(id:string){const item=await repository.findById(id);if(!item)throw new EjercicioAdminError("EJERCICIO_NOT_FOUND");return item;},
    async create(input:EjercicioFields){const fields=ejercicioFieldsSchema.parse(input);const item=ejercicioSchema.parse({...fields,Catalogo_ID:randomUUID(),Activo:true});await repository.create(item);return item;},
    async update(id:string,input:EjercicioFields){const current=await repository.findById(id);if(!current)throw new EjercicioAdminError("EJERCICIO_NOT_FOUND");const fields=ejercicioFieldsSchema.parse(input);const item=ejercicioSchema.parse({...current,...fields,Catalogo_ID:id});await repository.update(item);return item;},
    async setActive(id:string,active:boolean){const current=await repository.findById(id);if(!current)throw new EjercicioAdminError("EJERCICIO_NOT_FOUND");const item={...current,Activo:active};await repository.update(item);return item;},
  };
}
