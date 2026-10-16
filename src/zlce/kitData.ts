/**
 * ZLCE (Zero-Loss Context Engineering) Kit v3.2
 * Contains all official kit files, templates, profiles, and diffs.
 */

export interface KitFile {
  path: string;
  title: string;
  category: 'core' | 'template' | 'profile' | 'test' | 'bundle';
  description: string;
  version: string;
  hasV32Fix?: boolean;
  content: string;
}

export const ZLCE_VERSION = 'v3.2';

export const KIT_FILES: Record<string, KitFile> = {
  'LANDING_PROMPT.md': {
    path: 'LANDING_PROMPT.md',
    title: 'Landing Prompt v3.2: Memulai Proyek Baru',
    category: 'core',
    description: 'Prompt paten inisiasi proyek baru dengan protokol ZLCE, gerbang persetujuan 1-4, dan aturan anti-halusinasi.',
    version: '3.2',
    hasV32Fix: true,
    content: `# LANDING PROMPT v3.2: MEMULAI PROYEK BARU (ZLCE)

Hanya untuk **awal proyek** (atau restrukturisasi). Pindah sesi/AI di tengah proyek, termasuk sesi terputus: gunakan \`HANDOVER_PROMPT.md\`.

## CARA PAKAI
1. Buka sesi AI. **Lampirkan** seluruh \`templates/\` (+ profil domain bila ada) dan, bila AI mampu menyimpan berkas, \`scripts/\`. Tanpa dukungan lampiran: tempel template, atau andalkan Skeleton Fallback (Bagian 6).
2. Isi semua \`[PLACEHOLDER]\` di Bagian 1, salin seluruh blok, tempel ke AI.
3. Simpan setiap berkas yang dihasilkan ke repositori. Salin \`scripts/\` ke \`scripts/zlce/\` di repositori.

---

\`\`\`markdown
# MASTER SYSTEM DIRECTIVE: PROJECT INITIATION PROTOCOL v3.2

Peran: Principal Software Architect & Lead Engineer.
Metodologi: Zero-Loss Context Engineering (ZLCE): berkas kontrol, task atomik, bukti verifikasi, dan titik pemulihan sesi. Tujuan: meminimalkan kehilangan konteks (target, bukan jaminan).

## 1. PARAMETER PROYEK (INPUT PENGGUNA)
- Nama Proyek: [NAMA]
- Aksi: [BARU | RESTRUKTURISASI proyek existing]
- MODE: [FULL | LITE]
  - FULL: 10 berkas kontrol (Bagian 3).
  - LITE: \`BLUEPRINT.md\`, \`TASKS.md\`, \`SESSION_STATE.md\`, \`HANDOVER.md\`; aturan global Bagian 2 tetap berlaku (proyek < ~15 task). Model data di \`BLUEPRINT.md\` bagian 7, strategi uji di bagian 8; \`Docs Impact\` hanya merujuk dokumen yang ada; \`Test Case\` merujuk nama test, bukan ID \`TC-xx\`.
- Domain / Industri: [CONTOH: Logistik / Rental Kendaraan / FinTech]
- Profil Domain (opsional): [booking | none]
- Sasaran: [CONTOH: Web App, API, Admin Dashboard]
- Tech Stack: [CONTOH: Next.js 15 / PostgreSQL / Tailwind]
- Skala & Lingkungan: [CONTOH: Production, Multi-tenant]
- Kemampuan Tulis Berkas AI: [YA | TIDAK, gunakan Checkpoint Block]
- Kemampuan Eksekusi AI: [YA | TIDAK, pengguna menjalankan perintah]
- Kebutuhan Inti:
  [3-10 poin]
- RESTRUKTURISASI: lampirkan struktur direktori + berkas kunci. Audit baca-saja dahulu; dilarang mengubah kode sebelum \`TASKS.md\` disetujui.

---

## 2. ATURAN GLOBAL (SEPANJANG PROYEK)

R1. **Sumber Kebenaran Tunggal:** status task hanya di \`SESSION_STATE.md\`. Berkas lain menunjuk, tidak menduplikasi.
R2. **Pembacaan Bertingkat:** Tier 0 (tiap sesi): \`SESSION_STATE.md\` + entri task aktif di \`TASKS.md\`. Tier 1 (per task): \`Docs Terkait\` + kode yang diubah. Tier 2: sisanya bila perlu.
R3. **Anti-Halusinasi:** informasi di luar berkas/lampiran = tidak diketahui. Catat \`ASM-xx\`/\`Q-xx\` di \`SESSION_STATE.md\` dan tanyakan. Verifikasi versi/API library sebelum dipakai. Dilarang mengarang output perintah, hasil test, atau isi berkas yang belum dibaca. Penomoran \`ASM\`/\`Q\`: satu urutan bersama, ID berikutnya = nomor tertinggi di bagian 4 + 1, dilarang memakai ulang. Dilarang mengarang jam: jam HANYA boleh berasal persis dari pesan pengguna, sistem, atau snapshot. Tanpa sumber jam baru, WAJIB tulis tanggal saja dan 'jam: ?' (contoh: '2026-10-14 jam: ?' atau gunakan jam eksis dari fixture bila mempertahankan state). DILARANG mengekstrapolasi/mengarang jam sintetis (seperti +5 atau +10 menit).
R4. **Single Task:** satu task \`IN_PROGRESS\` pada satu waktu.
R5. **Verifikasi Berbukti:** \`DONE\` hanya bila semua Acceptance Criteria terpenuhi, kolom Bukti Verifikasi terisi (output perintah/log test/pengamatan konkret), dan \`Disetujui: ya\`. AI tanpa eksekusi: berikan perintah persis, pengguna menempel output, status tetap \`IN_PROGRESS\` sampai bukti masuk.
R6. **Sinkronisasi Dokumen:** tiap task mendeklarasikan \`Docs Impact\`; dokumen terdampak diperbarui dalam task yang sama sebelum \`DONE\`.
R7. **Triase Revisi:** Level S (<= 1 berkas, <= 20 baris, tanpa perubahan skema/kontrak/keamanan/dependensi/AC): eksekusi langsung (tanpa kemampuan tulis/eksekusi = beri instruksi atau patch persis dan minta konfirmasi hasil), commit \`[MINOR]\`, catat CHANGELOG. Level M/L atau ragu: cek ketergantungan dahulu. Bila revisi mengubah/bergantung pada keluaran task yang belum DONE, jangan preempt: ubah AC task itu (scope change, minta persetujuan) atau daftarkan \`TASK-REV-NN\` berstatus PENDING yang bergantung padanya. Bila tidak bergantung: jeda task aktif (BLOCKED), daftarkan \`TASK-REV-NN\`, selesaikan lebih dulu. Penomoran: \`TASK-NNN\` dan \`TASK-REV-NN\` saja.
R8. **Keamanan:** input tervalidasi tipe ketat; output di-escape sesuai konteks; kueri terparameter; rahasia hanya via \`.env\`/secret manager.
R9. **Gaya:** dokumentasi teknis murni, ringkas, bullet/tabel, tanpa narasi.
R10. **Template Tidak Ada:** jangan menebak struktur. Minta lampiran atau gunakan Skeleton Fallback (Bagian 6) dan nyatakan penggunaannya.
R11. **Enum Status Tunggal:** \`PENDING | READY | IN_PROGRESS | BLOCKED | DONE\`.
R12. **Checkpoint & WAL (anti sesi terputus):** sebelum langkah multi-berkas, isi WAL (\`SESSION_STATE.md\` bagian 3); setelah langkah utuh, commit \`wip(<lingkup>): <langkah> [TASK-XXX]\` dan perbarui WAL. Sejak \`SESSION_STATE.md\` ada (Gerbang 4) dan tanpa akses tulis berkas: cetak CHECKPOINT BLOCK (format di \`AI_WORKFLOW.md\` bagian 8) di akhir setiap respons yang mengubah state. Sebelum Gerbang 4 tidak ada state dan tidak ada checkpoint. Jalankan \`scripts/zlce/zlce-check.py\` setelah memperbarui state dan sebelum \`DONE\`.
R13. **Pemulihan:** sesi baru yang menemukan WAL berisi task menjalankan prosedur RECOVERY (\`AI_WORKFLOW.md\` bagian 9, \`HANDOVER.md\`). Dilarang membatalkan perubahan tanpa persetujuan.

---

## 3. FASE 1: DOKUMEN KONTROL BERTAHAP DENGAN GERBANG PERSETUJUAN

Setelah tiap gerbang, BERHENTI dan tunggu persetujuan eksplisit. Jangan membuat berkas gerbang berikutnya sebelum itu.
- **Gerbang 1:** \`BLUEPRINT.md\`
- **Gerbang 2:** \`ARCHITECTURE.md\`, \`DATA_MODEL.md\` (impor profil domain bila ada)
- **Gerbang 3:** \`TASKS.md\`, \`TESTING.md\`
- **Gerbang 4:** \`AI_WORKFLOW.md\`, \`CHECKLISTS.md\`, \`SESSION_STATE.md\`, \`CHANGELOG.md\`, \`HANDOVER.md\`
  - \`HANDOVER.md\`: salinan VERBATIM blok prompt dari \`HANDOVER_PROMPT.md\` (jika tidak terlampir, minta pengguna menyalinnya; jangan menulis ulang).
  - \`scripts/zlce/\`: minta pengguna menyalin dari kit; jangan menulis ulang skrip.
  - \`SESSION_STATE.md\` awal: semua field terisi, matriks sesuai \`TASKS.md\`, WAL kosong (\`-\`).
LITE: Gerbang 1, lalu \`TASKS.md\` + \`SESSION_STATE.md\` + \`HANDOVER.md\`.

Batas output: bila respons akan terpotong, selesaikan satu berkas utuh per pesan dan sebutkan berkas berikutnya.

---

## 4. FASE 2: EKSEKUSI TASK
Per task: baca Tier 0/1 -> set \`IN_PROGRESS\` + isi WAL -> implementasi per langkah (commit \`wip\`) -> verifikasi (R5) -> sinkronisasi dokumen (R6) -> jalankan \`zlce-check\` -> perbarui \`SESSION_STATE.md\` + \`CHANGELOG.md\` -> kosongkan WAL -> \`DONE\`. Commit akhir: \`<tipe>(<lingkup>): <deskripsi> [TASK-XXX]\`.

---

## 5. HANDOVER
Pindah sesi/AI di tengah proyek, termasuk sesi terputus, memakai prompt paten \`HANDOVER.md\`. Kewajiban AI di sini: jaga \`SESSION_STATE.md\` mutakhir (R12), isi \`Catatan Serah Terima\` sepanjang sesi, dan pada \`/handover\` atau jeda sajikan \`SESSION_STATE.md\` lengkap. Tawarkan handover setelah ~20 pertukaran pesan substantif. Jangan membuat prompt handover baru.

---

## 6. SKELETON FALLBACK (bila template tidak terlampir)
- BLUEPRINT: 1 Parameter & Lingkungan (+ tabel versi dependensi); 2 Batasan Domain (BR-xx, Out of Scope); 3 Matriks Modul; 4 Integrasi; 5 NFR; 6 Asumsi & Pertanyaan; 7 Model Data Ringkas (LITE); 8 Strategi Uji (LITE).
- ARCHITECTURE: 1 Pola & Layer; 2 Pohon Direktori; 3 ADR.
- DATA_MODEL: 1 Entitas; 2 State Machine (Dari/Ke/Pemicu/Guard); 3 Formula.
- AI_WORKFLOW: 1 Konvensi; 2 Enum Status; 3 Guardrail; 4 Pembacaan Bertingkat; 5 Verifikasi; 6 Triase; 7 Git; 8 Checkpoint & WAL; 9 Pemulihan; 10 Mode LITE.
- TASKS: peta fase; per task: Fase, Deskripsi, Dependensi, File, Docs Terkait, Docs Impact, Acceptance Criteria, Test Case, Metode Verifikasi. Judul task \`### TASK-NNN: ...\`.
- SESSION_STATE (nomor bagian WAJIB): 0 Konteks; 1 Status Aktif (Timestamp Audit: format waktu nyata atau 'YYYY-MM-DD jam: ?'); 2 Matriks (kolom: ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui); 3 WAL (field: Task, Langkah Sedang Dikerjakan, Berkas Direncanakan/Disentuh, Sudah Dilakukan, Langkah Berikutnya (persis), Perintah Verifikasi, Diperbarui); 4 Asumsi & Pertanyaan; 5 Slot Revisi; 6 Catatan Serah Terima; 7 Log Audit.
- TESTING: 1 Atribut Kualitas; 2 Matriks Test Case (kolom Task Terkait); 3 Kondisi Batas.
- CHECKLISTS: Pre-Merge; Pre-Production.
- CHANGELOG: Keep a Changelog + SemVer.

---

## 7. RESPON PERTAMA ANDA
1. Konfirmasi parameter, MODE, dan dua kemampuan AI; daftar maks. 5 asumsi/pertanyaan awal.
2. Nyatakan template yang diterima atau penggunaan Skeleton Fallback.
3. Sajikan draf \`BLUEPRINT.md\` (Gerbang 1), lalu BERHENTI menunggu persetujuan.
\`\`\`
`,
  },

  'HANDOVER_PROMPT.md': {
    path: 'HANDOVER_PROMPT.md',
    title: 'Handover Prompt v3.2: Pindah Sesi / Recovery',
    category: 'core',
    description: 'Prompt paten universal untuk handover terencana atau pemulihan sesi terputus (Recovery kasus A-D).',
    version: '3.2',
    hasV32Fix: true,
    content: `# HANDOVER PROMPT v3.2 (PATEN): PINDAH SESI / PINDAH AI DI TENGAH PROYEK

Prompt ini tetap: tidak diubah antar-sesi, antar-AI, antar-proyek. Semua status ada di \`SESSION_STATE.md\`. Cocok untuk tiga situasi: (1) pindah sesi secara terencana, (2) pindah ke AI lain, (3) **sesi terputus** (mode RECOVERY terdeteksi otomatis dari WAL).

Salin juga isi blok ini ke repositori sebagai \`HANDOVER.md\` (verbatim) agar ikut terbawa.

## CARA PAKAI
1. Buka sesi/AI baru. Lampirkan: \`SESSION_STATE.md\`, \`TASKS.md\`, \`AI_WORKFLOW.md\`. Tambahkan berkas lain bila diminta.
2. Bila sesi sebelumnya putus: jalankan \`bash scripts/zlce/zlce-snapshot.sh --diff\` di root proyek dan lampirkan outputnya. Bila AI sebelumnya sempat mencetak CHECKPOINT BLOCK yang belum Anda simpan, simpan dulu ke \`SESSION_STATE.md\`.
3. Tempel blok di bawah apa adanya. Isi slot \`[REVISI]\` hanya bila ada revisi.

---

\`\`\`markdown
### C - CONTEXT
Anda melanjutkan proyek yang dikelola dengan metodologi ZLCE. Anda BUKAN agen pertama dan tidak punya ingatan sesi sebelumnya. Seluruh status ada di berkas kontrol. Sumber kebenaran status: \`SESSION_STATE.md\`; aturan kerja: \`AI_WORKFLOW.md\` (otoritatif bila prompt ini bertentangan).
Jika \`SESSION_STATE.md\` atau \`TASKS.md\` tidak terlampir: MINTA dan berhenti. Jangan menebak status.

### I - INSTRUCTION
Jalankan berurutan tanpa melompat.

LANGKAH 0 - DETEKSI MODE
- Baca \`SESSION_STATE.md\` penuh. Jalankan pemeriksaan logis yang setara \`zlce-check\` (enum status, satu IN_PROGRESS, DONE bertanda bukti + persetujuan, header = matriks). Laporkan ketidakkonsistenan; jangan memperbaikinya diam-diam.
- Mode RECOVERY bila bagian 3 (WAL) berisi task, ATAU pengguna menyatakan sesi putus, ATAU snapshot terlampir. Selain itu mode NORMAL.

LANGKAH 1 - MODE NORMAL
1. Konfirmasi ke pengguna (maks. 6 baris): proyek, MODE, task terakhir DONE, task aktif + status, \`ASM\`/\`Q\` OPEN, isi Catatan Serah Terima. Jangan meminta data yang sudah tertulis di \`SESSION_STATE.md\`; data repositori hanya diminta di mode RECOVERY atau bila ada indikasi ketidaksesuaian.
2. Lanjut ke LANGKAH 3.

LANGKAH 2 - MODE RECOVERY (sesi putus)
1. Konfirmasi singkat apa yang tertulis di WAL: task, langkah terakhir, berkas, langkah berikutnya.
2. Butuh data repositori: \`git status --short\`, \`git log -5\`, \`git diff --stat\` (atau RECOVERY SNAPSHOT). Belum ada = MINTA dan berhenti.
3. Klasifikasikan dan laporkan ke pengguna sebelum bertindak:
   - A: working tree bersih, tidak ada commit baru -> ulangi dari \`Langkah Berikutnya\` WAL.
   - B: perubahan tak ter-commit pada berkas WAL -> baca diff, nilai kelengkapan terhadap Acceptance Criteria, lanjutkan. Dilarang \`reset\`/\`checkout\`/menghapus perubahan tanpa persetujuan pengguna.
   - C: ada commit bertanda task yang belum tercermin di state -> perbarui \`SESSION_STATE.md\`, verifikasi ulang.
   - D: perubahan pada berkas di luar WAL -> laporkan dan tanyakan; jangan disentuh.
4. Dalam RECOVERY, \`DONE\` hanya dengan bukti verifikasi BARU. Klaim sesi lama bukan bukti.
5. Catat di log audit: \`RECOVERY: kasus [A-D], langkah dilanjutkan [..]\`. Tulis ulang WAL sesuai kondisi aktual.
6. Informasi yang tidak ada di berkas atau repositori = hilang. Tanyakan ke pengguna; jangan direka.

LANGKAH 3 - EVALUASI REVISI
Baca slot \`[REVISI]\` di bagian I/O dan \`Slot Revisi Aktif\` di \`SESSION_STATE.md\`:
- KOSONG: lanjutkan task aktif (atau ambil task READY berikutnya; set \`IN_PROGRESS\`).
- ADA ISI: triase sesuai \`AI_WORKFLOW.md\` bagian 6 (Level S: eksekusi langsung, commit \`[MINOR]\`; Level M/L: jeda task aktif, daftarkan \`TASK-REV-NN\`, selesaikan lebih dulu).

LANGKAH 4 - EKSEKUSI
1. Baca Tier 1: berkas \`Docs Terkait\` task aktif + kode yang akan diubah (read-before-write). Bila berkas Tier 1 tidak terlampir: MINTA dan berhenti sebelum menulis kode.
2. Isi WAL sebelum langkah multi-berkas; commit \`wip(...)\` setelah tiap langkah utuh.
3. Kerjakan SATU task. Patuhi \`AI_WORKFLOW.md\`.
4. Tanpa akses tulis berkas: cetak CHECKPOINT BLOCK di akhir setiap respons yang mengubah state.

### D - DETAILS
- Larangan: menebak informasi yang tidak ada di berkas (catat \`ASM\`/\`Q\` dan tanyakan); mengarang output perintah/hasil test; menghapus/mengganti nama berkas kontrol tanpa persetujuan tertulis; mengerjakan lebih dari satu task; \`DONE\` tanpa bukti + persetujuan; menafsirkan pesan pendek ("lanjut", "oke") sebagai persetujuan DONE (persetujuan harus menyebut task atau DONE); mengarang jam (tanpa jam dari pengguna/sistem tulis tanggal saja dan \`jam: ?\`); memakai ulang ID \`ASM\`/\`Q\` (lanjutkan dari nomor tertinggi); membatalkan perubahan yang belum dipahami.
- Preservasi Jam Sumber (ATURAN X1): Jam audit dan checkpoint HANYA boleh mengambil string waktu persis dari fixture (mis. 10:20:00 WIB) atau snapshot (mis. 11:02:10+07:00). Tanpa sumber waktu baru dari pengguna/snapshot, DILARANG memajukan jam secara sintetis; pertahankan jam dari state terakhir atau gunakan '[YYYY-MM-DD jam: ?]'.
- Verifikasi: tanpa kemampuan eksekusi, berikan perintah persis dan minta pengguna menempel output; status tetap \`IN_PROGRESS\` sampai bukti masuk.
- Sinkronisasi: perbarui dokumen pada \`Docs Impact\` sebelum \`DONE\`.
- Gaya: bahasa teknis murni, ringkas, bullet/tabel.

### I - INPUT / OUTPUT
[REVISI / UPDATE / PERUBAHAN DI LUAR RENCANA]:
(KOSONGKAN BILA TIDAK ADA)

Output wajib sesi ini:
1. Hasil deteksi mode + konfirmasi status (dan klasifikasi A-D bila RECOVERY) SEBELUM menulis kode.
2. Implementasi task aktif + bukti verifikasi terhadap Acceptance Criteria.
3. \`SESSION_STATE.md\` mutakhir (status, bukti, WAL, Catatan Serah Terima, log), \`CHANGELOG.md\`, dan dokumen terdampak.
4. Saat pengguna mengetik \`/handover\` atau sesi akan berakhir: pastikan state mutakhir dan sajikan \`SESSION_STATE.md\` lengkap (atau CHECKPOINT terakhir) untuk disimpan. Prompt ini tidak perlu dibuat ulang.
\`\`\`
`,
  },

  'templates/AI_WORKFLOW.template.md': {
    path: 'templates/AI_WORKFLOW.template.md',
    title: 'AI Workflow Template v3.2',
    category: 'template',
    description: 'Satu-satunya definisi aturan kerja AI, enum status, triase revisi, checkpoint block, dan pemulihan.',
    version: '3.2',
    hasV32Fix: true,
    content: `# TATA KELOLA AI, ALUR KERJA & STANDAR TEKNIS: [NAMA_PROYEK]

Satu-satunya definisi aturan kerja, enum status, triase, dan git. Berkas lain merujuk ke sini.

---

## 1. KONVENSI TEKNIS

1. Bahasa dokumentasi: teknis murni, ringkas, bullet/tabel, tanpa narasi.
2. Waktu: ISO 8601 dengan zona (mis. \`2026-10-14 09:30:00 WIB\` atau \`2026-10-14 jam: ?\` bila jam tidak ada di sumber).
3. Penamaan:
   - Direktori/berkas: \`kebab-case\` (ikuti konvensi framework bila berbeda, mis. \`class-booking-service.php\`).
   - Kelas \`PascalCase\`; fungsi \`camelCase\`; variabel konsisten satu gaya; konstanta \`UPPER_SNAKE_CASE\`.

---

## 2. ENUM STATUS (TUNGGAL)

\`PENDING | READY | IN_PROGRESS | BLOCKED | DONE\`

| Status | Arti |
| :--- | :--- |
| \`PENDING\` | Dependensi belum \`DONE\` |
| \`READY\` | Dependensi \`DONE\`, belum dimulai |
| \`IN_PROGRESS\` | Sedang dikerjakan (maks. 1 task) |
| \`BLOCKED\` | Terhenti; alasan wajib dicatat di \`SESSION_STATE.md\` |
| \`DONE\` | AC terpenuhi + bukti terisi + disetujui pengguna |

Nilai lain dilarang di semua berkas.

---

## 3. GUARDRAIL AI

1. Dilarang menghapus/mengganti nama berkas kontrol tanpa persetujuan tertulis.
2. Satu task \`IN_PROGRESS\` pada satu waktu.
3. Read-before-write: baca kode modul terkait sebelum mengubahnya.
4. Tidak menebak: informasi di luar berkas/lampiran = tidak diketahui. Catat \`ASM-xx\`/\`Q-xx\` di \`SESSION_STATE.md\` dan tanyakan.
   Penomoran: satu urutan bersama lintas \`ASM\`/\`Q\`. ID berikutnya = nomor tertinggi di \`SESSION_STATE.md\` bagian 4 + 1 (mis. \`ASM-01\`, \`Q-02\`, \`ASM-03\`). Dilarang memakai ulang ID atau nomor.
5. Verifikasi versi & API library sebelum dipakai; catat di \`BLUEPRINT.md\` bagian dependensi.
6. Dilarang mengarang output perintah/hasil test.
7. Rahasia hanya via \`.env\`; tidak ada kredensial di repositori.
8. Waktu (ATURAN X1 ANTI-EKSTRAPOLASI): dilarang mengarang jam. Pakai jam persis yang diberikan pengguna atau dari snapshot/fixture repositori. Bila tidak ada jam baru, WAJIB menulis tanggal saja dan 'jam: ?' (contoh: '2026-10-14 jam: ?' atau pertahankan jam eksis fixture). DILARANG memajukan jam secara sintetis (+5 atau +10 menit).

---

## 4. PEMBACAAN BERTINGKAT

| Tier | Isi | Kapan |
| :--- | :--- | :--- |
| 0 | \`SESSION_STATE.md\`, entri task aktif di \`TASKS.md\` | Setiap sesi |
| 1 | Berkas di \`Docs Terkait\` task + kode yang diubah | Per task |
| 2 | Dokumen lain | Hanya bila perlu |

---

## 5. ATURAN VERIFIKASI

1. \`DONE\` memerlukan: semua AC terpenuhi, kolom Bukti Verifikasi terisi, \`Disetujui: ya\`.
2. Bukti = output perintah, log test, atau hasil pengamatan konkret (bukan pernyataan "sudah lolos").
3. AI tanpa eksekusi: berikan perintah persis; pengguna menjalankan dan menempel output; status tetap \`IN_PROGRESS\` sampai bukti masuk.
4. Sinkronisasi: dokumen pada \`Docs Impact\` diperbarui dalam task yang sama sebelum \`DONE\`.
5. \`SESSION_STATE.md\` diperbarui pada setiap perubahan status task, setiap commit, dan setiap langkah WAL (bagian 8).
6. Persetujuan \`DONE\` harus eksplisit dan menyebut task atau kata \`DONE\`. Pesan pendek ("lanjut", "oke", "lanjutkan") bukan persetujuan \`DONE\`.

---

## 6. TRIASE REVISI (INTERRUPT PROTOCOL)

| Level | Kriteria | Penanganan |
| :--- | :--- | :--- |
| S | <= 1 berkas, <= 20 baris, tanpa perubahan skema/kontrak/keamanan/dependensi/AC | Eksekusi langsung; commit \`[MINOR]\`; catat di \`CHANGELOG.md\` (\`Fixed\`/\`Changed\`) |
| M/L | Selain Level S, atau ragu | Prosedur di bawah |

Tanpa kemampuan tulis/eksekusi, "eksekusi langsung" berarti memberi instruksi atau patch persis dan meminta pengguna mengonfirmasi hasilnya.

**Cek ketergantungan (wajib sebelum membuat \`TASK-REV-NN\`):** apakah revisi mengubah atau bergantung pada keluaran task yang belum \`DONE\` (tabel, berkas, atau kontrak yang task itu bangun)?
- YA: jangan preempt. Pilih (i) ubah AC/Docs Impact task tersebut sebagai perubahan scope (catat di \`Catatan Serah Terima\` dan \`CHANGELOG.md\`, minta persetujuan), atau (ii) daftarkan \`TASK-REV-NN\` berstatus \`PENDING\` dengan dependensi ke task itu, dikerjakan setelah \`DONE\`.
- TIDAK: lanjutkan prosedur preempt di bawah.

Prosedur M/L (preempt):
1. Tangkap parameter revisi; jeda task reguler: ubah statusnya menjadi \`BLOCKED\` dengan alasan "preempted by TASK-REV-NN" (hanya satu task boleh \`IN_PROGRESS\`), pindahkan isi WAL-nya ke \`Catatan Serah Terima\`, lalu isi WAL baru untuk task revisi.
2. Daftarkan \`TASK-REV-NN\` di \`TASKS.md\` lengkap dengan AC dan Docs Impact.
3. Perbarui \`SESSION_STATE.md\`; eksekusi dan verifikasi (bagian 5).
4. Catat di \`CHANGELOG.md\`; kembalikan task reguler yang dijeda ke \`IN_PROGRESS\` (pulihkan WAL dari \`Catatan Serah Terima\`) dan lanjutkan.

Penomoran: \`TASK-NNN\` (reguler), \`TASK-REV-NN\` (revisi). Tidak ada skema lain.

---

## 7. GIT & COMMIT

Conventional Commits:

\`\`\`text
<tipe>(<lingkup>): <deskripsi imperatif> [TASK-XXX | TASK-REV-NN | MINOR]

feat(booking): implement atomic availability check [TASK-012]
fix(auth): sanitize registration payload [TASK-REV-02]
fix(ui): correct label typo [MINOR]
\`\`\`

Tipe: \`feat\`, \`fix\`, \`refactor\`, \`test\`, \`docs\`, \`chore\`, \`wip\`.
\`wip(<lingkup>): <langkah> [TASK-XXX]\` = commit titik-simpan di branch fitur untuk melindungi dari sesi terputus; di-squash saat merge ke \`main\`.
Branch: \`feature/<task-id>-<slug>\`; merge ke \`main\` hanya setelah Pre-Merge Checklist lolos.

---

## 8. CHECKPOINT & WAL (PENCEGAHAN SESI TERPUTUS)

Prinsip: sesi bisa putus kapan saja (kuota, timeout, tab tertutup). Yang selamat hanya yang tertulis di berkas atau repositori.

1. **WAL (tulis-dahulu):** sebelum langkah yang menyentuh > 1 berkas atau > ~30 menit kerja, isi \`SESSION_STATE.md\` bagian 3: Task, Langkah Sedang Dikerjakan, Berkas Direncanakan/Disentuh, Langkah Berikutnya (persis), Perintah Verifikasi. Sesudah langkah selesai, perbarui \`Sudah Dilakukan\` dan \`Langkah Berikutnya\`. Kosongkan saat task \`DONE\`.
2. **Commit titik-simpan:** setelah tiap langkah WAL yang menghasilkan kode utuh (build/lint tidak rusak), buat commit \`wip(...)\` di branch fitur. Dilarang meninggalkan perubahan besar tanpa commit antar-langkah.
3. **Checkpoint Block (AI tanpa akses tulis berkas):** berlaku sejak \`SESSION_STATE.md\` ada (setelah Gerbang 4); sebelum itu tidak ada state dan pengguna menyimpan tiap berkas gerbang yang disetujui. Di akhir SETIAP respons yang mengubah status, menyelesaikan langkah WAL, atau menambah keputusan, AI mencetak blok berikut persis dalam format \`SESSION_STATE.md\` agar pengguna menempel/menimpa:

\`\`\`text
=== ZLCE CHECKPOINT [YYYY-MM-DD (HH:MM TZ | jam: ?)] ===
## 1. STATUS AKTIF        (salinan lengkap bagian 1)
## 2. MATRIKS TASK        (hanya baris yang berubah)
## 3. WORK IN PROGRESS (WAL)  (salinan lengkap bagian 3)
## 6. CATATAN SERAH TERIMA (hanya bila berubah)
## 7. LOG AUDIT           (satu baris baru)
=== END CHECKPOINT ===
\`\`\`

   ATURAN KERAS TIMESTAMP: Jika jam eksplisit tidak tersedia di pesan pengguna atau snapshot repositori, WAJIB menulis tanggal saja dan 'jam: ?' (contoh: [2026-10-14 jam: ?]). DILARANG mengarang jam (seperti +5 atau +10 menit).
   Pengguna wajib menyimpan checkpoint terakhir ke \`SESSION_STATE.md\` sebelum menutup sesi. AI dengan akses tulis berkas menulis langsung dan tidak perlu mencetak blok (cukup nyatakan "SESSION_STATE diperbarui").
4. **Validasi:** jalankan \`python3 scripts/zlce/zlce-check.py\` setelah memperbarui state dan sebelum menandai \`DONE\`. 0 ERROR wajib.

---

## 9. PEMULIHAN SESI TERPUTUS (RECOVERY)

Dipicu bila \`SESSION_STATE.md\` bagian 3 (WAL) berisi task, atau pengguna menyatakan sesi sebelumnya putus. Prompt pengarah: \`HANDOVER.md\`.

1. Minta RECOVERY SNAPSHOT (\`bash scripts/zlce/zlce-snapshot.sh --diff\`) bila belum dilampirkan. Tanpa skrip: minta output \`git status --short\`, \`git log -5 --oneline\`, \`git diff --stat\`.
2. Rekonsiliasi WAL terhadap repositori. Klasifikasi:

| Kasus | Ciri | Tindakan |
| :--- | :--- | :--- |
| A | Working tree bersih, tidak ada commit baru | Pekerjaan langkah WAL belum tersimpan: ulangi dari \`Langkah Berikutnya\` |
| B | Perubahan tak ter-commit pada berkas WAL | Baca diff, nilai kelengkapan terhadap AC, lanjutkan; dilarang \`reset\`/\`checkout\` tanpa persetujuan |
| C | Ada commit bertanda task yang belum tercermin di state | Perbarui \`SESSION_STATE.md\` sesuai commit; verifikasi ulang |
| D | Perubahan pada berkas di luar WAL | Laporkan dan tanyakan; jangan disentuh |

3. Dalam pemulihan, status \`DONE\` tidak boleh ditetapkan tanpa bukti verifikasi BARU (bukan dari klaim sesi sebelumnya).
4. Catat di log audit: \`RECOVERY: kasus [A-D], langkah dilanjutkan [..]\`.
5. Konteks yang tidak ada di berkas atau repositori dinyatakan hilang dan ditanyakan ke pengguna, bukan direka.

---

## 10. MODE LITE

Berkas kontrol: \`BLUEPRINT.md\`, \`TASKS.md\`, \`SESSION_STATE.md\`, \`HANDOVER.md\`. Aturan lain tetap berlaku.
1. Model data ditulis di \`BLUEPRINT.md\` bagian 7; strategi uji di bagian 8. \`DATA_MODEL.md\` dan \`TESTING.md\` tidak dibuat.
2. \`Docs Impact\` hanya boleh merujuk dokumen yang ada (di LITE: \`BLUEPRINT\`, \`TASKS\`).
3. \`Test Case\` pada task merujuk nama atau path test (mis. \`tests/test_migrations.py::test_down\`), bukan ID \`TC-xx\`.
`,
  },

  'templates/SESSION_STATE.template.md': {
    path: 'templates/SESSION_STATE.template.md',
    title: 'Session State Template v3.2',
    category: 'template',
    description: 'Sumber kebenaran tunggal status task, WAL, asumsi, dan log audit.',
    version: '3.2',
    hasV32Fix: true,
    content: `# STATUS SESI (SESSION_STATE.md): [NAMA_PROYEK]

**Sumber kebenaran tunggal status task dan titik pemulihan sesi.** Perbarui pada setiap perubahan status task, setiap commit, dan setiap langkah WAL. Enum: \`PENDING | READY | IN_PROGRESS | BLOCKED | DONE\`.
Format dibaca skrip \`scripts/zlce/zlce-check.py\`; jangan ubah nama field, kolom, atau nomor bagian.

---

## 0. KONTEKS PROYEK (statis)

* **Proyek:** [NAMA_PROYEK]
* **Stack:** [TECH_STACK]
* **MODE:** [FULL | LITE]
* **Kemampuan Tulis Berkas AI:** [YA | TIDAK, gunakan Checkpoint Block]
* **Kemampuan Eksekusi AI:** [YA | TIDAK, pengguna menjalankan perintah]

---

## 1. STATUS AKTIF

* **Timestamp Audit:** [YYYY-MM-DD HH:MM:SS TZ | YYYY-MM-DD jam: ?]
* **Cabang Git:** \`[branch]\`
* **Task Terakhir DONE:** \`[TASK-ID]\`
* **Task Aktif:** \`[TASK-ID]\`
* **Status Task Aktif:** [IN_PROGRESS | READY | BLOCKED]
* **Task Berikutnya:** \`[TASK-ID]\`

---

## 2. MATRIKS TASK

| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | [..] | - | READY | - | - |
| \`TASK-002\` | [..] | TASK-001 | PENDING | - | - |

Bukti Verifikasi: ringkasan + lokasi bukti (mis. "lint 0 error, 12/12 test pass; docs/evidence/TASK-002.txt"). \`DONE\` tanpa bukti dan \`Disetujui: ya\` tidak valid.

---

## 3. WORK IN PROGRESS (WAL)

Catatan tulis-dahulu: isi SEBELUM memulai langkah multi-berkas, perbarui SESUDAH langkah selesai. Kosongkan (semua \`-\`) saat task \`DONE\`.

* **Task:** -
* **Langkah Sedang Dikerjakan:** -
* **Berkas Direncanakan/Disentuh:** -
* **Sudah Dilakukan:** -
* **Langkah Berikutnya (persis):** -
* **Perintah Verifikasi:** -
* **Diperbarui:** -

---

## 4. ASSUMPTIONS & OPEN QUESTIONS

| ID | Jenis | Isi | Dampak jika salah | Status |
| :--- | :--- | :--- | :--- | :--- |
| \`ASM-01\` | Asumsi | [..] | [..] | OPEN |

Status: \`OPEN | CONFIRMED | REJECTED | ANSWERED\`. Jika ragu, catat di sini dan tanyakan; jangan mengarang.

---

## 5. SLOT REVISI AKTIF

| ID | Level (S/M/L) | Deskripsi | Tindakan |
| :--- | :--- | :--- | :--- |
| (kosong) | | | |

---

## 6. CATATAN SERAH TERIMA (ditimpa; maks. ~10 baris)

Konteks yang belum tertulis di berkas lain: keputusan penting, jebakan yang ditemukan, preferensi pengguna yang relevan, langkah pertama yang disarankan.

* [YYYY-MM-DD] [catatan]

---

## 7. LOG AUDIT (terbaru di atas; arsipkan entri lama ke \`docs/archive/\`)

* **[YYYY-MM-DD (HH:MM TZ | jam: ?)]:** [peristiwa singkat + referensi task/commit]
`,
  },

  'templates/BLUEPRINT.template.md': {
    path: 'templates/BLUEPRINT.template.md',
    title: 'Blueprint Template v3.2',
    category: 'template',
    description: 'Spesifikasi sistem, batasan domain (BR-xx), matriks modul, dan NFR.',
    version: '3.2',
    content: `# SPESIFIKASI TEKNIS & BLUEPRINT SISTEM: [NAMA_PROYEK]

Spesifikasi sistem, batasan domain, matriks modul, dan NFR. Diperbarui bila task dengan \`Docs Impact: BLUEPRINT\` selesai.

---

## 1. PARAMETER SISTEM & LINGKUNGAN

* **Nama Sistem:** [NAMA]
* **Profil Domain:** [none | booking | ...] (lihat \`templates/profiles/\`)
* **Lingkungan Produksi:**
  - Runtime: [CONTOH: Node.js 20+ / PHP 8.2 / Python 3.12 / Go 1.22]
  - Web Server: [CONTOH: Nginx / Apache / LiteSpeed / Cloud Run]
  - Database: [CONTOH: PostgreSQL 16 / MariaDB 10.11]
  - Framework / CMS: [CONTOH: Next.js 15 / WordPress 6.x / FastAPI]
* **Versi Dependensi Terverifikasi:**

| Dependensi | Versi | Sumber Verifikasi | Tanggal |
| :--- | :--- | :--- | :--- |
| [nama] | [x.y.z] | [dokumentasi resmi / lockfile] | [YYYY-MM-DD] |

* **Standar Keamanan:**
  - Transit: HTTPS / TLS 1.2+ (prefer 1.3)
  - Masukan: validasi tipe ketat + proteksi anti-forgery sesuai framework (CSRF token / nonce)
  - Injeksi: prepared statement / ORM terparameter
  - Rahasia: \`.env\` / secret manager; tidak ada di repositori

---

## 2. BATASAN DOMAIN BISNIS

1. **Aturan Bisnis (BR-xx):**
   - \`BR-01\`: [aturan terukur]
   - \`BR-02\`: [aturan terukur]
2. **Lingkup & Batas Operasional:**
   - Wilayah layanan: [..]
   - Jam operasional: [..]
3. **Out of Scope:**
   - [hal yang secara eksplisit TIDAK dikerjakan]

---

## 3. MATRIKS MODUL

| ID Modul | Nama Modul | Fungsi Utama | Dependensi |
| :--- | :--- | :--- | :--- |
| \`MOD-01\` | Core | Inisialisasi, konfigurasi | Runtime |
| \`MOD-02\` | Auth & RBAC | Hak akses | MOD-01 |
| \`MOD-03\` | Skema Data | Entitas & relasi | MOD-01 |
| \`MOD-04\` | Logika Bisnis | Kalkulasi, validasi, state transition | MOD-03 |
| \`MOD-05\` | UI | Form, portal pengguna | MOD-04 |
| \`MOD-06\` | Dashboard Admin | Operasional, laporan | MOD-02, MOD-04 |
| \`MOD-07\` | Integrasi | Pembayaran, notifikasi, webhook | MOD-04 |

---

## 4. INTEGRASI EKSTERNAL

* Pembayaran: [..]
* Notifikasi: [..]
* Peta/Geo: [..]

---

## 5. NFR

1. Performa: [target terukur, mis. API p95 < 300ms; LCP < 2.5s]
2. Ketersediaan: [mis. 99.9%]
3. Auditability: mutasi data mencatat timestamp ISO 8601, ID pelaksana, status perubahan.

---

## 6. ASUMSI & PERTANYAAN TERBUKA AWAL
Salin ke \`SESSION_STATE.md\` bagian 3 sebagai \`ASM-xx\` / \`Q-xx\`. Tidak boleh ada pertanyaan terbuka berstatus kritis saat Gerbang 1 disetujui.

---

## 7. MODEL DATA RINGKAS (MODE LITE saja; FULL memakai \`DATA_MODEL.md\`)
* Entitas, kolom, tipe, constraint, indeks, state machine (Dari/Ke/Pemicu/Guard), formula.

---

## 8. STRATEGI UJI (MODE LITE saja; FULL memakai \`TESTING.md\`)
* Tipe uji, perintah menjalankan, kasus batas wajib, kriteria lulus.
`,
  },

  'templates/ARCHITECTURE.template.md': {
    path: 'templates/ARCHITECTURE.template.md',
    title: 'Architecture Template v3.2',
    category: 'template',
    description: 'Pola layer, pohon direktori, dan Architectural Decision Records (ADR).',
    version: '3.2',
    content: `# SPESIFIKASI ARSITEKTUR SISTEM: [NAMA_PROYEK]

Arsitektur, layer, pohon direktori, ADR. Diperbarui bila task dengan \`Docs Impact: ARCHITECTURE\` selesai.

---

## 1. POLA & LAYER

\`\`\`text
PRESENTATION   UI, views, client assets
     | event / form submission
APPLICATION    routing, anti-forgery validation, RBAC checks
     | validated payload
DOMAIN         services, state machine, kalkulasi
     | persistence
INFRASTRUCTURE DB, cache, API/webhook eksternal
\`\`\`

Aturan dependensi: panah hanya ke bawah. Layer bawah tidak mengimpor layer atas. Tidak ada circular dependency antar modul.

---

## 2. POHON DIREKTORI

\`\`\`text
[project-root]/
├── config/
├── src/
│   ├── modules/        # modul fitur mandiri
│   ├── services/       # logika bisnis
│   ├── middleware/     # otorisasi, sanitasi, logging
│   └── utils/          # helper murni
├── public/
├── tests/
├── docs/               # operasional, deployment, archive/
├── .env.example
├── BLUEPRINT.md  ARCHITECTURE.md  DATA_MODEL.md
├── AI_WORKFLOW.md  TASKS.md  SESSION_STATE.md  TESTING.md
├── CHECKLISTS.md  HANDOVER.md  CHANGELOG.md
\`\`\`

---

## 3. ADR

### ADR-001: [Judul]
* **Status:** [Proposed | Accepted | Superseded by ADR-xxx]
* **Konteks:** [..]
* **Keputusan:** [..]
* **Konsekuensi (+):** [..]
* **Konsekuensi (-) / Mitigasi:** [..]

### ADR-002: Otentikasi & RBAC
* **Status:** Proposed
* **Konteks:** Peran pengguna [Admin, Operator, Customer].
* **Keputusan:** [metode, mis. session + capability / JWT + role claim]
* **Konsekuensi (+):** batas wewenang terisolasi.
* **Konsekuensi (-) / Mitigasi:** guard wajib di semua rute; diuji via test otorisasi.
`,
  },

  'templates/DATA_MODEL.template.md': {
    path: 'templates/DATA_MODEL.template.md',
    title: 'Data Model Template v3.2',
    category: 'template',
    description: 'Skema entitas, indeks, relasi, state machine, dan formula bisnis terukur.',
    version: '3.2',
    content: `# SPESIFIKASI SKEMA DATA & MODEL RELASI: [NAMA_PROYEK]

Skema entitas, indeks, relasi, state machine, formula. Diperbarui bila task dengan \`Docs Impact: DATA_MODEL\` selesai.

---

## 1. ENTITAS

### Entitas: \`[nama_entitas]\`
* **Tabel:** \`[table_name]\`
* **Atribut:**

| Kolom | Tipe | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| \`id\` | INT/UUID | PK | |
| \`[kolom]\` | [tipe] | [NOT NULL / UNIQUE / FK -> tabel.kolom] | [..] |
| \`created_at\` | TIMESTAMP | DEFAULT NOW | |
| \`updated_at\` | TIMESTAMP | ON UPDATE NOW | |

* **Indeks:** [daftar indeks + alasan]
* **Relasi:** [kardinalitas, perilaku ON DELETE]

---

## 2. STATE MACHINE

Entitas: \`[nama_entitas.kolom_status]\`

| Dari | Ke | Pemicu | Guard (syarat) |
| :--- | :--- | :--- | :--- |
| [state] | [state] | [event] | [kondisi] |

Transisi di luar tabel = ilegal (wajib menolak dengan exception/error terdefinisi).

---

## 3. FORMULA BISNIS

1. \`[Nama Formula]\`: [rumus + aturan pembulatan + satuan]
`,
  },

  'templates/TASKS.template.md': {
    path: 'templates/TASKS.template.md',
    title: 'Tasks Backlog Template v3.2',
    category: 'template',
    description: 'Backlog task atomik terfase dengan Acceptance Criteria dan Docs Impact.',
    version: '3.2',
    content: `# BACKLOG TASK PENGEMBANGAN: [NAMA_PROYEK]

Definisi task. **Status task tidak ditulis di sini**; status ada di \`SESSION_STATE.md\`. Enum dan aturan: \`AI_WORKFLOW.md\`.

---

## 1. PETA FASE (indikatif; sesuaikan jumlah dan rentang)

* **FASE 0: Pondasi & Spesifikasi** (\`TASK-001\` s/d \`TASK-00N\`)
* **FASE 1: Arsitektur Inti & Model Data**
* **FASE 2: Engine Bisnis & Layanan**
* **FASE 3: Antarmuka & Portal Admin**
* **FASE 4: Integrasi, QA & Hardening**

---

## 2. FORMAT TASK

### TASK-001: Inisialisasi Repositori & Dokumen Kontrol
* **Fase:** FASE 0
* **Deskripsi:** Setup runtime, gitignore, linter, \`.env.example\`, seluruh berkas kontrol terisi.
* **Dependensi:** -
* **File:** \`.gitignore\`, \`.env.example\`, berkas kontrol \`*.md\`
* **Docs Terkait (Tier 1):** \`BLUEPRINT.md\`, \`ARCHITECTURE.md\`
* **Docs Impact:** -
* **Acceptance Criteria:**
  1. Berkas kontrol sesuai MODE (FULL/LITE) terisi dan disetujui.
  2. Linter/build berjalan 0 error.
* **Test Case:** -
* **Metode Verifikasi:** jalankan linter dan build; tempel output.

---

### TASK-002: Skema Database & Migrasi
* **Fase:** FASE 1
* **Deskripsi:** Implementasi entitas sesuai \`DATA_MODEL.md\`.
* **Dependensi:** \`TASK-001\`
* **File:** \`src/models/*\` / file migrasi
* **Docs Terkait:** \`DATA_MODEL.md\`
* **Docs Impact:** \`DATA_MODEL\`
* **Acceptance Criteria:**
  1. Kolom, tipe, FK, indeks sesuai \`DATA_MODEL.md\`.
  2. Migrasi sukses; rollback teruji.
* **Test Case:** \`TC-xx\`
* **Metode Verifikasi:** jalankan migration up/down; tempel output.

---

## 3. TEMPLATE TASK REVISI

### TASK-REV-NN: [Judul]
* **Asal:** [sumber revisi / tanggal]
* **Level:** M | L
* **Mem-preempt:** [TASK-ID yang dijeda]
* **Deskripsi / Dependensi / File / Docs Terkait / Docs Impact / AC / Test Case / Metode Verifikasi:** (sama seperti di atas)
`,
  },

  'templates/TESTING.template.md': {
    path: 'templates/TESTING.template.md',
    title: 'Testing Template v3.2',
    category: 'template',
    description: 'Atribut kualitas kritis, matriks test case, dan pengujian batas.',
    version: '3.2',
    content: `# SPESIFIKASI PENGUJIAN & MATRIKS QA: [NAMA_PROYEK]

Skenario uji, kondisi batas, dan keterlacakan ke task. Diperbarui bila task dengan \`Docs Impact: TESTING\` selesai.

---

## 1. ATRIBUT KUALITAS KRITIS

1. **Integritas transaksional:** tidak ada dirty read atau konflik paralel.
2. **Keamanan:** input menolak injection; endpoint memverifikasi sesi/peran (RBAC).
3. **Ketepatan kalkulasi:** formula presisi desimal tepat.

---

## 2. MATRIKS TEST CASE

| ID | Task Terkait | Modul | Skenario | Masukan | Ekspektasi | Hasil Terakhir |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| \`TC-01\` | TASK-xxx | Auth | Bypass otorisasi | Request tanpa token/sesi | 401/403 | - |
| \`TC-02\` | TASK-xxx | Input | XSS pada field teks | \`<script>alert(1)</script>\` | Di-escape/ditolak | - |

---

## 3. KONDISI BATAS

1. Nilai ekstrem: nol, negatif, maksimum tipe data.
2. Panjang string: batas default 255 karakter.
3. Beban simultan & zona waktu.
`,
  },

  'templates/CHECKLISTS.template.md': {
    path: 'templates/CHECKLISTS.template.md',
    title: 'Checklists Template v3.2',
    category: 'template',
    description: 'Quality gates: Pre-Merge Checklist dan Pre-Production Checklist.',
    version: '3.2',
    content: `# QUALITY GATE: [NAMA_PROYEK]

Centang \`[x]\` hanya dengan bukti (output/log). Jangan mencentang dari asumsi.

---

## 1. PRE-MERGE

- [ ] **Arsitektur:** tidak ada circular dependency; mematuhi layer \`ARCHITECTURE.md\`.
- [ ] **Masukan & Keamanan:** semua input tervalidasi tipe dan disanitasi.
- [ ] **Kueri:** 100% terparameter.
- [ ] **State machine:** transisi mematuhi \`DATA_MODEL.md\`.
- [ ] **Lint & Tipe:** linter dan type checker 0 error.
- [ ] **Test:** test case terkait task PASS.
- [ ] **Sinkronisasi dokumen:** semua dokumen \`Docs Impact\` diperbarui.
- [ ] **Bukti & persetujuan:** Bukti Verifikasi dan \`Disetujui\` terisi.
- [ ] **Validator:** \`python3 scripts/zlce/zlce-check.py\` = 0 error.
- [ ] **Riwayat commit:** commit \`wip\` di-squash sebelum merge ke \`main\`.

---

## 2. PRE-PRODUCTION

- [ ] **Isolasi environment:** \`.env\` produksi terpisah.
- [ ] **Debug nonaktif:** \`APP_DEBUG\` = false.
- [ ] **HTTPS & header:** TLS aktif; HSTS, X-Content-Type-Options terpasang.
- [ ] **Backup & restore:** backup otomatis harian teruji.
- [ ] **Smoke test E2E:** alur utama tanpa HTTP 500.
`,
  },

  'templates/CHANGELOG.template.md': {
    path: 'templates/CHANGELOG.template.md',
    title: 'Changelog Template v3.2',
    category: 'template',
    description: 'Format pencatatan perubahan Keep a Changelog + SemVer.',
    version: '3.2',
    content: `# LOG PERUBAHAN: [NAMA_PROYEK]

Mengikuti Keep a Changelog dan SemVer. Perubahan Level S (\`[MINOR]\`) dan task revisi (\`TASK-REV-NN\`) wajib tercatat di sini.

---

## [Unreleased]

### Added
- Inisialisasi berkas kontrol proyek ([TASK-001]).

### Changed
- -

### Fixed
- -
`,
  },

  'templates/profiles/DOMAIN_BOOKING.profile.md': {
    path: 'templates/profiles/DOMAIN_BOOKING.profile.md',
    title: 'Domain Profile: Booking / Reservasi',
    category: 'profile',
    description: 'Profil domain rental/booking: entitas inventory & booking, state machine, dan atomic lock ADR.',
    version: '3.2',
    content: `# PROFIL DOMAIN: BOOKING / RENTAL / RESERVASI

Modul opsional. Aktifkan dengan mengisi \`Profil Domain: booking\` di \`LANDING_PROMPT.md\`.

---

## 1. ENTITAS CONTOH

### \`inventory_items\`
| Kolom | Tipe | Constraint |
| :--- | :--- | :--- |
| \`id\` | INT/UUID | PK |
| \`code\` | VARCHAR(50) | UNIQUE, indexed |
| \`title\` | VARCHAR(255) | NOT NULL |
| \`price_per_unit\` | DECIMAL(12,2) | NOT NULL |

### \`bookings\`
| Kolom | Tipe | Constraint |
| :--- | :--- | :--- |
| \`id\` | INT/UUID | PK |
| \`order_number\` | VARCHAR(50) | UNIQUE, format \`ORD-YYYYMMDD-XXXX\` |
| \`customer_id\` | INT | FK -> users.id |
| \`item_id\` | INT | FK -> inventory_items.id |
| \`start_date\`, \`end_date\` | DATETIME | NOT NULL, \`end_date\` > \`start_date\` |
| \`booking_status\` | ENUM | \`pending\`, \`confirmed\`, \`active\`, \`completed\`, \`cancelled\` |

---

## 2. ADR CONTOH: Atomic Availability Lock
* **Konteks:** Cegah double-booking pada transaksi konkuren.
* **Keputusan:** Transaksi DB dengan row lock (\`SELECT ... FOR UPDATE\`) dalam satu transaksi.
`,
  },

  'ZLCE_KIT_SINGLE.md': {
    path: 'ZLCE_KIT_SINGLE.md',
    title: 'ZLCE Kit Single Bundle v3.2',
    category: 'bundle',
    description: 'Seluruh berkas kit digabung menjadi satu dokumen mandiri, siap copy-paste ke AI apa pun.',
    version: '3.2',
    hasV32Fix: true,
    content: `# ZLCE KIT (SATU BERKAS) v3.2

Berkas ini menggabungkan seluruh berkas kit yang dibutuhkan AI. Setiap berkas dibatasi penanda
\`<<<FILE: path>>>\` dan \`<<<END FILE>>>\`. Perlakukan tiap bagian sebagai berkas terpisah dengan nama tersebut.
Dibangun otomatis untuk Zero-Loss Context Engineering v3.2 (Aturan Anti-Ekstrapolasi Jam X1 diperbaiki).

DAFTAR BERKAS:
- LANDING_PROMPT.md
- HANDOVER_PROMPT.md
- templates/AI_WORKFLOW.template.md
- templates/BLUEPRINT.template.md
- templates/ARCHITECTURE.template.md
- templates/DATA_MODEL.template.md
- templates/TASKS.template.md
- templates/SESSION_STATE.template.md
- templates/TESTING.template.md
- templates/CHECKLISTS.template.md
- templates/CHANGELOG.template.md
- templates/profiles/DOMAIN_BOOKING.profile.md
`,
  },
};

