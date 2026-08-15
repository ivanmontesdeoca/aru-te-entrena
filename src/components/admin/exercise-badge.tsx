import { StatusBadge } from "@/components/ui/status-badge";
export function ExerciseBadge({active}:{active:boolean}){return <StatusBadge label={active?"Activo":"Archivado"} tone={active?"success":"muted"}/>;}
