import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSessionState } from './validator.ts';

test('validates valid session state with proper enums and single IN_PROGRESS', () => {
  const validDoc = `
# STATUS SESI (SESSION_STATE.md): Todo API
## 0. KONTEKS PROYEK
* **Proyek:** Todo API
## 1. STATUS AKTIF
* **Timestamp Audit:** 2026-10-14 10:20:00 WIB
* **Task Aktif:** TASK-002
* **Status Task Aktif:** IN_PROGRESS
## 2. MATRIKS TASK
| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | DONE | ruff 0 error, pytest pass | ya |
| \`TASK-002\` | Skema database | TASK-001 | IN_PROGRESS | - | - |
## 3. WORK IN PROGRESS (WAL)
* **Langkah Berikutnya (persis):** buat migrations/001_todos.sql
## 4. ASSUMPTIONS & OPEN QUESTIONS
## 5. SLOT REVISI AKTIF
## 6. CATATAN SERAH TERIMA
## 7. LOG AUDIT
* **[2026-10-14 10:20 WIB]:** WAL terisi
`;

  const res = validateSessionState(validDoc, ['10:20']);
  assert.equal(res.isValid, true);
  assert.equal(res.errorCount, 0);
  assert.equal(res.activeTask, 'TASK-002');
  assert.equal(res.activeStatus, 'IN_PROGRESS');
  assert.equal(res.x1Check.passed, true);
});

test('catches Rule X1 timestamp hallucination when hour is synthesized without source', () => {
  const invalidTimeDoc = `
# STATUS SESI (SESSION_STATE.md): Todo API
## 0. KONTEKS PROYEK
## 1. STATUS AKTIF
* **Timestamp Audit:** 2026-10-14 10:30:00 WIB
## 2. MATRIKS TASK
| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | DONE | 1 pass | ya |
## 3. WORK IN PROGRESS (WAL)
* **Langkah Berikutnya (persis):** test
## 4. ASSUMPTIONS & OPEN QUESTIONS
## 5. SLOT REVISI AKTIF
## 6. CATATAN SERAH TERIMA
## 7. LOG AUDIT
* **[2026-10-14 10:30 WIB]:** Checkpoint created
`;

  // Fixture only has 10:20, so 10:30 is a hallucinated synthetic time
  const res = validateSessionState(invalidTimeDoc, ['10:20']);
  assert.equal(res.x1Check.passed, false);
  const x1Issue = res.issues.find(i => i.rule === 'X1_TIMESTAMP_HALLUCINATION');
  assert.ok(x1Issue);
  assert.match(x1Issue.message, /10:30/);
});

test('accepts v3.2 fallback "jam: ?" when clock is absent', () => {
  const fallbackDoc = `
# STATUS SESI (SESSION_STATE.md): Todo API
## 0. KONTEKS PROYEK
## 1. STATUS AKTIF
* **Timestamp Audit:** 2026-10-14 jam: ?
## 2. MATRIKS TASK
| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | DONE | 1 pass | ya |
## 3. WORK IN PROGRESS (WAL)
* **Langkah Berikutnya (persis):** test
## 4. ASSUMPTIONS & OPEN QUESTIONS
## 5. SLOT REVISI AKTIF
## 6. CATATAN SERAH TERIMA
## 7. LOG AUDIT
* **[2026-10-14 jam: ?]:** Checkpoint created
`;

  const res = validateSessionState(fallbackDoc, ['10:20']);
  assert.equal(res.x1Check.passed, true);
  assert.equal(res.x1Check.timestampsFound.some(t => t.status === 'NO_TIME_FALLBACK'), true);
});

test('catches multiple IN_PROGRESS tasks violation', () => {
  const multiProgressDoc = `
# STATUS SESI (SESSION_STATE.md): Todo API
## 0. KONTEKS PROYEK
## 1. STATUS AKTIF
## 2. MATRIKS TASK
| ID Task | Nama | Dependensi | Status | Bukti Verifikasi | Disetujui |
| :--- | :--- | :--- | :--- | :--- | :--- |
| \`TASK-001\` | Inisialisasi repo | - | IN_PROGRESS | - | - |
| \`TASK-002\` | Skema database | TASK-001 | IN_PROGRESS | - | - |
## 3. WORK IN PROGRESS (WAL)
## 4. ASSUMPTIONS & OPEN QUESTIONS
## 5. SLOT REVISI AKTIF
## 6. CATATAN SERAH TERIMA
## 7. LOG AUDIT
`;

  const res = validateSessionState(multiProgressDoc);
  assert.equal(res.isValid, false);
  const singleProgressIssue = res.issues.find(i => i.rule === 'SINGLE_IN_PROGRESS');
  assert.ok(singleProgressIssue);
});
