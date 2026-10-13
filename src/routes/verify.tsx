import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Search } from "lucide-react";
import { Logo } from "@/components/AppShell";
import { Badge, Button, Card, Hash, SimNotice } from "@/components/kit";
import { useCredentials, verify } from "@/lib/credentials";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s["id"] === "string" ? { id: s["id"] } : {}),
  head: () => ({
    meta: [
      { title: "Verifikasi Credential — CampusCreds" },
      { name: "description", content: "Cek keaslian credential mahasiswa berdasarkan Credential ID." },
      { property: "og:title", content: "Verifikasi Credential — CampusCreds" },
      { property: "og:description", content: "Verifikasi publik credential kampus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Verify,
});

function Verify() {
  const { id } = Route.useSearch();
  const nav = useNavigate({ from: "/verify" });
  const list = useCredentials();
  const [q, setQ] = useState(id ?? "");
  useEffect(() => setQ(id ?? ""), [id]);
  const res = id ? verify(list, id) : null;

  const meta = res && {
    valid: { icon: CheckCircle2, cls: "border-success/40 bg-success/10 text-success", t: "Valid", d: "Credential terdaftar, hash cocok, dan berstatus aktif." },
    invalid: { icon: XCircle, cls: "border-destructive/40 bg-destructive/10 text-destructive", t: "Tidak Valid", d: "Credential ditemukan tetapi telah dicabut atau hash tidak cocok." },
    notfound: { icon: HelpCircle, cls: "border-border bg-muted text-muted-foreground", t: "Tidak Ditemukan", d: "Tidak ada credential dengan ID tersebut." },
  }[res.kind];

  return (
    <div className="min-h-screen">
      <header className="bg-hero px-5 pb-20 pt-6 text-ink-foreground">
        <div className="mx-auto max-w-3xl">
          <Logo light />
          <h1 className="mt-12 text-3xl font-semibold md:text-4xl">Verifikasi Credential</h1>
          <p className="mt-2 text-ink-foreground/70">Masukkan Credential ID untuk memeriksa keasliannya.</p>
        </div>
      </header>
      <main className="mx-auto -mt-12 max-w-3xl space-y-5 px-5 pb-16">
        <Card>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); nav({ search: q.trim() ? { id: q.trim() } : {} }); }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="CC-2026-XXXXXXXX" className="w-full rounded-lg border bg-card py-2.5 pl-9 pr-3 font-mono text-sm outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <Button type="submit">Verifikasi</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">Coba: <button className="font-mono text-primary" onClick={() => nav({ search: { id: "CC-2026-A7K3P9QX" } })}>CC-2026-A7K3P9QX</button> (valid) · <button className="font-mono text-primary" onClick={() => nav({ search: { id: "CC-2026-D4L7V6JE" } })}>CC-2026-D4L7V6JE</button> (dicabut)</p>
        </Card>

        {res && meta && (
          <div className={cn("flex items-start gap-4 rounded-xl border p-5", meta.cls)}>
            <meta.icon className="h-8 w-8 shrink-0" />
            <div><p className="font-display text-xl font-semibold">{meta.t}</p><p className="text-sm text-foreground/70">{meta.d}</p></div>
          </div>
        )}

        {res?.cred && (
          <Card>
            <div className="flex items-center justify-between"><h2 className="font-semibold">Detail credential</h2>
              {res.kind === "valid" ? <Badge tone="success">Valid</Badge> : <Badge tone="danger">Tidak Valid</Badge>}</div>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              {[["Credential ID", res.cred.id], ["Pemilik", res.cred.studentName], ["Judul", res.cred.title], ["Jenis", res.cred.type], ["Penerbit", res.cred.issuer], ["Tanggal terbit", res.cred.issuedAt]].map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-5 rounded-lg bg-muted p-4 text-sm">
              <p className="font-semibold">Mock proof layer</p>
              <div className="mt-2 space-y-1">
                <div className="text-muted-foreground">Verification hash</div>
                <Hash value={res.cred.hash} short={false} />
                <div className="pt-2 text-muted-foreground">Blok simulasi: <span className="font-mono">#{res.cred.block}</span> · Jaringan: <span className="font-mono">campus-testnet (simulasi)</span></div>
              </div>
            </div>
          </Card>
        )}
        <SimNotice />
      </main>
    </div>
  );
}
