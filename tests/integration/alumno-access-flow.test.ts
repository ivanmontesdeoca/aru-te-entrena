import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { after, describe, it } from "node:test";
import { google } from "googleapis";
import { getFirebaseAdminAuth } from "@/infrastructure/firebase/admin";
import { GoogleSheetsAlumnoRepository, GoogleSheetsUsuarioRepository } from "@/infrastructure/sheets/repositories";
import { SHEET_NAMES } from "@/infrastructure/sheets/sheet-names";
import { createAlumnoAdminService } from "@/modules/alumnos/application/alumno-admin-service";
import { AuthService } from "@/modules/auth/application/auth-service";
import { AuthError } from "@/modules/auth/domain/errors";

const alumnoId = randomUUID();
let usuarioId = "";
let firebaseUid = "";

async function clearRow(sheet: string, id: string, endColumn: string) {
  if (!id) return;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  assert.ok(spreadsheetId);
  const auth = new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const api = google.sheets({ version: "v4", auth });
  const response = await api.spreadsheets.values.get({ spreadsheetId, range: `'${sheet}'!A2:A` });
  const rows = response.data.values ?? [];
  for (const match of rows.map((row,index)=>({id:String(row[0]??""),number:index+2})).filter(row=>row.id===id)) {
    await api.spreadsheets.values.clear({ spreadsheetId, range: `'${sheet}'!A${match.number}:${endColumn}${match.number}` });
  }
}

after(async()=>{
  if(firebaseUid) await getFirebaseAdminAuth().deleteUser(firebaseUid).catch(()=>undefined);
  await clearRow(SHEET_NAMES.usuarios,usuarioId,"F");
  await clearRow(SHEET_NAMES.alumnos,alumnoId,"K");
});

describe("real ALUMNO invitation and access flow",()=>{
  it("creates, establishes password, authenticates, authorizes and toggles access",async()=>{
    const firebase=getFirebaseAdminAuth(); const alumnos=new GoogleSheetsAlumnoRepository(); const usuarios=new GoogleSheetsUsuarioRepository();
    const admin=createAlumnoAdminService({alumnos,usuarios,firebase:{createUser:async(email)=>firebase.createUser({email}),deleteUser:(uid)=>firebase.deleteUser(uid),revokeRefreshTokens:(uid)=>firebase.revokeRefreshTokens(uid),rotateAccessVersion:async(uid,version)=>{const user=await firebase.getUser(uid);await firebase.setCustomUserClaims(uid,{...user.customClaims,aruAccessVersion:version});}}});
    const suffix=`${Date.now()}.${randomUUID().slice(0,8)}`; const email=`aru.etapa4.test.${suffix}@example.com`;
    await alumnos.create({Alumno_ID:alumnoId,Documento:`ARU-TEST-${suffix}`,Nombre:"PRUEBA",Apellido:"ETAPA 4",Fecha_Nacimiento:"1990-01-01",Celular:"0000000000",Mail:email,Fecha_Alta:new Date().toISOString().slice(0,10),Objetivo:"PRUEBA DE INTEGRACION",Dolencia:"",Observaciones:"ARU_TEST_ETAPA_4 - eliminación controlada al finalizar"});
    const access=await admin.createAccess(alumnoId,email); usuarioId=access.Usuario_ID; firebaseUid=access.UID_Auth;
    assert.equal(access.Rol,"ALUMNO"); assert.equal(access.Alumno_ID,alumnoId); assert.equal(access.Activo,true);

    const resetLink=await firebase.generatePasswordResetLink(email); const oobCode=new URL(resetLink).searchParams.get("oobCode"); assert.ok(oobCode,"Firebase reset link must contain an action code");
    const password=`Aru!${randomBytes(24).toString("base64url")}`; const apiKey=process.env.NEXT_PUBLIC_FIREBASE_API_KEY; assert.ok(apiKey);
    const reset=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${encodeURIComponent(apiKey)}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({oobCode,newPassword:password})}); assert.equal(reset.ok,true,"Password establishment failed");
    const login=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,password,returnSecureToken:true})}); assert.equal(login.ok,true,"ALUMNO password login failed");
    const loginPayload=await login.json() as {idToken:string}; const authService=new AuthService(firebase,usuarios); const session=await authService.createSession(loginPayload.idToken);
    assert.equal(session.user.role,"ALUMNO"); assert.equal(session.user.alumnoId,alumnoId); await assert.rejects(()=>authService.resolveSession(session.cookie,"ADMIN"),(error:unknown)=>error instanceof AuthError&&error.code==="ROLE_FORBIDDEN");
    await admin.setAccess(alumnoId,false); await assert.rejects(()=>authService.resolveSession(session.cookie),(error:unknown)=>error instanceof AuthError&&(error.code==="USER_INACTIVE"||error.code==="INVALID_SESSION"));
    await admin.setAccess(alumnoId,true);
    await new Promise((resolve)=>setTimeout(resolve,1100));
    const freshLogin=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,password,returnSecureToken:true})}); assert.equal(freshLogin.ok,true); const fresh=await freshLogin.json() as {idToken:string}; assert.equal((await authService.createSession(fresh.idToken)).user.alumnoId,alumnoId);
  });
});
