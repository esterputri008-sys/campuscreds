import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, CredentialTable, PageHeader } from "@/components/kit";
import { store, useCredentials } from "@/lib/credentials";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "Daftar Credential — CampusCreds" },
      { name: "description", content: "Semua credential dummy yang diterbitkan organisasi." },
      { property: "og:title", content: "Daftar Credential — CampusCreds" },
      { property: "og:description", content: "Cari dan kelola credential yang sudah diterbitkan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: List,
});

function List() {
  const list = useCredentials();
  const [q, setQ] = useState("");
  const [st, setSt] = useState<"all" | "active" | "revoked">("all");
  const items = list.filter((c) => (st === "all" || c.status === st) && `${c.id} ${c.studentName} ${c.title}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell role="admin">
      <PageHeader title="Daftar Credential" desc={`${items.length} dari ${list.length} credential`} action={<Button variant="outline" onClick={store.reset}>Reset data demo</Button>} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari ID, nama, atau judul…" className="flex-1 rounded-lg border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          {([["all", "Semua"], ["active", "Valid"], ["revoked", "Dicabut"]] as const).map(([k, l]) => (
            <Button key={k} variant={st === k ? "primary" : "ghost"} className="px-3 py-1" onClick={() => setSt(k)}>{l}</Button>
          ))}
        </div>
      </div>
      <CredentialTable items={items} onRevoke={store.toggleRevoke} />
    </AppShell>
  );
}
