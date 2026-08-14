export type UUID = string;
export type CatalogoId = string;
export type ISODate = string;
export type ISODateTime = string;

export type Role = "ADMIN" | "ALUMNO";
export type DiaEntrenamiento = `Día ${number}`;

export interface EntityRepository<TEntity, TId = UUID> {
  findAll(): Promise<TEntity[]>;
  findById(id: TId): Promise<TEntity | null>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
  save(entity: TEntity): Promise<void>;
}
