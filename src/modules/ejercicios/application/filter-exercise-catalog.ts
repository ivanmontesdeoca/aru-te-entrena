import type { Ejercicio } from "../domain/ejercicio";

export function filterExerciseCatalog(catalog: Ejercicio[], search = "", type = "", limit?: number) {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("es");
  const query = normalize(search);
  if (!query) return [];
  const normalizedType = normalize(type);
  const matches = catalog.filter((item) => item.Activo && (normalize(item.Ejercicio).includes(query) || normalize(item.Tipo_de_Ejercicio).includes(query)) && (!normalizedType || normalize(item.Tipo_de_Ejercicio) === normalizedType));
  return limit === undefined ? matches : matches.slice(0, limit);
}
