import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Credential } from "@/lib/credentials";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border bg-card p-5 shadow-card", className)}>{children}</div>;
}

type Tone = "success" | "danger" | "warning" | "neutral" | "info";
const tones: Record<Tone, string> = {
  success: "bg-success/12 text-success border-success/30",
  danger: "bg-destructive/10 text-destructive border-destructive/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-primary/10 text-primary border-primary/25",
};
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: Credential["status"] }) {
  return status === "active" ? <Badge tone="success">Valid</Badge> : <Badge tone="danger">Dicabut</Badge>;
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}

export function Button({ variant = "primary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "accent" | "ghost" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
    outline: "border bg-card hover:bg-muted",
    ghost: "hover:bg-muted",
  }[variant];
  return <button {...p} className={cn("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50", v, className)} />;
}

export function Hash({ value, short = true }: { value: string; short?: boolean }) {
  return <code className="break-all font-mono text-xs text-muted-foreground">{short ? `${value.slice(0, 10)}…${value.slice(-6)}` : value}</code>;
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function CredentialTable({ items, onRevoke }: { items: Credential[]; onRevoke?: (id: string) => void }) {
  if (!items.length) return <Card className="text-center text-sm text-muted-foreground">Belum ada credential.</Card>;
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Credential ID</th>
              <th className="px-4 py-3">Mahasiswa</th>
              <th className="px-4 py-3">Judul</th>
              <th className="hidden px-4 py-3 lg:table-cell">Hash</th>
              <th className="px-4 py-3">Status</th>
              {onRevoke && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">
                  <Link to="/verify" search={{ id: c.id }} className="font-mono text-xs font-semibold text-primary hover:underline">{c.id}</Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{c.studentName}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.issuer} · {c.issuedAt}</div>
                </td>
                <td className="hidden px-4 py-3 lg:table-cell"><Hash value={c.hash} /></td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                {onRevoke && (
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onRevoke(c.id)}>
                      {c.status === "active" ? "Cabut" : "Aktifkan"}
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SimNotice() {
  return (
    <div className="rounded-lg border border-warning/40 bg-warning/15 px-4 py-2 text-xs text-warning-foreground">
      Mode simulasi: tidak ada transaksi blockchain nyata. Network: Solana Devnet Simulation. Semua data dummy. Tidak ada wallet asli, private key, seed phrase, atau password yang diminta/disimpan.
    </div>
  );
}
