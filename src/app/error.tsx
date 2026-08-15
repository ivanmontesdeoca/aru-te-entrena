"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-screen max-w-xl items-center px-5 py-12"><section className="w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" role="alert"><p className="text-sm font-bold uppercase tracking-widest text-violet-700">No pudimos completar la operación</p><h1 className="text-2xl font-black text-slate-950">Ocurrió un problema temporal</h1><p className="text-slate-600">Revisá tu conexión e intentá nuevamente. Si el problema continúa, contactá a la administradora.</p><button className="min-h-11 rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white" onClick={reset}>Intentar nuevamente</button></section></main>;
}
