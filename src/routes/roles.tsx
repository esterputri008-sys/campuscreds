import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Building2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/AppShell";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Pilih Role — CampusCreds" },
      { name: "description", content: "Masuk ke demo CampusCreds sebagai Student, Organization Admin, atau Verifier." },
      { property: "og:title", content: "Pilih Role — CampusCreds" },
      { property: "og:description", content: "Pilih peran untuk mencoba prototype CampusCreds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Roles,
});

const roles = [
  { to: "/student", icon: GraduationCap, t: "Student", d: "Lihat credential milik Anda dan bagikan Credential ID." },
  { to: "/admin", icon: Building2, t: "Organization Admin", d: "Terbitkan dan kelola credential untuk anggota organisasi." },
  { to: "/verify", icon: ShieldCheck, t: "Verifier", d: "Cek keaslian credential berdasarkan Credential ID." },
] as const;

function Roles() {
  return (
    <div className="min-h-screen bg-hero px-5 py-6 text-ink-foreground">
      <div className="mx-auto max-w-5xl">
        <Logo light />
        <h1 className="mt-16 text-3xl font-semibold md:text-4xl">Masuk sebagai siapa?</h1>
        <p className="mt-2 text-ink-foreground/70">Demo tanpa login. Tidak ada wallet, private key, atau seed phrase yang diperlukan.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {roles.map((r) => (
            <Link key={r.t} to={r.to} className="group rounded-xl border border-ink-foreground/15 bg-ink-foreground/5 p-6 transition hover:-translate-y-1 hover:border-accent hover:bg-ink-foreground/10">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-accent-foreground"><r.icon className="h-6 w-6" /></span>
              <h2 className="mt-5 text-xl font-semibold">{r.t}</h2>
              <p className="mt-2 text-sm text-ink-foreground/70">{r.d}</p>
              <span className="mt-6 inline-block text-sm font-semibold text-accent group-hover:underline">Lanjutkan →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
