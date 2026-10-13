import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Copy } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, Hash, PageHeader, StatCard, StatusBadge } from "@/components/kit";
import { DEMO_STUDENT, useCredentials } from "@/lib/credentials";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Credential Saya — CampusCreds" },
      { name: "description", content: "Dashboard mahasiswa untuk melihat credential miliknya." },
      { property: "og:title", content: "Credential Saya — CampusCreds" },
      { property: "og:description", content: "Lihat dan bagikan credential kampus Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Student,
});

function Student() {
  const mine = useCredentials().filter((c) => c.studentId === DEMO_STUDENT.id);
  const [copied, setCopied] = useState("");
  const copy = (id: string) => { navigator.clipboard?.writeText(id); setCopied(id); setTimeout(() => setCopied(""), 1500); };
  return (
    <AppShell role="student">
      <PageHeader title={`Halo, ${DEMO_STUDENT.name}`} desc={`${DEMO_STUDENT.id} · ${DEMO_STUDENT.major}`} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Credential dimiliki" value={mine.length} />
        <StatCard label="Valid" value={mine.filter((c) => c.status === "active").length} />
        <StatCard label="Organisasi" value={new Set(mine.map((c) => c.issuer)).size} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {mine.map((c) => (
          <Card key={c.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Award className="h-5 w-5" /></span>
              <StatusBadge status={c.status} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.type}</p>
              <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.issuer} · {c.issuedAt}</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold">{c.id}</span>
                <button onClick={() => copy(c.id)} className="flex items-center gap-1 text-xs text-primary"><Copy className="h-3 w-3" />{copied === c.id ? "Tersalin" : "Salin"}</button>
              </div>
              <Hash value={c.hash} />
            </div>
            <Link to="/verify" search={{ id: c.id }} className="text-sm font-semibold text-primary hover:underline">Lihat halaman verifikasi →</Link>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
