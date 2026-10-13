import { createFileRoute, Link } from "@tanstack/react-router";
import { FilePlus2, Fingerprint, SearchCheck, ArrowRight } from "lucide-react";
import { Logo } from "@/components/AppShell";
import { Card } from "@/components/kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusCreds — Verifikasi Credential Mahasiswa" },
      { name: "description", content: "Prototype penerbitan dan verifikasi credential mahasiswa dengan simulasi proof layer blockchain." },
      { property: "og:title", content: "CampusCreds — Verifikasi Credential Mahasiswa" },
      { property: "og:description", content: "Terbitkan dan verifikasi credential kampus secara digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: FilePlus2, t: "Terbitkan", d: "Organisasi kampus membuat credential dan sistem membuat Credential ID unik." },
  { icon: Fingerprint, t: "Catat bukti", d: "Verification hash dibuat di mock proof layer sebagai simulasi pencatatan on-chain." },
  { icon: SearchCheck, t: "Verifikasi", d: "Siapa pun dapat mengecek keaslian credential cukup dengan Credential ID." },
];

function Landing() {
  return (
    <div>
      <section className="bg-hero text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-6">
          <div className="flex items-center justify-between">
            <Logo light />
            <Link to="/verify" className="text-sm text-ink-foreground/80 hover:text-ink-foreground">Verifikasi</Link>
          </div>
          <div className="mt-20 max-w-3xl">
            <span className="rounded-full border border-ink-foreground/20 px-3 py-1 text-xs text-ink-foreground/80">Prototype · Solana Devnet Simulation</span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-6xl">Credential kampus yang bisa dibuktikan, bukan sekadar diklaim.</h1>
            <p className="mt-5 max-w-xl text-ink-foreground/75">CampusCreds membantu mahasiswa, organisasi kampus, dan verifier menerbitkan serta memverifikasi credential secara digital.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/roles" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90">Mulai demo <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/verify" className="rounded-lg border border-ink-foreground/25 px-5 py-3 text-sm font-semibold hover:bg-ink-foreground/10">Cek credential</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto -mt-12 grid max-w-6xl gap-4 px-5 pb-20 md:grid-cols-3">
        {steps.map((s, i) => (
          <Card key={s.t}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><s.icon className="h-5 w-5" /></span>
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </Card>
        ))}
      </section>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">Data dummy · Tanpa transaksi blockchain nyata · Tidak pernah meminta private key</footer>
    </div>
  );
}