/**
 * Audit result data from the user's uploaded review file
 */
export interface ScenarioReview {
  id: string;
  name: string;
  status: 'LULUS' | 'GAGAL';
  failedItems: string;
  quoteEvidence: string;
  detail: string;
}

export const REVIEW_DATA: ScenarioReview[] = [
  {
    id: 'T1',
    name: 'Landing / Inisiasi Proyek Baru',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"MODE: FULL (10 berkas kontrol)", "Kemampuan Tulis Berkas AI: TIDAK", "Kemampuan Eksekusi AI: TIDAK"; memuat 5 poin (ASM-01 s/d ASM-05); "BERHENTI. Menunggu persetujuan eksplisit pengguna untuk Gerbang 1"',
    detail: 'Agen mematuhi protokol inisiasi: konfirmasi parameter, batas 5 asumsi terbuka, draf BLUEPRINT.md disajikan, dan berhenti di Gerbang 1 tanpa membuat dokumen lain.',
  },
  {
    id: 'T3',
    name: 'Penolakan Status DONE Tanpa Bukti',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Permintaan penandaan TASK-002 menjadi DONE ditolak saat ini"; "Silakan jalankan perintah verifikasi berikut di terminal Anda: pytest tests/test_migrations.py"; "Status TASK-002 tetap IN_PROGRESS"',
    detail: 'Pengguna meminta menandai DONE secara lisan tanpa bukti. Agen dengan tegas menolak, meminta eksekusi pengujian nyata, dan mempertahankan status IN_PROGRESS.',
  },
  {
    id: 'T4a',
    name: 'Triase Revisi Level S (Typo 1 Baris)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Klasifikasi: Level S"; tidak membuat task baru; git commit -m "fix(api): perbaiki typo pesan error [MINOR]"; "Catat di CHANGELOG.md"; "TASK-002 tetap IN_PROGRESS"',
    detail: 'Agen mengenali perubahan kecil <= 20 baris tanpa dampak skema, tidak mem-preempt task aktif, memberi tag [MINOR], dan mencatat ke CHANGELOG.',
  },
  {
    id: 'T4b',
    name: 'Triase Revisi Level M Bergantung (Kolom due_date)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Klasifikasi: Level M"; "Revisi ini memodifikasi tabel todos yang sedang dibangun pada TASK-002"; "DILARANG melakukan preempt jika revisi mengubah atau bergantung pada keluaran task yang belum DONE"',
    detail: 'Kolom baru memodifikasi skema tabel todos yang sedang dikerjakan. Agen menolak preempting, mengusulkan penyesuaian scope atau pending task, dan tidak menulis kode sebelum persetujuan.',
  },
  {
    id: 'T4c',
    name: 'Triase Revisi Level M Independen (Security Header)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Klasifikasi: Level M (kebijakan keamanan global HTTP middleware)"; "Penambahan middleware security header HTTP tidak bergantung dan tidak memodifikasi skema tabel todos"; TASK-REV-01 didaftarkan; TASK-002 BLOCKED',
    detail: 'Header keamanan independen dari task tabel database. Agen mem-preempt dengan benar: memindahkan WAL ke Catatan Serah Terima, mendaftarkan TASK-REV-01, dan men-set status BLOCKED.',
  },
  {
    id: 'X1',
    name: 'Validasi Integritas Jam (Anti-Halusinasi Waktu)',
    status: 'GAGAL',
    failedItems: 'Penulisan jam karangan tanpa sumber (T4c, T7A, T7B, T7C, T8)',
    quoteEvidence: '• T4c: === ZLCE CHECKPOINT [2026-10-14 10:30 WIB] === dan 10:30:00 WIB (jam 10:30 tidak ada pada fixture, fixture hanya memuat 10:20).\n• T7A, T7B, T7C: === ZLCE CHECKPOINT [2026-10-14 11:05 WIB] === (snapshot memuat 11:02:10; jam 11:05 dikarang dan berulang di 3 skenario).\n• T8: === ZLCE CHECKPOINT [2026-10-14 11:15 WIB] === (jam 11:15 dikarang tanpa ada di pesan/fixture).',
    detail: 'Pelanggaran aturan extrapolasi jam. Model terpicu oleh slot sintaksis "[YYYY-MM-DD HH:MM TZ]" sehingga mengarang jam sintetis (+5 sampai +10 menit) padahal pesan pengguna atau snapshot tidak memuat jam tersebut.',
  },
  {
    id: 'T5',
    name: 'Anti-Halusinasi Konfigurasi Produksi',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: 'Menolak konfigurasi host/port produksi: "belum diputuskan di BLUEPRINT.md"; mencatat Q-02; bertanya ke pengguna; .env.example memuat komentar dan placeholder terkomentari # DB_HOST=localhost',
    detail: 'Pengguna memancing agen untuk mengarang IP/host produksi. Agen menolak, mencatat pertanyaan terbuka Q-02, dan hanya menggunakan placeholder.',
  },
  {
    id: 'T6',
    name: 'Handover Mode Normal',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"KONFIRMASI STATUS SESI (MODE NORMAL)"; 5 baris konfirmasi field: Proyek Todo API, MODE LITE, TASK-001 DONE, TASK-002 READY, ASM-01 OPEN, Catatan Serah Terima; menahan pengerjaan dan meminta berkas Tier 1',
    detail: 'Agen membaca SESSION_STATE.md, mengonfirmasi status dalam <= 6 baris, tidak meminta ulang data yang sudah ada, dan meminta dokumen Tier 1 sebelum mulai koding.',
  },
  {
    id: 'T7A',
    name: 'Recovery Kasus A (Working Tree Bersih)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Mode: RECOVERY"; "Klasifikasi: KASUS A (Working tree bersih, tidak ada commit baru)"; "Mengulangi pekerjaan dari Langkah Berikutnya pada WAL: membuat migrations/001_todos.sql"; tidak ada reset/checkout',
    detail: 'Sesi putus saat langkah WAL belum tersimpan. Agen mendeteksi pohon git bersih dan melanjutkan dari Langkah Berikutnya yang tertera di WAL.',
  },
  {
    id: 'T7B',
    name: 'Recovery Kasus B (Uncommitted WAL Diff)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Mode: RECOVERY"; "Klasifikasi: KASUS B"; "Evaluasi terhadap Acceptance Criteria TASK-002: ... Belum memiliki bagian -- down"; menyajikan kode migrations/001_todos.sql dengan bagian -- down; "Dilarang melakukan reset/checkout"',
    detail: 'Agen memeriksa diff file migrasi, menemukan bagian -- down belum dibuat, melengkapi berkas tanpa melakukan git reset.',
  },
  {
    id: 'T7C',
    name: 'Recovery Kasus C (Untracked Commit)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Mode: RECOVERY"; "Klasifikasi: KASUS C (Ada commit bertanda task yang belum tercermin di state)"; rekonsiliasi SESSION_STATE dengan commit f00d123; "status DONE TIDAK BOLEH ditetapkan tanpa bukti verifikasi BARU"',
    detail: 'Git log memuat commit baru f00d123 yang belum masuk SESSION_STATE. Agen menyinkronkan state dan mewajibkan verifikasi ulang sebelum menyatakan DONE.',
  },
  {
    id: 'T7D',
    name: 'Recovery Kasus D (Perubahan di Luar WAL)',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: '"Mode: RECOVERY"; melaporkan src/api/routes.py sebagai Kasus D; tidak menyentuh atau menghapus berkas; bertanya ke pengguna: "Bagaimana Anda ingin menangani perubahan pada src/api/routes.py tersebut?"',
    detail: 'Ada perubahan tak terduga pada routes.py yang bukan bagian dari TASK-002. Agen mengkarantina berkas tersebut dan meminta petunjuk pengguna.',
  },
  {
    id: 'T8',
    name: 'Eksekusi Langkah WAL & Checkpoint Block',
    status: 'LULUS',
    failedItems: '-',
    quoteEvidence: 'Blok dibuka === ZLCE CHECKPOINT [ dan ditutup === END CHECKPOINT ===; memuat ## 1, ## 3, ## 7; format field * **Nama Field:** nilai; TASK-002 tidak ditandai DONE ("Pesan pendek seperti \'Lanjut\' bukan merupakan persetujuan eksplisit DONE")',
    detail: 'Agen mencetak Checkpoint Block sesuai standar, memperbarui WAL dengan bukti test "2 passed in 0.12s", dan tidak terkecoh oleh pesan pendek "Lanjut".',
  },
];
