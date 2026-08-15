import assert from "node:assert/strict";
import test from "node:test";
import type { Alumno } from "@/modules/alumnos/domain/alumno";
import type { AlumnoRepository } from "@/modules/alumnos/domain/repository";
import type { Usuario } from "@/modules/usuarios/domain/usuario";
import type { UsuarioRepository } from "@/modules/usuarios/domain/repository";
import { createAlumnoAdminService } from "@/modules/alumnos/application/alumno-admin-service";

class AlumnosMemory implements AlumnoRepository {
  constructor(public values: Alumno[] = []) {}
  findAll=async()=>this.values; findById=async(id:string)=>this.values.find(x=>x.Alumno_ID===id)??null;
  create=async(x:Alumno)=>{this.values.push(x)}; update=async(x:Alumno)=>{this.values=this.values.map(v=>v.Alumno_ID===x.Alumno_ID?x:v)}; save=this.update;
  search=async(term:string)=>this.values.filter(x=>`${x.Nombre} ${x.Apellido} ${x.Documento} ${x.Mail}`.toLowerCase().includes(term.toLowerCase()));
}
class UsuariosMemory implements UsuarioRepository {
  constructor(public values: Usuario[] = [], public failCreate=false) {}
  findAll=async()=>this.values; findById=async(id:string)=>this.values.find(x=>x.Usuario_ID===id)??null;
  findByAuthUid=async(uid:string)=>this.values.find(x=>x.UID_Auth===uid)??null; findByEmail=async(email:string)=>this.values.find(x=>x.Email===email)??null;
  create=async(x:Usuario)=>{if(this.failCreate)throw new Error("sheets failed");this.values.push(x)}; update=async(x:Usuario)=>{this.values=this.values.map(v=>v.Usuario_ID===x.Usuario_ID?x:v)}; save=this.update;
  setActive=async(id:string,active:boolean)=>{const x=await this.findById(id);if(x)await this.update({...x,Activo:active})};
}
const base={Documento:"TEST-123",Nombre:"Alumno",Apellido:"Prueba",Fecha_Nacimiento:"1990-01-01",Celular:"000",Mail:"TEST@EXAMPLE.COM",Fecha_Alta:"2026-08-15",Objetivo:"",Dolencia:"",Observaciones:""};

test("creates alumno with server-generated UUID and normalized email",async()=>{const alumnos=new AlumnosMemory();const service=createAlumnoAdminService({alumnos,usuarios:new UsuariosMemory(),firebase:{createUser:async()=>({uid:"uid"}),deleteUser:async()=>{},revokeRefreshTokens:async()=>{},rotateAccessVersion:async()=>{}}});const created=await service.create(base);assert.match(created.Alumno_ID,/^[0-9a-f-]{36}$/);assert.equal(created.Mail,"test@example.com");});

test("creates ALUMNO access and compensates Firebase when Sheets fails",async()=>{const alumno={...base,Mail:"test@example.com",Alumno_ID:"11111111-1111-4111-8111-111111111111"};const deleted:string[]=[];const service=createAlumnoAdminService({alumnos:new AlumnosMemory([alumno]),usuarios:new UsuariosMemory([],true),firebase:{createUser:async()=>({uid:"firebase-test-uid"}),deleteUser:async(uid)=>{deleted.push(uid)},revokeRefreshTokens:async()=>{},rotateAccessVersion:async()=>{}}});await assert.rejects(()=>service.createAccess(alumno.Alumno_ID,"NEW@EXAMPLE.COM"),/sheets failed/);assert.deepEqual(deleted,["firebase-test-uid"]);});

test("disable preserves account and revokes Firebase tokens",async()=>{const alumno={...base,Mail:"test@example.com",Alumno_ID:"11111111-1111-4111-8111-111111111111"};const user:Usuario={Usuario_ID:"22222222-2222-4222-8222-222222222222",Alumno_ID:alumno.Alumno_ID,Email:"test@example.com",Rol:"ALUMNO",Activo:true,UID_Auth:"uid"};const usuarios=new UsuariosMemory([user]);const revoked:string[]=[];const service=createAlumnoAdminService({alumnos:new AlumnosMemory([alumno]),usuarios,firebase:{createUser:async()=>({uid:"uid"}),deleteUser:async()=>{},revokeRefreshTokens:async(uid)=>{revoked.push(uid)},rotateAccessVersion:async()=>{}}});await service.setAccess(alumno.Alumno_ID,false);assert.equal(usuarios.values[0].Activo,false);assert.deepEqual(revoked,["uid"]);});
