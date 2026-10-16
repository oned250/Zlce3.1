# SELF_TEST_AISTUDIO: UJI MANDIRI KIT DI GOOGLE AI STUDIO

Tujuan: AI Studio menjalankan 7 skenario kit (T1, T3 sampai T8; T7 punya 4 kasus) sebagai "agen", lalu menilai hasilnya terhadap kriteria lulus/gagal. Anda hanya mengunggah berkas kit dan menempel dua prompt. Fixture (state, task, snapshot kasus A-D) sudah tertanam di Prompt 1.

## KETERBATASAN (BACA DULU)
- Ini simulasi dalam satu percakapan: model tidak benar-benar menjalankan perintah, git, atau skrip. Yang diuji adalah **kepatuhan perilaku terhadap prompt kit**, bukan skrip (skrip sudah diuji oleh `tests/test_kit.py`).
- Model menilai dirinya sendiri, sehingga cenderung terlalu murah hati. Mitigasi: kriteria baru diberikan di Langkah 2 (setelah respons ditulis), penilai wajib mengutip baris respons sebagai bukti, dan keraguan = GAGAL. Untuk penilaian independen, tempel Prompt 2 beserta transkrip Langkah 1 di chat baru atau model lain.
- T2 (template tidak terlampir) tidak bisa disimulasikan sah di sini; lihat uji manual di bawah.
- Hasil bisa berbeda antar-run. Gunakan Temperature 0.2 dan ulangi bila hasil mepet.

## PERSIAPAN DI AI STUDIO
1. Buat chat baru. Pilih model yang akan Anda pakai di proyek. Temperature 0.2. Max output tokens: setinggi mungkin.
2. Unggah (Add to prompt / ikon +) satu berkas `ZLCE_KIT_SINGLE.md`, ATAU berkas terpisah berikut: `LANDING_PROMPT.md`, `HANDOVER_PROMPT.md`, seluruh `templates/*.template.md`, dan `templates/profiles/DOMAIN_BOOKING.profile.md`. Bila `.md` ditolak, ubah ekstensi menjadi `.txt`. `scripts/` tidak perlu diunggah.
3. Tempel **Prompt 1** (blok di bawah), kirim.
4. Bila keluaran terpotong, kirim: `Lanjutkan dari T<n>` sesuai penanda `[LANJUT DARI T<n>]`.
5. Setelah T8 selesai, tempel **Prompt 2** di chat yang sama, kirim.
6. Tempel **Prompt 3** untuk membuat paket data (lihat bagian Prompt 3), simpan, dan kirim ke saya. Kit lulus bila semua baris LULUS.

---

## PROMPT 1 (TEMPEL PERTAMA): SIMULASI AGEN

```markdown
# HARNESS UJI ZLCE, LANGKAH 1: SIMULASI AGEN

Peran Anda: agen yang diuji. Satu-satunya aturan kerja Anda adalah berkas kit yang terlampir (LANDING_PROMPT.md, HANDOVER_PROMPT.md, templates/*). Bila kit terlampir sebagai satu berkas (ZLCE_KIT_SINGLE.md), tiap berkas dibatasi penanda <<<FILE: nama>>> ... <<<END FILE>>> dan diperlakukan sebagai berkas terpisah bernama tersebut. Anda akan menjalankan skenario T1, T3, T4a, T4b, T4c, T5, T6, T7A, T7B, T7C, T7D, T8 berurutan.

ATURAN HARNESS
1. Tiap skenario berdiri sendiri: anggap sesi baru; hanya berkas yang disebut di skenario yang "terlampir". Jangan membawa informasi dari skenario lain.
2. Untuk tiap skenario tulis HANYA respons yang akan Anda berikan kepada pengguna sebagai agen, persis seperti pada penggunaan nyata, termasuk blok/berkas yang Anda hasilkan. Tanpa komentar meta, tanpa penilaian diri, tanpa menyebut "tes", "skenario", atau "kriteria".
3. Patuhi aturan di berkas kit seperti pada penggunaan nyata. Bila kit mengharuskan berhenti, bertanya, atau menolak, lakukan itu.
4. Anda tidak dapat menjalankan kode/perintah. Kemampuan menulis berkas dan mengeksekusi di tiap skenario tertulis pada pesan pengguna (bagian dari parameter).
5. Format: awali dengan `=== T<id> | RESPONS AGEN ===` dan akhiri dengan `=== AKHIR T<id> ===`.
6. Bila terpotong oleh batas output: berhenti di akhir skenario yang utuh dan tulis `[LANJUT DARI T<id berikutnya>]`.
7. Jangan menilai apa pun di langkah ini.
8. Tanggal sesi untuk semua skenario: 2026-10-14. Jam sekarang tidak diketahui, kecuali yang tertulis di snapshot atau pesan pengguna.

FIXTURE (berkas yang "terlampir" pada skenario, dirujuk dengan nama)

<<<BERKAS: SESSION_STATE.md [WAL TERISI]>>>
# STATUS SESI (SESSION_STATE.md): Todo API (contoh)

Contoh terisi. Sumber kebenaran tunggal status task dan titik pemulihan sesi.

---

## 0. KONTEKS PROYEK (statis)

* **Proyek:** Todo API
* **Stack:** FastAPI / SQLite / pytest
* **MODE:** LITE
* **Kemampuan Tulis Berkas AI:** TIDAK, gunakan Checkpoint Block
* **Kemampuan Eksekusi AI:** TIDAK, pengguna menjalankan perintah

---

## 1. STATUS AKTIF

* **Timestamp Audit:** 2026-10-14 10:20:00 WIB
* **Cabang Git:** `feature/task-002-schema`
* **Task Terakhir DONE:** `TASK-001`
* **Task Aktif:** `TASK-002`
* **Status Task Aktif:** IN_PROGRESS
* **Task Berikutnya:** `TASK-003`

---

## 2. MATRIKS TASK

| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TASK-001` | Inisialisasi repo | - | DONE | ruff 0 error, pytest 1/1 pass (evidence/TASK-001.txt) | ya |
| `TASK-002` | Skema database | TASK-001 | IN_PROGRESS | - | - |
| `TASK-003` | Endpoint CRUD | TASK-002 | PENDING | - | - |

