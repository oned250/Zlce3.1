import React, { useState } from 'react';
import { validateSessionState, ValidationResult } from '../zlce/validator';
import { CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw, ShieldCheck, Clock, FileText } from 'lucide-react';

const PRESETS = {
  v32_valid: {
    name: 'Preset: Lulus Sempurna v3.2 (Fallback jam: ?)',
    description: 'Format v3.2 valid saat jam tidak tersedia di prompt',
    content: `# STATUS SESI (SESSION_STATE.md): Todo API (contoh v3.2)

Contoh terisi sesuai ZLCE v3.2. Sumber kebenaran tunggal status task dan titik pemulihan sesi.

---

## 0. KONTEKS PROYEK (statis)

* **Proyek:** Todo API
* **Stack:** FastAPI / SQLite / pytest
* **MODE:** LITE
* **Kemampuan Tulis Berkas AI:** TIDAK, gunakan Checkpoint Block
* **Kemampuan Eksekusi AI:** TIDAK, pengguna menjalankan perintah

---

## 1. STATUS AKTIF

* **Timestamp Audit:** 2026-10-14 jam: ?
* **Cabang Git:** \`feature/task-002-schema\`
* **Task Terakhir DONE:** \`TASK-001\`
* **Task Aktif:** \`TASK-002\`
* **Status Task Aktif:** IN_PROGRESS
* **Task Berikutnya:** \`TASK-003\`

---

## 2. MATRIKS TASK

| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | DONE | ruff 0 error, pytest 1/1 pass (evidence/TASK-001.txt) | ya |
| \`TASK-002\` | Skema database | TASK-001 | IN_PROGRESS | - | - |
| \`TASK-003\` | Endpoint CRUD | TASK-002 | PENDING | - | - |

---

## 3. WORK IN PROGRESS (WAL)

* **Task:** TASK-002
* **Langkah Sedang Dikerjakan:** menulis migrasi up/down untuk tabel \`todos\`
* **Berkas Direncanakan/Disentuh:** src/models/todo.py, migrations/001_todos.sql
* **Sudah Dilakukan:** model \`Todo\` selesai dan di-commit (wip)
* **Langkah Berikutnya (persis):** buat migrations/001_todos.sql (up + down), jalankan pytest tests/test_migrations.py
* **Perintah Verifikasi:** pytest tests/test_migrations.py
* **Diperbarui:** 2026-10-14 jam: ?

---

## 4. ASSUMPTIONS & OPEN QUESTIONS

| ID | Jenis | Isi | Dampak jika salah | Status |
| :--- | :--- | :--- | :--- | :--- |
| \`ASM-01\` | Asumsi | SQLite cukup untuk produksi awal | Perlu migrasi ke PostgreSQL | OPEN |

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

* **[2026-10-14 jam: ?]:** WAL TASK-002 diisi; langkah berikutnya migrasi
`,
  },

  x1_failed: {
    name: 'Preset: Kegagalan X1 v3.1 (Jam Karangan 10:30 & 11:15)',
    description: 'Menirukan respons agen yang mengarang jam tanpa sumber (T4c & T8)',
    content: `# STATUS SESI (SESSION_STATE.md): Todo API (gagal X1)

=== ZLCE CHECKPOINT [2026-10-14 10:30 WIB] ===

## 0. KONTEKS PROYEK (statis)

* **Proyek:** Todo API
* **Stack:** FastAPI / SQLite / pytest
* **MODE:** LITE

## 1. STATUS AKTIF

* **Timestamp Audit:** 2026-10-14 10:30:00 WIB
* **Cabang Git:** \`feature/task-002-schema\`
* **Task Terakhir DONE:** \`TASK-001\`
* **Task Aktif:** \`TASK-002\`
* **Status Task Aktif:** IN_PROGRESS
* **Task Berikutnya:** \`TASK-003\`

## 2. MATRIKS TASK

| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | DONE | ruff 0 error | ya |
| \`TASK-002\` | Skema database | TASK-001 | IN_PROGRESS | - | - |

## 3. WORK IN PROGRESS (WAL)

* **Task:** TASK-002
* **Langkah Berikutnya (persis):** buat migrations/001_todos.sql

## 4. ASSUMPTIONS & OPEN QUESTIONS

## 5. SLOT REVISI AKTIF

## 6. CATATAN SERAH TERIMA

## 7. LOG AUDIT

* **[2026-10-14 11:15 WIB]:** Checkpoint block dibuat dengan jam karangan

=== END CHECKPOINT ===
`,
  },

  fixture_normal: {
    name: 'Preset: Fixture Asli (Jam 10:20 Eksis)',
    description: 'Fixture resmi dengan waktu 10:20:00 WIB yang sah',
    content: `# STATUS SESI (SESSION_STATE.md): Todo API (contoh)

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
* **Cabang Git:** \`feature/task-002-schema\`
* **Task Terakhir DONE:** \`TASK-001\`
* **Task Aktif:** \`TASK-002\`
* **Status Task Aktif:** READY
* **Task Berikutnya:** \`TASK-003\`

---

## 2. MATRIKS TASK

| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | DONE | ruff 0 error, pytest 1/1 pass (evidence/TASK-001.txt) | ya |
| \`TASK-002\` | Skema database | TASK-001 | READY | - | - |
| \`TASK-003\` | Endpoint CRUD | TASK-002 | PENDING | - | - |

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
| \`ASM-01\` | Asumsi | SQLite cukup untuk produksi awal | Perlu migrasi ke PostgreSQL | OPEN |

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
`,
  },
};

