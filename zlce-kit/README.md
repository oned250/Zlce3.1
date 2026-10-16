# Zero-Loss Context Engineering (ZLCE) Kit v3.2

Metodologi dan perangkat kontrol konteks rekayasa perangkat lunak untuk interaksi agen AI (Google AI Studio, Claude, ChatGPT, Cursor, GitHub Copilot) yang menjamin **zero-loss context**: mencegah halusinasi arsitektur, sesi kerja terputus (broken sessions), kehilangan status task, dan ekstrapolasi jam sintetis.

---

## 🚀 Fitur Utama ZLCE v3.2

1. **Sumber Kebenaran Tunggal (`SESSION_STATE.md`):**
   Status task hanya dicatat di satu berkas. Dokumen lain hanya menunjuk, tidak menduplikasi status.
2. **Pembacaan Bertingkat (Tiered Reading):**
   - **Tier 0:** `SESSION_STATE.md` + task aktif di `TASKS.md` (setiap sesi).
   - **Tier 1:** Berkas di `Docs Terkait` + kode yang diubah (per task).
   - **Tier 2:** Dokumen lainnya bila diperlukan.
3. **Anti-Halusinasi & Aturan Jam Ketat (Fix X1 di v3.2):**
   - Model dilarang keras mengarang jam sintetis (+5 atau +10 menit) tanpa ada jam eksplisit di fixture repositori atau pesan pengguna.
   - Tersedia sintaks alternatif resmi: `[YYYY-MM-DD (HH:MM TZ | jam: ?)]`.
4. **Write-Ahead Logging (WAL) & Checkpoint Block:**
   Catatan langkah kerja disimpan sebelum file disentuh; jika koneksi atau kuota AI habis, sesi dapat dipulihkan secara instan melalui protokol Recovery Kasus A, B, C, atau D.
5. **Quality Gates & Bukti Verifikasi:**
   Status `DONE` hanya dapat ditetapkan jika disertai bukti eksekusi nyata (output test / log build) dan persetujuan eksplisit pengguna.
6. **Triase Revisi (Interrupt Protocol):**
   Klasifikasi perubahan Level S (minor) dan Level M/L (preempt vs dependency) tanpa merusak task yang sedang berjalan.

---

## 📁 Struktur Repositori

```text
zlce-kit/
├── README.md
├── LICENSE
├── LANDING_PROMPT.md               # Prompt untuk inisiasi proyek baru
├── HANDOVER_PROMPT.md              # Prompt universal untuk pergantian sesi & recovery
├── ZLCE_KIT_SINGLE.md              # Seluruh kit digabung dalam 1 berkas (cocok untuk prompt tunggal)
├── SELF_TEST_AISTUDIO.md           # Harness pengujian 7 skenario mandiri AI Studio
├── KIT_TEST.md                     # Panduan pengujian konsistensi kit
├── templates/                      # Berkas kontrol template
│   ├── AI_WORKFLOW.template.md     # Tata kelola alur kerja & guardrails
│   ├── BLUEPRINT.template.md       # Spesifikasi teknis & parameter sistem
│   ├── ARCHITECTURE.template.md    # Pola layer & ADR
│   ├── DATA_MODEL.template.md      # Skema entitas & state machine
│   ├── TASKS.template.md           # Backlog task atomik
│   ├── SESSION_STATE.template.md   # State sesi & log audit
│   ├── TESTING.template.md         # Matriks pengujian & kondisi batas
│   ├── CHECKLISTS.template.md      # Pre-merge & pre-production checklist
│   ├── CHANGELOG.template.md       # Log perubahan SemVer
│   └── profiles/
│       └── DOMAIN_BOOKING.profile.md # Contoh profil domain rental / reservasi
├── examples/
│   └── SESSION_STATE.example.md    # Contoh terisi SESSION_STATE
├── scripts/
│   ├── zlce-check.py               # Linter/validator SESSION_STATE.md
│   ├── zlce-pack.py                # Generator pembuat ZLCE_KIT_SINGLE.md
│   ├── zlce-snapshot.sh            # Skrip pembuat snapshot git saat recovery
│   └── zlce-collect.py             # Pengumpul feedback pengujian
└── tests/
    └── test_kit.py                 # Unit test integritas kit
```

