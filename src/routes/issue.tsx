import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, Hash, PageHeader } from "@/components/kit";
import { store, type Credential } from "@/lib/credentials";

export const Route = createFileRoute("/issue")({
  head: () => ({
    meta: [
      { title: "Terbitkan Credential — CampusCreds" },
      { name: "description", content: "Form penerbitan credential dummy dengan Credential ID dan verification hash." },
      { property: "og:title", content: "Terbitkan Credential — CampusCreds" },
      { property: "og:description", content: "Buat credential baru untuk mahasiswa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Issue,
});

const input = "mt-1 w-full rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const empty = { studentName: "", studentId: "", title: "", type: "Kepanitiaan", issuer: "Himpunan Informatika Demo", issuedAt: "2026-10-13" };

function Issue() {
  const [f, setF] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Credential | null>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => { setDone(store.add(f)); setBusy(false); }, 1200);
  };

  return (
    <AppShell role="admin">
      <PageHeader title="Terbitkan Credential" desc="Gunakan nama dummy. Jangan memasukkan data mahasiswa asli." />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Nama mahasiswa (dummy)<input required className={input} value={f.studentName} onChange={set("studentName")} placeholder="Contoh: Andi (Dummy)" /></label>
            <label className="text-sm font-medium">ID mahasiswa<input required className={input} value={f.studentId} onChange={set("studentId")} placeholder="STU-0001" /></label>
            <label className="text-sm font-medium sm:col-span-2">Judul credential<input required className={input} value={f.title} onChange={set("title")} placeholder="Ketua Divisi Acara" /></label>
            <label className="text-sm font-medium">Jenis
              <select className={input} value={f.type} onChange={set("type")}>
                {["Kepanitiaan", "Prestasi", "Pelatihan", "Keanggotaan"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">Tanggal terbit<input type="date" required className={input} value={f.issuedAt} onChange={set("issuedAt")} /></label>
            <label className="text-sm font-medium sm:col-span-2">Organisasi penerbit<input required className={input} value={f.issuer} onChange={set("issuer")} /></label>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy} className="w-full sm:w-auto">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Mencatat ke mock proof layer…</> : "Terbitkan credential"}
              </Button>
            </div>
          </form>
        </Card>
        <Card className="lg:col-span-2">
          {done ? (
            <div>
              <div className="flex items-center gap-2 text-success"><CheckCircle2 className="h-5 w-5" /><span className="font-semibold">Credential diterbitkan</span></div>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="text-muted-foreground">Credential ID</dt><dd className="font-mono font-semibold">{done.id}</dd></div>
                <div><dt className="text-muted-foreground">Verification hash (dummy)</dt><dd><Hash value={done.hash} short={false} /></dd></div>
                <div><dt className="text-muted-foreground">Blok simulasi</dt><dd className="font-mono">#{done.block}</dd></div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/verify" search={{ id: done.id }} className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground">Verifikasi</Link>
                <Button variant="outline" onClick={() => { setDone(null); setF(empty); }}>Buat lagi</Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <h3 className="font-semibold text-foreground">Cara kerja (simulasi)</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-4">
                <li>Sistem membuat Credential ID unik.</li>
                <li>Data credential di-hash menjadi verification hash dummy.</li>
                <li>Hash "dicatat" ke mock proof layer — tanpa transaksi nyata.</li>
              </ol>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
