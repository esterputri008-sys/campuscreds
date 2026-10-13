import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CredentialTable, PageHeader, StatCard } from "@/components/kit";
import { store, useCredentials } from "@/lib/credentials";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — CampusCreds" },
      { name: "description", content: "Ringkasan credential yang diterbitkan organisasi kampus." },
      { property: "og:title", content: "Dashboard Admin — CampusCreds" },
      { property: "og:description", content: "Kelola penerbitan credential organisasi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const list = useCredentials();
  const active = list.filter((c) => c.status === "active").length;
  const students = new Set(list.map((c) => c.studentId)).size;
  const byType = Object.entries(list.reduce<Record<string, number>>((a, c) => ((a[c.type] = (a[c.type] || 0) + 1), a), {}));
  return (
    <AppShell role="admin">
      <PageHeader title="Dashboard Organisasi" desc="Ringkasan aktivitas penerbitan credential."
        action={<Link to="/issue" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">+ Terbitkan credential</Link>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total credential" value={list.length} />
        <StatCard label="Valid" value={active} />
        <StatCard label="Dicabut" value={list.length - active} />
        <StatCard label="Mahasiswa" value={students} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-semibold">Penerbitan terbaru</h2>
          <CredentialTable items={list.slice(0, 5)} onRevoke={store.toggleRevoke} />
        </div>
        <Card>
          <h2 className="font-semibold">Per jenis</h2>
          <div className="mt-4 space-y-3">
            {byType.map(([t, n]) => (
              <div key={t}>
                <div className="flex justify-between text-sm"><span>{t}</span><span className="text-muted-foreground">{n}</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-accent" style={{ width: `${(n / list.length) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
