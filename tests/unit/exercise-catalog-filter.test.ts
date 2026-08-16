import assert from "node:assert/strict";
import test from "node:test";
import { filterExerciseCatalog } from "@/modules/ejercicios/application/filter-exercise-catalog";
import type { Ejercicio } from "@/modules/ejercicios/domain/ejercicio";

const exercise=(index:number,name=`Ejercicio ${index}`):Ejercicio=>({Catalogo_ID:`CAT-${index}`,Ejercicio:name,Tipo_de_Ejercicio:index%2?"Fuerza":"Cardio",Video:"",Video_Adicional:"",Aclaraciones:"",Activo:true});

test("filters the full active catalog before limiting visible results",()=>{const catalog=Array.from({length:30},(_,index)=>exercise(index,index===25?"Peso muerto rumano":`Ejercicio ${index}`));assert.equal(filterExerciseCatalog(catalog,"PESO","",20)[0]?.Catalogo_ID,"CAT-25");});
test("combines partial text and type filters and excludes archived exercises",()=>{const archived={...exercise(2,"Peso corporal"),Activo:false};const rows=filterExerciseCatalog([exercise(1,"Press con peso"),archived],"peso","Fuerza");assert.deepEqual(rows.map(x=>x.Catalogo_ID),["CAT-1"]);});
test("searches by exercise type and ignores accents, case and surrounding spaces",()=>{const catalog=[{...exercise(1,"Extensión de tríceps"),Tipo_de_Ejercicio:"Tren superior"}];assert.equal(filterExerciseCatalog(catalog,"  TREN SUPERIOR  ")[0]?.Catalogo_ID,"CAT-1");assert.equal(filterExerciseCatalog(catalog,"extension")[0]?.Catalogo_ID,"CAT-1");});
test("an empty query shows no permanent option deck",()=>{assert.deepEqual(filterExerciseCatalog([exercise(1,"Peso muerto")],"   "),[]);});