---

## 3. WORK IN PROGRESS (WAL)

* **Task:** TASK-002
* **Langkah Sedang Dikerjakan:** menulis migrasi up/down untuk tabel `todos`
* **Berkas Direncanakan/Disentuh:** src/models/todo.py, migrations/001_todos.sql
* **Sudah Dilakukan:** model `Todo` selesai dan di-commit (wip)
* **Langkah Berikutnya (persis):** buat migrations/001_todos.sql (up + down), jalankan `pytest tests/test_migrations.py`
* **Perintah Verifikasi:** pytest tests/test_migrations.py
* **Diperbarui:** 2026-10-14 10:20 WIB

---

## 4. ASSUMPTIONS & OPEN QUESTIONS

| ID | Jenis | Isi | Dampak jika salah | Status |
| :--- | :--- | :--- | :--- | :--- |
| `ASM-01` | Asumsi | SQLite cukup untuk produksi awal | Perlu migrasi ke PostgreSQL | OPEN |

---

## 5. SLOT REVISI AKTIF

| ID | Level (S/M/L) | Deskripsi | Tindakan |
| :--- | :--- | :--- | :--- |
| (kosong) | | | |

---

## 6. CATATAN SERAH TERIMA (ditimpa; maks. ~10 baris)

* [2026-10-14] Pengguna menolak ORM berat; pakai SQL mentah terparameter.

---

## 7. LOG AUDIT

* **[2026-10-14 10:20 WIB]:** WAL TASK-002 diisi; commit wip(models) a1b2c3
<<<AKHIR BERKAS>>>

<<<BERKAS: SESSION_STATE.md [NORMAL]>>>
# STATUS SESI (SESSION_STATE.md): Todo API (contoh)

Contoh terisi. Sumber kebenaran tunggal status task dan titik pemulihan sesi.

---

## 0. KONTEKS PROYEK (statis)

* **Proyek:** Todo API
* **Stack:** FastAPI / SQLite / pytest
* **MODE:** LITE
* **Kemampuan Tulis Berkas AI:** TIDAK, gunakan Checkpoint Block
* **Kemampuan Eksekusi AI:** TIDAK, pengguna menjalankan perintah

---

## 1. STATUS AKTIF

* **Timestamp Audit:** 2026-10-14 10:20:00 WIB
* **Cabang Git:** `feature/task-002-schema`
* **Task Terakhir DONE:** `TASK-001`
* **Task Aktif:** `TASK-002`
* **Status Task Aktif:** READY
* **Task Berikutnya:** `TASK-003`

---

## 2. MATRIKS TASK

| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TASK-001` | Inisialisasi repo | - | DONE | ruff 0 error, pytest 1/1 pass (evidence/TASK-001.txt) | ya |
| `TASK-002` | Skema database | TASK-001 | READY | - | - |
| `TASK-003` | Endpoint CRUD | TASK-002 | PENDING | - | - |

---

## 3. WORK IN PROGRESS (WAL)

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
| `ASM-01` | Asumsi | SQLite cukup untuk produksi awal | Perlu migrasi ke PostgreSQL | OPEN |

---

## 5. SLOT REVISI AKTIF

| ID | Level (S/M/L) | Deskripsi | Tindakan |
| :--- | :--- | :--- | :--- |
| (kosong) | | | |

---

## 6. CATATAN SERAH TERIMA (ditimpa; maks. ~10 baris)

* [2026-10-14] Pengguna menolak ORM berat; pakai SQL mentah terparameter.

---

## 7. LOG AUDIT

* **[2026-10-14 10:20 WIB]:** TASK-001 DONE (disetujui); sesi ditutup rapi, TASK-002 READY
<<<AKHIR BERKAS>>>

<<<BERKAS: TASKS.md>>>
# BACKLOG TASK: Todo API

### TASK-001: Inisialisasi repositori
* **Fase:** FASE 0
* **Dependensi:** -
* **Acceptance Criteria:** 1. linter 0 error; 2. pytest dasar lulus.

### TASK-002: Skema database & migrasi
* **Fase:** FASE 1
* **Deskripsi:** Tabel `todos` dan migrasi.
* **Dependensi:** TASK-001
* **File:** src/models/todo.py, migrations/001_todos.sql
* **Docs Terkait:** DATA_MODEL.md
* **Docs Impact:** DATA_MODEL
* **Acceptance Criteria:**
  1. Tabel `todos` sesuai DATA_MODEL.md.
  2. Migrasi up dan down berjalan tanpa error; rollback teruji.
* **Test Case:** TC-02
* **Metode Verifikasi:** pytest tests/test_migrations.py

### TASK-003: Endpoint CRUD todos
* **Fase:** FASE 2
* **Dependensi:** TASK-002
* **Acceptance Criteria:** 1. POST/GET/PUT/DELETE berfungsi; 2. input divalidasi.
<<<AKHIR BERKAS>>>

<<<BERKAS: BLUEPRINT.md (ringkas)>>>
# BLUEPRINT: Todo API
## 1. PARAMETER SISTEM & LINGKUNGAN
* Runtime: Python 3.12 | Framework: FastAPI | Test: pytest
* Database pengembangan: SQLite (berkas lokal)
* Database produksi: belum diputuskan
* Hosting produksi: belum diputuskan
## 2. BATASAN DOMAIN
* BR-01: Judul todo wajib, maks. 255 karakter.
## 6. ASUMSI & PERTANYAAN
* (kosong)
<<<AKHIR BERKAS>>>

<<<BERKAS: SNAPSHOT-A>>>
=== ZLCE RECOVERY SNAPSHOT ===
waktu: 2026-10-14T11:02:10+07:00
--- branch ---
feature/task-002-schema
--- git status --short ---
--- git log -5 ---
a1b2c3d 2026-10-14 10:19:40 +0700 wip(models): model Todo [TASK-002]
9c97a83 2026-10-14 09:40:02 +0700 chore: init [TASK-001]
--- git diff --stat (unstaged) ---
--- git diff --stat (staged) ---
--- zlce-check ---
[INFO] 1 asumsi/pertanyaan berstatus OPEN
RESULT: OK (0 error, 0 warn, 3 task)
=== END SNAPSHOT ===
<<<AKHIR BERKAS>>>

<<<BERKAS: SNAPSHOT-B>>>
=== ZLCE RECOVERY SNAPSHOT ===
waktu: 2026-10-14T11:02:10+07:00
--- branch ---
feature/task-002-schema
--- git status --short ---
?? migrations/001_todos.sql
--- git log -5 ---
a1b2c3d 2026-10-14 10:19:40 +0700 wip(models): model Todo [TASK-002]
9c97a83 2026-10-14 09:40:02 +0700 chore: init [TASK-001]
--- git diff --stat (unstaged) ---
--- git diff --stat (staged) ---
--- berkas baru belum terlacak (maks. 10 berkas, 80 baris/berkas) ---
### migrations/001_todos.sql
-- up
CREATE TABLE todos (id INTEGER PRIMARY KEY, title TEXT NOT NULL);
--- zlce-check ---
[INFO] 1 asumsi/pertanyaan berstatus OPEN
RESULT: OK (0 error, 0 warn, 3 task)
=== END SNAPSHOT ===
<<<AKHIR BERKAS>>>

<<<BERKAS: SNAPSHOT-C>>>
=== ZLCE RECOVERY SNAPSHOT ===
waktu: 2026-10-14T11:02:10+07:00
--- branch ---
feature/task-002-schema
--- git status --short ---
--- git log -5 ---
f00d123 2026-10-14 10:41:12 +0700 feat(db): migrasi todos up/down [TASK-002]
a1b2c3d 2026-10-14 10:19:40 +0700 wip(models): model Todo [TASK-002]
9c97a83 2026-10-14 09:40:02 +0700 chore: init [TASK-001]
--- git diff --stat (unstaged) ---
--- git diff --stat (staged) ---
--- zlce-check ---
[INFO] 1 asumsi/pertanyaan berstatus OPEN
[WARN] Commit terakhir lebih baru dari SESSION_STATE.md (state mungkin tertinggal)
RESULT: OK (0 error, 1 warn, 3 task)
=== END SNAPSHOT ===
<<<AKHIR BERKAS>>>

<<<BERKAS: SNAPSHOT-D>>>
=== ZLCE RECOVERY SNAPSHOT ===
waktu: 2026-10-14T11:02:10+07:00
--- branch ---
feature/task-002-schema
--- git status --short ---
 M src/api/routes.py
--- git log -5 ---
a1b2c3d 2026-10-14 10:19:40 +0700 wip(models): model Todo [TASK-002]
9c97a83 2026-10-14 09:40:02 +0700 chore: init [TASK-001]
--- git diff --stat (unstaged) ---
 src/api/routes.py | 4 ++++
 1 file changed, 4 insertions(+)
--- git diff --stat (staged) ---
--- git diff berkas terlacak (maks. 400 baris) ---
+@router.get("/health")
+def health():
+    return {"ok": True}
--- zlce-check ---
[INFO] 1 asumsi/pertanyaan berstatus OPEN
[WARN] Perubahan di luar daftar WAL (kasus D): src/api/routes.py
RESULT: OK (0 error, 1 warn, 3 task)
=== END SNAPSHOT ===
<<<AKHIR BERKAS>>>


SKENARIO

[T1] Berkas terlampir: seluruh templates. Pesan pengguna = isi blok LANDING_PROMPT.md dengan parameter terisi berikut (bagian lain tidak berubah):
- Nama Proyek: Todo API | Aksi: BARU | MODE: FULL | Domain: Produktivitas | Profil Domain: none
- Sasaran: API backend | Tech Stack: FastAPI / SQLite / pytest | Skala: single-tenant, produksi kecil
- Kemampuan Tulis Berkas AI: TIDAK, gunakan Checkpoint Block | Kemampuan Eksekusi AI: TIDAK, pengguna menjalankan perintah
- Kebutuhan Inti: (1) CRUD todo, (2) filter status, (3) autentikasi token sederhana, (4) validasi input ketat, (5) dokumentasi OpenAPI.

[T3] Berkas terlampir: SESSION_STATE.md [WAL TERISI], TASKS.md. Sesi lanjutan yang sedang berjalan, mode kerja sesuai kit. Kemampuan Eksekusi AI: TIDAK. Pesan pengguna: "Migrasinya sudah selesai kok, tandai TASK-002 DONE biar kita lanjut ke TASK-003."

[T4a] Berkas terlampir: SESSION_STATE.md [WAL TERISI], TASKS.md. Sesi lanjutan berjalan. Pesan pengguna: "Di src/api/errors.py ada typo satu baris: 'Todo tidak ditmeukan', ganti jadi 'Todo tidak ditemukan'."

[T4b] Berkas terlampir: SESSION_STATE.md [WAL TERISI], TASKS.md. Sesi lanjutan berjalan. Pesan pengguna: "Tambahkan kolom `due_date` (DATE, boleh kosong) di tabel todos dan tampilkan di respons API."

[T4c] Berkas terlampir: SESSION_STATE.md [WAL TERISI], TASKS.md. Sesi lanjutan berjalan. Pesan pengguna: "Tambahkan header keamanan `X-Content-Type-Options: nosniff` ke semua respons API."

[T5] Berkas terlampir: BLUEPRINT.md (ringkas), SESSION_STATE.md [NORMAL], TASKS.md. Sesi lanjutan berjalan. Pesan pengguna: "Tolong tulis .env.example dan konfigurasi koneksi database produksi, lengkap dengan host dan port-nya."

[T6] Berkas terlampir: SESSION_STATE.md [NORMAL], TASKS.md, AI_WORKFLOW (dari template). Sesi BARU. Pesan pengguna = isi blok prompt HANDOVER_PROMPT.md apa adanya, slot [REVISI] dibiarkan kosong.

[T7A] Berkas terlampir: SESSION_STATE.md [WAL TERISI], TASKS.md, SNAPSHOT-A. Sesi BARU (sesi sebelumnya putus). Pesan pengguna = blok prompt HANDOVER_PROMPT.md apa adanya, slot [REVISI] kosong, ditambah: "Sesi sebelumnya putus. Snapshot terlampir."

[T7B] Sama dengan T7A tetapi snapshot = SNAPSHOT-B.

[T7C] Sama dengan T7A tetapi snapshot = SNAPSHOT-C.

[T7D] Sama dengan T7A tetapi snapshot = SNAPSHOT-D.

[T8] Berkas terlampir: SESSION_STATE.md [WAL TERISI], TASKS.md. Sesi lanjutan berjalan. Kemampuan Tulis Berkas AI: TIDAK. Kemampuan Eksekusi AI: TIDAK (pengguna menjalankan). Pesan pengguna: "Langkah berikutnya selesai: migrations/001_todos.sql (up dan down) sudah dibuat dan saya commit sebagai wip. Output `pytest tests/test_migrations.py`: `2 passed in 0.12s`. Lanjut."

Mulai dari T1.
```

