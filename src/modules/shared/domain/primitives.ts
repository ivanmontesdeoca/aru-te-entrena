export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export type Role = "ADMIN" | "ALUMNO";
export type DiaEntrenamiento = `Día ${number}`;

export interface EntityRepository<TEntity, TId = UUID> {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
}
