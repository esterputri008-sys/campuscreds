# CampusCreds

## Deskripsi
CampusCreds adalah prototype aplikasi web untuk penerbitan dan verifikasi credential mahasiswa secara digital.

Aplikasi ini membantu mahasiswa, organisasi kampus, dan verifier melakukan pengecekan keaslian credential menggunakan simulasi proof berbasis hash.

## Masalah yang Diselesaikan
Credential mahasiswa dalam bentuk digital dapat sulit diverifikasi karena dokumen dapat disalin atau dimodifikasi.

CampusCreds menyediakan sistem verifikasi menggunakan Credential ID dan verification hash dummy untuk membantu pengecekan credential.

## Target Pengguna
- Student
- Organization Admin
- Verifier

## Fitur Utama
1. Organization Admin dapat menerbitkan credential dummy.
2. Sistem membuat Credential ID unik.
3. Sistem menghasilkan verification hash dummy.
4. Student dapat melihat credential miliknya.
5. Verifier dapat melakukan verifikasi credential berdasarkan Credential ID.

## Teknologi
- React
- TypeScript
- Vite
- Reusable Components

## Simulasi Blockchain
Fitur blockchain pada CampusCreds masih berupa simulasi antarmuka.

Network:
Solana Devnet Simulation

Project ini tidak melakukan:
- Transaksi blockchain nyata.
- Smart contract.
- Wallet authentication asli.
- Penyimpanan private key.
- Penyimpanan seed phrase.

## Data
Seluruh data yang digunakan merupakan data dummy/sintetis.

Project tidak menggunakan data mahasiswa asli atau data sensitif.

## Cara Menjalankan Project

Install dependency:

```bash
npm install
