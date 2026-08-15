import assert from "node:assert/strict";
import test from "node:test";
import type { Ejercicio } from "@/modules/ejercicios/domain/ejercicio";
import type { EjercicioRepository } from "@/modules/ejercicios/domain/repository";
import { createEjercicioAdminService } from "@/modules/ejercicios/application/ejercicio-admin-service";
import { ejercicioFieldsSchema } from "@/modules/ejercicios/application/schemas";

class MemoryRepository implements EjercicioRepository {constructor(public values:Ejercicio[]){}findAll=async(options?:{includeArchived?:boolean})=>options?.includeArchived?this.values:this.values.filter(x=>x.Activo);findById=async(id:string)=>this.values.find(x=>x.Catalogo_ID===id)??null;create=async(x:Ejercicio)=>{this.values.push(x)};update=async(x:Ejercicio)=>{this.values=this.values.map(v=>v.Catalogo_ID===x.Catalogo_ID?x:v)};save=async(x:Ejercicio)=>{if(await this.findById(x.Catalogo_ID))await this.update(x);else await this.create(x)}}
const inherited:Ejercicio={Catalogo_ID:"LEGACY-001",Tipo_de_Ejercicio:"Fuerza",Ejercicio:"Sentadilla",Video:"https://youtu.be/test",Aclaraciones:"",Video_Adicional:"",Activo:true};
const archived:Ejercicio={Catalogo_ID:"LEGACY-002",Tipo_de_Ejercicio:"Cardio",Ejercicio:"Burpee",Video:"",Aclaraciones:"",Video_Adicional:"",Activo:false};

test("filters by name, type and state in memory",async()=>{const service=createEjercicioAdminService(new MemoryRepository([inherited,archived]));assert.deepEqual((await service.list({search:"senta"})).map(x=>x.Catalogo_ID),["LEGACY-001"]);assert.deepEqual((await service.list({type:"Cardio",status:"archived"})).map(x=>x.Catalogo_ID),["LEGACY-002"]);assert.equal((await service.list({status:"all"})).length,2);});
test("creates a UUID and defaults to active",async()=>{const repository=new MemoryRepository([]);const created=await createEjercicioAdminService(repository).create({Tipo_de_Ejercicio:"Movilidad",Ejercicio:"ARU_TEST NUEVO",Video:"",Aclaraciones:"",Video_Adicional:""});assert.match(created.Catalogo_ID,/^[0-9a-f-]{36}$/);assert.equal(created.Activo,true);});
test("updates inherited IDs without changing them and archives/reactivates",async()=>{const repository=new MemoryRepository([inherited]);const service=createEjercicioAdminService(repository);const updated=await service.update("LEGACY-001",{Tipo_de_Ejercicio:"Fuerza",Ejercicio:"Sentadilla editada",Video:"",Aclaraciones:"ok",Video_Adicional:""});assert.equal(updated.Catalogo_ID,"LEGACY-001");assert.equal((await service.setActive("LEGACY-001",false)).Activo,false);assert.equal((await service.setActive("LEGACY-001",true)).Activo,true);});
test("rejects malformed optional URLs",()=>{assert.throws(()=>ejercicioFieldsSchema.parse({Tipo_de_Ejercicio:"Fuerza",Ejercicio:"Prueba",Video:"youtube sin esquema",Aclaraciones:"",Video_Adicional:""}));});
