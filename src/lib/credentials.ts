import { useEffect, useSyncExternalStore } from "react";

export type CredStatus = "active" | "revoked";
export type Credential = {
  id: string;
  studentName: string;
  studentId: string;
  title: string;
  type: string;
  issuer: string;
  issuedAt: string;
  status: CredStatus;
  hash: string;
  block: number;
};

// Mock proof layer: deterministic pseudo-hash (NOT cryptographic, simulation only)
export function mockHash(input: string): string {
  let out = "";
  let h = 2166136261;
  for (let round = 0; round < 8; round++) {
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i) + round;
      h = Math.imul(h, 16777619) >>> 0;
    }
    out += h.toString(16).padStart(8, "0");
  }
  return "0x" + out;
}

export function makeId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `CC-2026-${s}`;
}

function seedItem(id: string, studentName: string, studentId: string, title: string, type: string, issuer: string, issuedAt: string, status: CredStatus = "active", block = 0): Credential {
  return { id, studentName, studentId, title, type, issuer, issuedAt, status, block: block || 18400000 + id.length * 1371, hash: mockHash(id + studentId + title) };
}

const SEED: Credential[] = [
  seedItem("CC-2026-A7K3P9QX", "Rani Pratiwi (Dummy)", "STU-0001", "Ketua Panitia Tech Fest 2026", "Kepanitiaan", "Himpunan Informatika Demo", "2026-03-12", "active", 18402311),
  seedItem("CC-2026-B2M8T4WZ", "Rani Pratiwi (Dummy)", "STU-0001", "Sertifikat Workshop UI/UX", "Pelatihan", "UKM Desain Demo", "2026-05-02", "active", 18410922),
  seedItem("CC-2026-C9N5R2HY", "Budi Santoso (Dummy)", "STU-0002", "Juara 2 Hackathon Kampus", "Prestasi", "BEM Demo University", "2026-04-20", "active", 18408877),
  seedItem("CC-2026-D4L7V6JE", "Sari Wulandari (Dummy)", "STU-0003", "Anggota Aktif Paduan Suara", "Keanggotaan", "UKM Paduan Suara Demo", "2025-12-01", "revoked", 18390012),
  seedItem("CC-2026-E8P3K5MS", "Dimas Aditya (Dummy)", "STU-0004", "Asisten Lab Basis Data", "Kepanitiaan", "Lab Komputer Demo", "2026-02-14", "active", 18399545),
];

const KEY = "campuscreds-demo-v1";
let state: Credential[] = SEED;
let hydrated = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const store = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  get: () => state,
  hydrate() {
    if (hydrated) return;
    hydrated = true;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) { state = JSON.parse(raw); emit(); }
    } catch { /* ignore */ }
  },
  add(c: Omit<Credential, "id" | "hash" | "block" | "status">): Credential {
    const id = makeId();
    const cred: Credential = { ...c, id, status: "active", hash: mockHash(id + c.studentId + c.title), block: 18420000 + Math.floor(Math.random() * 9000) };
    state = [cred, ...state]; save(); emit();
    return cred;
  },
  toggleRevoke(id: string) {
    state = state.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "revoked" : "active" } : c));
    save(); emit();
  },
  reset() { state = SEED; save(); emit(); },
};

export function useCredentials() {
  useEffect(() => store.hydrate(), []);
  return useSyncExternalStore(store.subscribe, store.get, () => SEED);
}

export const DEMO_STUDENT = { name: "Rani Pratiwi (Dummy)", id: "STU-0001", major: "Informatika (Demo)" };

export type VerifyResult = { kind: "valid" | "invalid" | "notfound"; cred?: Credential };
export function verify(list: Credential[], id: string): VerifyResult {
  const cred = list.find((c) => c.id.toLowerCase() === id.trim().toLowerCase());
  if (!cred) return { kind: "notfound" };
  const hashOk = cred.hash === mockHash(cred.id + cred.studentId + cred.title);
  return { kind: cred.status === "active" && hashOk ? "valid" : "invalid", cred };
}
