import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, describe, it } from "node:test";
import { google } from "googleapis";
import {
  GoogleSheetsAlumnoRepository, GoogleSheetsEjercicioRepository,
  GoogleSheetsPlantillaEjercicioRepository, GoogleSheetsPlantillaSesionRepository,
  GoogleSheetsRegistroProgresoRepository, GoogleSheetsRutinaEjercicioRepository,
  GoogleSheetsRutinaSesionRepository,
} from "@/infrastructure/sheets/repositories";
import { SHEET_NAMES } from "@/infrastructure/sheets/sheet-names";
import { createRutinaAdminService } from "@/modules/rutinas/application/rutina-admin-service";
import { RutinaAdminError } from "@/modules/rutinas/application/errors";

const alumnoId=randomUUID(), catalogId=randomUUID(), templateId=randomUUID(), templateItemId=randomUUID();
let routineId=""; const routineItemIds:string[]=[];
async function clear(sheet:string,ids:string[],end:string){
  if(!ids.length)return; const spreadsheetId=process.env.GOOGLE_SHEETS_SPREADSHEET_ID; assert.ok(spreadsheetId);
  const api=google.sheets({version:"v4",auth:new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/spreadsheets"]})});
  const response=await api.spreadsheets.values.get({spreadsheetId,range:`'${sheet}'!A2:A`});
  const ranges=(response.data.values??[]).map((row,index)=>({id:String(row[0]??""),range:`'${sheet}'!A${index+2}:${end}${index+2}`})).filter(x=>ids.includes(x.id)).map(x=>x.range);
  if(ranges.length)await api.spreadsheets.values.batchClear({spreadsheetId,requestBody:{ranges}});
}
after(async()=>{
  await clear(SHEET_NAMES.rutinaEjercicio,routineItemIds,"M"); await clear(SHEET_NAMES.rutinaSesion,routineId?[routineId]:[],"I");
  await clear(SHEET_NAMES.plantillaEjercicio,[templateItemId],"L"); await clear(SHEET_NAMES.plantillaSesion,[templateId],"G");
  await clear(SHEET_NAMES.alumnos,[alumnoId],"K"); await clear(SHEET_NAMES.catalogoEjercicios,[catalogId],"G");
});

describe("real routines integration",()=>{it("clones independently, edits and filters",async()=>{
  const alumnos=new GoogleSheetsAlumnoRepository(), catalog=new GoogleSheetsEjercicioRepository();
  const templates=new GoogleSheetsPlantillaSesionRepository(), templateItems=new GoogleSheetsPlantillaEjercicioRepository();
  const sessions=new GoogleSheetsRutinaSesionRepository(), items=new GoogleSheetsRutinaEjercicioRepository();
  const service=createRutinaAdminService({alumnos,catalog,templates,templateItems,sessions,items,progress:new GoogleSheetsRegistroProgresoRepository()});
  const suffix=Date.now();
  await alumnos.create({Alumno_ID:alumnoId,Documento:`ARU_TEST_${suffix}`,Nombre:"ARU_TEST",Apellido:"RUTINA",Fecha_Nacimiento:"1990-01-01",Celular:"000",Mail:`aru.test.rutina.${suffix}@example.invalid`,Fecha_Alta:"2026-08-15",Objetivo:"ARU_TEST",Dolencia:"",Observaciones:""});
  await catalog.create({Catalogo_ID:catalogId,Tipo_de_Ejercicio:"ARU_TEST_TIPO",Ejercicio:`ARU_TEST_EJERCICIO_${suffix}`,Video:"",Aclaraciones:"",Video_Adicional:"",Activo:true});
  await templates.create({Plantilla_Sesion_ID:templateId,Fecha_Carga:"2026-08-15",Nombre_Plantilla:`ARU_TEST_PLANTILLA_${suffix}`,Objetivo:"ARU_TEST",Grupo_Muscular_1:"ARU_TEST",Grupo_Muscular_2:"",Notas:""});
  await templateItems.create({Plantilla_Ejercicio_ID:templateItemId,Plantilla_Sesion_ID:templateId,Tipo_Bloque:"ARU_TEST_BLOQUE",Orden_Bloque:1,Orden_Ejercicio:1,Catalogo_ID:catalogId,Reps_Tiempo:"10",Series:"3",Carga:"ORIGINAL",Descanso:"60",RIR:"2",Observaciones:""});
  const created=await service.create({Alumno_ID:alumnoId,Plantilla_Sesion_ID:templateId,Dia_Entrenamiento_Semana:"Día 2",Fecha:"2026-09-10",Titulo:`ARU_TEST_RUTINA_${suffix}`,Notas_Generales:""});
  routineId=created.session.Rutina_Sesion_ID; routineItemIds.push(...created.exercises.map(x=>x.Rutina_Ejercicio_ID));
  assert.notEqual(created.exercises[0].Rutina_Ejercicio_ID,templateItemId); assert.equal(created.exercises[0].Catalogo_ID,catalogId);
  const source=await templateItems.findById(templateItemId); assert.ok(source); await templateItems.update({...source,Carga:"PLANTILLA_MODIFICADA",Reps_Tiempo:"99"});
  const unchanged=(await items.findBySesion(routineId))[0]; assert.equal(unchanged.Carga,"ORIGINAL"); assert.equal(unchanged.Reps_Tiempo,"10");
  const repeatedId=randomUUID(); routineItemIds.push(repeatedId);
  const base={Tipo_Bloque:"ARU_TEST_BLOQUE",Catalogo_ID:catalogId,Instrumento_Alternativo:"Banda",Reps_Tiempo:"12",Series:"4",Carga:"RUTINA_EDITADA",Descanso:"45",RIR:"1",Observaciones:""};
  let saved=await service.save(routineId,{Alumno_ID:alumnoId,Dia_Entrenamiento_Semana:"Día 3",Fecha:"2026-09-11",Titulo:`ARU_TEST_RUTINA_EDITADA_${suffix}`,Notas_Generales:"editada"},[{...unchanged,...base,Orden_Bloque:7,Orden_Ejercicio:8},{...base,Rutina_Ejercicio_ID:repeatedId,Orden_Bloque:2,Orden_Ejercicio:4}]);
  assert.deepEqual(saved.exercises.map(x=>[x.Orden_Bloque,x.Orden_Ejercicio]),[[1,1],[2,1]]); assert.equal(saved.exercises.length,2);
  saved=await service.save(routineId,saved.session,[saved.exercises[1]]); assert.equal(saved.exercises.length,1);
  const testCatalog=await catalog.findById(catalogId); assert.ok(testCatalog); await catalog.update({...testCatalog,Activo:false});
  assert.equal((await service.get(routineId)).exercises[0].catalog?.Activo,false);
  await assert.rejects(()=>service.save(routineId,saved.session,[...saved.exercises,{...base,Rutina_Ejercicio_ID:randomUUID(),Orden_Bloque:2,Orden_Ejercicio:1}]),(error:unknown)=>error instanceof RutinaAdminError&&error.code==="ARCHIVED_EXERCISE_NOT_AVAILABLE");
  assert.equal((await service.list({search:"ARU_TEST RUTINA",exercise:String(suffix),from:"2026-09-01",to:"2026-09-30",status:"pending"})).length,1);
  await sessions.update({...saved.session,Entrenamiento_Completado:true,Fecha_Completado:"2026-09-12"});
  assert.equal((await service.list({status:"completed"})).some(x=>x.session.Rutina_Sesion_ID===routineId),true);
});});
