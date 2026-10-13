import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FilePlus2, List, ShieldCheck, GraduationCap, Menu, X, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimNotice } from "./kit";

type Role = "student" | "admin";
const nav = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/issue", label: "Terbitkan Credential", icon: FilePlus2 },
    { to: "/credentials", label: "Daftar Credential", icon: List },
    { to: "/verify", label: "Verifikasi Publik", icon: ShieldCheck },
  ],
  student: [
    { to: "/student", label: "Credential Saya", icon: GraduationCap },
    { to: "/verify", label: "Verifikasi Publik", icon: ShieldCheck },
  ],
} as const;

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-display text-lg font-semibold", light && "text-ink-foreground")}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground"><ShieldCheck className="h-4 w-4" /></span>
      CampusCreds
    </Link>
  );
}

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const side = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo light />
      <div className="rounded-lg bg-ink-foreground/10 px-3 py-2 text-xs text-ink-foreground/80">
        Masuk sebagai <b className="text-ink-foreground">{role === "admin" ? "Organization Admin" : "Student"}</b>
      </div>
      <nav className="flex flex-col gap-1">
        {nav[role].map((n) => (
          <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-foreground/75 transition-colors hover:bg-ink-foreground/10 hover:text-ink-foreground",
              path === n.to && "bg-ink-foreground/15 text-ink-foreground")}>
            <n.icon className="h-4 w-4" /> {n.label}
          </Link>
        ))}
      </nav>
      <Link to="/roles" className="mt-auto flex items-center gap-2 text-sm text-ink-foreground/70 hover:text-ink-foreground"><Repeat className="h-4 w-4" /> Ganti role</Link>
    </div>
  );
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-ink md:block">{side}</aside>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink">
            <button className="absolute right-3 top-4 text-ink-foreground" onClick={() => setOpen(false)} aria-label="Tutup menu"><X className="h-5 w-5" /></button>
            {side}
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 md:hidden">
          <button onClick={() => setOpen(true)} aria-label="Buka menu"><Menu className="h-5 w-5" /></button>
          <span className="font-display font-semibold">CampusCreds</span>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 md:p-8">
          <SimNotice />
          {children}
        </main>
      </div>
    </div>
  );
}