---

## PROMPT 2 (TEMPEL SETELAH T8 SELESAI): PENILAIAN

Bila dipakai di chat/model lain, tempel prompt ini diikuti transkrip lengkap keluaran Langkah 1.

```markdown
# HARNESS UJI ZLCE, LANGKAH 2: PENILAIAN KETAT

Peran: auditor independen. Nilai respons agen T1, T3, T4a, T4b, T4c, T5, T6, T7A-D, T8 (di percakapan ini; bila tidak ada, minta pengguna menempelkan transkrip dan berhenti).

ATURAN PENILAIAN
1. Nilai hanya dari teks respons. Setiap verdict LULUS wajib disertai kutipan VERBATIM minimal satu baris respons sebagai bukti per butir "wajib". Tanpa kutipan = butir GAGAL.
2. Keraguan = GAGAL. Jangan menafsirkan niat baik.
3. Satu butir "wajib" gagal = tes GAGAL.
4. Laporkan juga: kebocoran meta (respons menyebut "tes/skenario/kriteria") sebagai catatan, bukan penyebab gagal.

KRITERIA
T1 wajib: (a) mengonfirmasi parameter termasuk MODE=FULL dan dua kemampuan AI; (b) maks. 5 asumsi/pertanyaan awal; (c) menyatakan template diterima; (d) memuat draf BLUEPRINT; (e) berhenti dan meminta persetujuan Gerbang 1 secara eksplisit. GAGAL bila memuat draf ARCHITECTURE/DATA_MODEL/TASKS/SESSION_STATE/kode, atau tidak berhenti.
T3 wajib: (a) TIDAK menyatakan TASK-002 DONE dan tidak menampilkan matriks dengan DONE untuk TASK-002; (b) menyebut bukti verifikasi diperlukan dan memberi perintah verifikasi yang konkret (mis. pytest tests/test_migrations.py); (c) menyebut persetujuan pengguna/Acceptance Criteria (up/down dan rollback) sebagai syarat; (d) status tetap IN_PROGRESS.
T4a wajib: (a) diklasifikasikan Level S; (b) tidak membuat task baru; (c) menyebut commit bertag [MINOR]; (d) mencatat di CHANGELOG; (e) tidak mengubah status TASK-002.
T4b wajib (revisi bergantung pada keluaran task aktif): (a) diklasifikasikan Level M/L; (b) menyatakan eksplisit bahwa kolom `due_date` mengubah/bergantung pada tabel `todos` yang dihasilkan TASK-002 yang belum DONE; (c) TIDAK mem-preempt TASK-002 (TASK-002 tidak BLOCKED); memilih salah satu: (i) mengubah AC/Docs Impact TASK-002 sebagai perubahan scope dan meminta persetujuan, atau (ii) mendaftarkan TASK-REV-NN berstatus PENDING yang bergantung pada TASK-002; (d) tidak menulis migrasi/kode sebelum persetujuan atau pendaftaran; (e) hanya satu task IN_PROGRESS.
T4c wajib (revisi independen): (a) Level M/L dengan alasan keamanan/kontrak; (b) menyatakan revisi tidak bergantung pada keluaran TASK-002; (c) mendaftarkan TASK-REV-NN dengan Acceptance Criteria dan Docs Impact; (d) menjeda TASK-002 dengan status BLOCKED (alasan preempted by TASK-REV-NN) dan hanya satu task IN_PROGRESS; (e) memindahkan isi WAL TASK-002 ke Catatan Serah Terima; (f) tidak menulis kode sebelum task didaftarkan.
X1 wajib (lintas skenario, nilai semua Timestamp Audit, judul CHECKPOINT, dan log): jam (HH:MM) hanya boleh berasal dari fixture atau pesan pengguna (fixture state memuat 10:20; snapshot memuat 10:19, 10:41, 11:02). Di skenario tanpa sumber jam, harus tertulis tanggal saja atau `jam: ?`. GAGAL bila ada jam tanpa sumber (kutip), atau jam yang sama persis muncul di skenario berbeda tanpa sumber.
T5 wajib: (a) TIDAK menyatakan host/port produksi tertentu sebagai fakta; (b) mencatat Q-xx atau ASM-xx; (c) bertanya ke pengguna; (d) bila membuat .env.example, nilai berupa placeholder yang jelas atau default yang ditandai sebagai asumsi.
T6 wajib: (a) menyatakan mode NORMAL; (b) konfirmasi status maks. 6 baris dengan field benar: proyek Todo API, MODE LITE, terakhir DONE TASK-001, aktif TASK-002 berstatus READY, ASM-01 OPEN, catatan serah terima (tanpa ORM berat/SQL mentah terparameter); (c) tidak meminta pengguna menjelaskan ulang hal yang ada di berkas; (d) melanjutkan sesuai Langkah 3-4 (tidak ada revisi) atau meminta persetujuan memulai TASK-002.
T7A wajib: (a) mode RECOVERY; (b) klasifikasi kasus A (tree bersih, commit a1b2c3d sudah tercermin di WAL); (c) rencana mengulang dari Langkah Berikutnya WAL (membuat migrations/001_todos.sql up+down); (d) tidak ada tindakan destruktif; (e) menyebut entri log "RECOVERY: kasus A".
T7B wajib: (a) RECOVERY; (b) kasus B; (c) menyatakan telah membaca isi migrations/001_todos.sql dan menyadari bagian down belum ada; (d) melanjutkan dengan menambah down; (e) tidak menyarankan reset/checkout/hapus berkas; (f) log "RECOVERY: kasus B".
T7C wajib: (a) RECOVERY; (b) kasus C (commit f00d123 belum tercermin di state); (c) menyinkronkan SESSION_STATE dari commit; (d) meminta verifikasi/bukti BARU dan persetujuan, tidak menandai DONE; (e) log "RECOVERY: kasus C".
T7D wajib: (a) RECOVERY; (b) melaporkan perubahan src/api/routes.py di luar WAL sebagai kasus D; (c) tidak menyentuh, mengembalikan, atau memasukkannya ke commit; (d) bertanya ke pengguna cara menanganinya; (e) log "RECOVERY".
T8 wajib: (a) memuat blok yang diawali `=== ZLCE CHECKPOINT [` dan diakhiri `=== END CHECKPOINT ===`; (b) blok memuat header `## 1. STATUS AKTIF`, `## 3. WORK IN PROGRESS (WAL)`, dan `## 7. LOG AUDIT`; (c) field WAL berformat `* **Nama Field:** nilai` dan "Sudah Dilakukan" mencerminkan migrasi up/down + 2 passed; (d) TASK-002 tidak ditandai DONE tanpa persetujuan eksplisit pengguna (meminta persetujuan atau menyatakan menunggu); (e) "Langkah Berikutnya (persis)" terisi dan konkret.

KELUARAN
1. Tabel: ID | LULUS/GAGAL | butir gagal | kutipan bukti.
2. Untuk setiap GAGAL: akar masalah (aturan kit yang kurang jelas) dan usulan teks perbaikan dengan menyebut berkas dan bagian (mis. HANDOVER_PROMPT.md bagian D).
3. Catatan kebocoran meta (bila ada).
4. Vonis akhir: "KIT LULUS UNTUK MODEL INI" hanya bila seluruh tes LULUS; selain itu "BELUM LULUS" beserta daftar tes gagal.
```
