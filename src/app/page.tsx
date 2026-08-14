import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-5 py-12">
      <Card className="w-full space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Base técnica</p>
        <h1 className="text-3xl font-bold">Aru te entrena</h1>
        <p className="text-slate-600">Proyecto inicializado. Las pantallas funcionales se implementarán en etapas posteriores.</p>
      </Card>
    </main>
  );
}