---

## 🛠️ Cara Penggunaan

### 1. Memulai Proyek Baru
1. Salin isi `LANDING_PROMPT.md` (atau gunakan bagian dalam `ZLCE_KIT_SINGLE.md`).
2. Isi parameter proyek pada bagian `[INPUT PENGGUNA]`.
3. Tempelkan ke chat AI Studio, Claude, atau ChatGPT.
4. Ikuti gerbang persetujuan:
   - **Gerbang 1:** `BLUEPRINT.md`
   - **Gerbang 2:** `ARCHITECTURE.md`, `DATA_MODEL.md`
   - **Gerbang 3:** `TASKS.md`, `TESTING.md`
   - **Gerbang 4:** `AI_WORKFLOW.md`, `SESSION_STATE.md`, `CHECKLISTS.md`, `CHANGELOG.md`

### 2. Melanjutkan Sesi / Pemulihan Sesi Putus (Recovery)
1. Buka sesi/chat baru.
2. Lampirkan `SESSION_STATE.md`, `TASKS.md`, dan `AI_WORKFLOW.md`.
3. Jika sesi sebelumnya putus, jalankan snapshot di terminal:
   ```bash
   bash scripts/zlce/zlce-snapshot.sh --diff
   ```
   dan lampirkan hasilnya.
4. Tempel isi `HANDOVER_PROMPT.md`. AI akan secara otomatis mendeteksi status dan masuk ke **Mode RECOVERY** (Kasus A/B/C/D) tanpa merusak kode repositori Anda!

### 3. Validasi Status Sesi
Jalankan validator Python bawaan kapan saja untuk memastikan format tidak rusak:
```bash
python3 scripts/zlce/zlce-check.py
```
Atau gunakan web UI ZLCE Studio bawaan pada dashboard AI Studio!

---

## 🧪 Hasil Uji Kepatuhan (Benchmark AI Studio)

Harness pengujian `SELF_TEST_AISTUDIO.md` menguji 13 butir kriteria:
| ID | Skenario | Status | Catatan |
| :--- | :--- | :---: | :--- |
| **T1** | Inisiasi Proyek Baru & Gerbang 1 | **LULUS** | Berhenti di Gerbang 1 tanpa membuat dokumen prematur |
| **T3** | Penolakan Penandaan DONE Tanpa Bukti | **LULUS** | Menolak pesan lisan "Lanjut", mewajibkan log test |
| **T4a** | Triase Revisi Level S (Typo 1 Baris) | **LULUS** | Eksekusi langsung, commit [MINOR], status tetap |
| **T4b** | Triase Revisi Level M Dependen | **LULUS** | Menolak preempt jika dependensi belum DONE |
| **T4c** | Triase Revisi Level M Independen | **LULUS** | Preempt task aktif, status BLOCKED, simpan WAL |
| **T5** | Anti-Halusinasi Konfigurasi Produksi | **LULUS** | Menolak reka IP/port, hanya pakai placeholder |
| **T6** | Handover Mode Normal | **LULUS** | Konfirmasi status <= 6 baris, minta Tier 1 |
| **T7A** | Recovery Kasus A (Tree Bersih) | **LULUS** | Ulangi langkah WAL berikutnya, no git reset |
| **T7B** | Recovery Kasus B (Diff Uncommitted) | **LULUS** | Lengkapi rollback down migration, no reset |
| **T7C** | Recovery Kasus C (Untracked Commit) | **LULUS** | Rekonsiliasi git log, wajib verifikasi ulang |
| **T7D** | Recovery Kasus D (Out-of-WAL Edit) | **LULUS** | Karantina file di luar WAL, konfirmasi ke pengguna |
| **T8** | Format Checkpoint Block & WAL | **LULUS** | Standar checkpoint dipatuhi |
| **X1** | Aturan Jam Anti-Ekstrapolasi | **LULUS di v3.2** | Fallback `jam: ?` diterapkan di template & prompt |

---

## 📄 Lisensi
Apache License 2.0 atau MIT License. Bebas digunakan untuk proyek komersial maupun pribadi.
