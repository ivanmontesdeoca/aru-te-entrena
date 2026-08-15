import Image from "next/image";
import { cn } from "@/lib/cn";

type Variant = "vertical" | "horizontal" | "isotipo";
const assets = {
  vertical: { src: "/brand/logo-estudio-axis-vertical.png", width: 1098, height: 870, alt: "Estudio Axis, by Aru te entrena" },
  horizontal: { src: "/brand/logo-estudio-axis-horizontal.png", width: 1044, height: 270, alt: "Estudio Axis, by Aru te entrena" },
  isotipo: { src: "/brand/isotipo-estudio-axis.png", width: 210, height: 230, alt: "Estudio Axis" },
} as const;

export function BrandLogo({ variant, className, priority = false }: { variant: Variant; className?: string; priority?: boolean }) {
  const asset = assets[variant];
  return <Image alt={asset.alt} className={cn("h-auto max-w-full object-contain", className)} height={asset.height} priority={priority} sizes={variant === "isotipo" ? "64px" : variant === "horizontal" ? "320px" : "260px"} src={asset.src} width={asset.width} />;
}
