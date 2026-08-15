import { randomUUID } from "node:crypto";
import type { Alumno } from "../domain/alumno";
import type { AlumnoRepository } from "../domain/repository";
import { alumnoSchema } from "../domain/schema";
import type { UsuarioRepository } from "@/modules/usuarios/domain/repository";
import { usuarioSchema } from "@/modules/usuarios/domain/schema";
import { AlumnoAdminError } from "./errors";
import { alumnoFieldsSchema, type AlumnoFields } from "./schemas";

export interface FirebaseUserAdminGateway {
  createUser(email: string): Promise<{ uid: string }>;
  deleteUser(uid: string): Promise<void>;
  revokeRefreshTokens(uid: string): Promise<void>;
  rotateAccessVersion(uid: string, version: string): Promise<void>;
}

export function createAlumnoAdminService(dependencies: {
  alumnos: AlumnoRepository;
  usuarios: UsuarioRepository;
  firebase: FirebaseUserAdminGateway;
}) {
  const { alumnos, usuarios, firebase } = dependencies;

  async function getAccess(alumnoId: string) {
    return (await usuarios.findAll()).find((usuario) => usuario.Alumno_ID === alumnoId) ?? null;
  }

  return {
    async list(search = "") {
      const result = search ? await alumnos.search(search) : await alumnos.findAll();
      const allUsers = await usuarios.findAll();
      return result.map((alumno) => ({
        alumno,
        access: allUsers.find((usuario) => usuario.Alumno_ID === alumno.Alumno_ID) ?? null,
      }));
    },

    async get(id: string) {
      const alumno = await alumnos.findById(id);
      if (!alumno) throw new AlumnoAdminError("ALUMNO_NOT_FOUND", 404);
      return { alumno, access: await getAccess(id) };
    },

    async create(input: AlumnoFields): Promise<Alumno> {
      const fields = alumnoFieldsSchema.parse(input);
      const alumno = alumnoSchema.parse({ ...fields, Alumno_ID: randomUUID() });
      await alumnos.create(alumno);
      return alumno;
    },

    async update(input: Alumno): Promise<Alumno> {
      const alumno = alumnoSchema.parse(input);
      if (!(await alumnos.findById(alumno.Alumno_ID))) {
        throw new AlumnoAdminError("ALUMNO_NOT_FOUND", 404);
      }
      await alumnos.update(alumno);
      return alumno;
    },

    async createAccess(alumnoId: string, emailInput: string) {
      const alumno = await alumnos.findById(alumnoId);
      if (!alumno) throw new AlumnoAdminError("ALUMNO_NOT_FOUND", 404);
      if (await getAccess(alumnoId)) throw new AlumnoAdminError("ACCESS_ALREADY_EXISTS", 409);
      const email = emailInput.trim().toLowerCase();
      if (await usuarios.findByEmail(email)) throw new AlumnoAdminError("EMAIL_ALREADY_EXISTS", 409);

      let firebaseUser: { uid: string };
      try {
        firebaseUser = await firebase.createUser(email);
      } catch (error) {
        if (error instanceof Error && error.message.includes("email-already-exists")) {
          throw new AlumnoAdminError("FIREBASE_EMAIL_EXISTS", 409);
        }
        throw error;
      }

      const usuario = usuarioSchema.parse({
        Usuario_ID: randomUUID(), Alumno_ID: alumnoId, Email: email,
        Rol: "ALUMNO", Activo: true, UID_Auth: firebaseUser.uid,
      });
      try {
        await usuarios.create(usuario);
      } catch (error) {
        await firebase.deleteUser(firebaseUser.uid).catch(() => undefined);
        throw error;
      }
      return usuario;
    },

    async setAccess(alumnoId: string, active: boolean) {
      const access = await getAccess(alumnoId);
      if (!access) throw new AlumnoAdminError("ACCESS_NOT_FOUND", 404);
      await firebase.rotateAccessVersion(access.UID_Auth, randomUUID());
      if (!active) await firebase.revokeRefreshTokens(access.UID_Auth);
      await usuarios.setActive(access.Usuario_ID, active);
      return { ...access, Activo: active };
    },
  };
}
