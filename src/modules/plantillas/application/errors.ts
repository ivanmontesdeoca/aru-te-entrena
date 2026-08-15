export type PlantillaErrorCode="PLANTILLA_NOT_FOUND"|"CATALOGO_NOT_FOUND"|"ARCHIVED_EXERCISE_NOT_AVAILABLE";
export class PlantillaAdminError extends Error{constructor(public readonly code:PlantillaErrorCode,public readonly status:number=404){super(code);this.name="PlantillaAdminError";}}
