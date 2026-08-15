import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-xl items-center px-5 py-12"><section className="w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-bold uppercase tracking-widest text-violet-700">Recurso inexistente</p><h1 className="text-2xl font-black text-slate-950">No encontramos esta página</h1><p className="text-slate-600">Puede haber sido movida o el enlace ya no es válido.</p><Link className="inline-flex min-h-11 items-center rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white" href="/">Volver al inicio</Link></section></main>;
}