export const LiveValidator: React.FC = () => {
  const [content, setContent] = useState<string>(PRESETS.v32_valid.content);
  const [referenceTimesStr, setReferenceTimesStr] = useState<string>('10:20, 10:20:00, 11:02:10');

  const referenceTimes = referenceTimesStr.split(',').map((s) => s.trim()).filter(Boolean);
  const result: ValidationResult = validateSessionState(content, referenceTimes);

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-100">Live Validator ZLCE & Pemeriksa Aturan X1</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Mesin linter otomatis untuk memeriksa kepatuhan dokumen <code className="text-sky-300">SESSION_STATE.md</code> terhadap enum status, aturan single IN_PROGRESS, kelengkapan WAL, dan mendeteksi extrapolasi jam sintetis.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setContent(preset.content)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all hover:text-white"
              title={preset.description}
            >
              {key === 'v32_valid' ? '⭐ ' : ''}{preset.name.split(':')[1]?.trim() || preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Status Validasi</div>
            <div className={`text-xl font-bold mt-0.5 ${result.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.isValid ? 'VALID (PASS)' : 'INVALID (FAIL)'}
            </div>
          </div>
          {result.isValid ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400/80" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-400/80" />
          )}
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Aturan X1 Jam</div>
            <div className={`text-xl font-bold mt-0.5 ${result.x1Check.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.x1Check.passed ? 'LOLOS (X1)' : 'GAGAL (X1)'}
            </div>
          </div>
          <Clock className={`w-8 h-8 ${result.x1Check.passed ? 'text-emerald-400/80' : 'text-rose-400/80'}`} />
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Error / Peringatan</div>
            <div className="text-xl font-bold mt-0.5 text-slate-100">
              <span className="text-rose-400">{result.errorCount}</span> / <span className="text-amber-400">{result.warnCount}</span>
            </div>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-400/80" />
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Task Aktif</div>
            <div className="text-base font-bold mt-0.5 text-sky-400 truncate max-w-[130px]">
              {result.activeTask ? `${result.activeTask} (${result.activeStatus})` : '-'}
            </div>
          </div>
          <FileText className="w-8 h-8 text-sky-400/80" />
        </div>
      </div>

      {/* Main Workbench: Editor & Issue Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Editor Area */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Konten SESSION_STATE.md / Checkpoint Block
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {content.split('\n').length} baris
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed resize-y"
            placeholder="Tempel teks markdown SESSION_STATE.md di sini..."
          />

          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Jam Sumber Sah:</span>
              <input
                type="text"
                value={referenceTimesStr}
                onChange={(e) => setReferenceTimesStr(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs px-2.5 py-1 rounded text-slate-300 font-mono w-52"
                title="Daftar jam yang sah dari fixture atau snapshot, pisahkan koma"
              />
            </div>
            <button
              onClick={() => setContent(PRESETS.v32_valid.content)}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 self-end sm:self-auto"
            >
              <RefreshCw className="w-3 h-3" /> Reset ke Default v3.2
            </button>
          </div>
        </div>

        {/* Validation Results & Rule X1 Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {/* Timestamp Inspector Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Inspeksi Timestamp & Aturan X1
            </h3>

            {result.x1Check.timestampsFound.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Tidak ada string timestamp yang terdeteksi.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {result.x1Check.timestampsFound.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                      t.status === 'SYNTHETIC_HALLUCINATED'
                        ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                        : t.status === 'NO_TIME_FALLBACK'
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-semibold truncate max-w-[200px]">{t.text}</div>
                      <div className="text-[10px] text-slate-400">{t.location}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        t.status === 'SYNTHETIC_HALLUCINATED'
                          ? 'bg-rose-900 text-rose-200'
                          : t.status === 'NO_TIME_FALLBACK'
                          ? 'bg-emerald-900 text-emerald-200'
                          : 'bg-sky-950 text-sky-300'
                      }`}
                    >
                      {t.status === 'SYNTHETIC_HALLUCINATED'
                        ? 'Karangan (X1 Gagal)'
                        : t.status === 'NO_TIME_FALLBACK'
                        ? 'Fallback jam: ?'
                        : 'Sah dari Sumber'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issue Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Daftar Temuan Linter ({result.issues.length})</span>
              <span className="text-[11px] font-normal text-slate-400">0 Error = Lulus</span>
            </h3>

            {result.issues.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dokumen lulus seluruh aturan ZLCE v3.2 tanpa error atau peringatan!</span>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {result.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      issue.severity === 'ERROR'
                        ? 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                        : issue.severity === 'WARN'
                        ? 'bg-amber-950/30 border-amber-900/60 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="flex items-center gap-1.5">
                        {issue.severity === 'ERROR' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        {issue.severity === 'WARN' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {issue.severity === 'INFO' && <Info className="w-3.5 h-3.5 text-sky-400" />}
                        <span>[{issue.rule}]</span>
                      </span>
                      {issue.line && <span className="text-[10px] text-slate-400 font-mono">Baris {issue.line}</span>}
                    </div>
                    <p className="text-[11px]">{issue.message}</p>
                    {issue.snippet && (
                      <div className="mt-1.5 p-1.5 rounded bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 overflow-x-auto">
                        {issue.snippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
