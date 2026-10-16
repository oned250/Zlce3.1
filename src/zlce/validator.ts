/**
 * ZLCE Validator Engine (zlce-check)
 * Validates SESSION_STATE.md and Checkpoint Blocks against ZLCE rules,
 * with special enforcement of Rule X1 (Timestamp Hallucination Prevention).
 */

export interface ValidationIssue {
  severity: 'ERROR' | 'WARN' | 'INFO';
  rule: string;
  message: string;
  line?: number;
  snippet?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorCount: number;
  warnCount: number;
  infoCount: number;
  taskCount: number;
  activeTask?: string;
  activeStatus?: string;
  issues: ValidationIssue[];
  x1Check: {
    passed: boolean;
    timestampsFound: { text: string; location: string; status: 'VALID' | 'SYNTHETIC_HALLUCINATED' | 'NO_TIME_FALLBACK' }[];
  };
}

export const VALID_STATUS_ENUMS = ['PENDING', 'READY', 'IN_PROGRESS', 'BLOCKED', 'DONE'] as const;
export type StatusEnum = typeof VALID_STATUS_ENUMS[number];

export function validateSessionState(
  content: string,
  referenceTimes: string[] = ['10:20', '10:20:00', '10:19:40', '10:41:12', '11:02:10']
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const lines = content.split('\n');

  // Check required sections
  const requiredSections = [
    { num: '0', title: 'KONTEKS PROYEK' },
    { num: '1', title: 'STATUS AKTIF' },
    { num: '2', title: 'MATRIKS TASK' },
    { num: '3', title: 'WORK IN PROGRESS (WAL)' },
    { num: '4', title: 'ASSUMPTIONS & OPEN QUESTIONS' },
    { num: '5', title: 'SLOT REVISI AKTIF' },
    { num: '6', title: 'CATATAN SERAH TERIMA' },
    { num: '7', title: 'LOG AUDIT' },
  ];

  for (const sec of requiredSections) {
    const hasSec = lines.some((line) => line.includes(`## ${sec.num}. ${sec.title}`) || line.includes(`## ${sec.num}.`));
    if (!hasSec) {
      issues.push({
        severity: 'ERROR',
        rule: 'SECTION_STRUCTURE',
        message: `Bagian wajib missing: "## ${sec.num}. ${sec.title}"`,
      });
    }
  }

  // Parse Matrix Tasks
  let taskCount = 0;
  let inProgressTasks: string[] = [];
  let inMatrixSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('## 2. MATRIKS TASK')) {
      inMatrixSection = true;
      continue;
    }
    if (inMatrixSection && line.startsWith('## ')) {
      inMatrixSection = false;
      continue;
    }

    if (inMatrixSection && line.trim().startsWith('|') && !line.includes(':---') && !line.includes('ID Task')) {
      const parts = line.split('|').map((p) => p.trim()).filter((p) => p.length > 0);
      if (parts.length >= 4) {
        const taskId = parts[0].replace(/[`*]/g, '');
        const status = parts[3].replace(/[`*]/g, '').trim();
        taskCount++;

        if (!VALID_STATUS_ENUMS.includes(status as StatusEnum)) {
          issues.push({
            severity: 'ERROR',
            rule: 'STATUS_ENUM',
            message: `Status tidak valid "${status}" pada task ${taskId}. Harus satu dari: ${VALID_STATUS_ENUMS.join(', ')}`,
            line: i + 1,
            snippet: line,
          });
        }

        if (status === 'IN_PROGRESS') {
          inProgressTasks.push(taskId);
        }

        if (status === 'DONE') {
          const evidence = parts[4] || '';
          const approved = parts[5] || '';
          if (evidence === '-' || evidence === '' || evidence.length < 3) {
            issues.push({
              severity: 'ERROR',
              rule: 'DONE_WITHOUT_EVIDENCE',
              message: `Task ${taskId} berstatus DONE tetapi bukti verifikasi kosong/kurang`,
              line: i + 1,
            });
          }
          if (!approved.toLowerCase().includes('ya')) {
            issues.push({
              severity: 'ERROR',
              rule: 'DONE_WITHOUT_APPROVAL',
              message: `Task ${taskId} berstatus DONE tetapi kolom Disetujui bukan "ya"`,
              line: i + 1,
            });
          }
        }
      }
    }
  }

  // Check single IN_PROGRESS rule
  if (inProgressTasks.length > 1) {
    issues.push({
      severity: 'ERROR',
      rule: 'SINGLE_IN_PROGRESS',
      message: `Lebih dari satu task IN_PROGRESS terdeteksi: ${inProgressTasks.join(', ')}. Aturan ZLCE mewajibkan tepat maksimal 1 task aktif.`,
    });
  }

  // Check active task in Section 1
  let activeTask: string | undefined;
  let activeStatus: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Status Task Aktif:')) {
      const match = line.match(/Status Task Aktif:\*{0,2}\s*[`*]*([A-Z_]+)[`*]*/i);
      if (match) activeStatus = match[1];
    } else if (line.includes('Task Aktif:')) {
      const match = line.match(/Task Aktif:\*{0,2}\s*[`*]*([A-Z0-9_-]+)[`*]*/i);
      if (match) activeTask = match[1];
    }
  }

  // WAL consistency
  const hasWalSection = lines.some((l) => l.includes('## 3. WORK IN PROGRESS (WAL)'));
  if (hasWalSection && activeStatus === 'IN_PROGRESS') {
    const hasNextStep = lines.some((l) => l.includes('Langkah Berikutnya') && !l.includes('Langkah Berikutnya: -') && !l.includes('Langkah Berikutnya (persis): -'));
    if (!hasNextStep) {
      issues.push({
        severity: 'WARN',
        rule: 'WAL_INCOMPLETE',
        message: 'Task aktif sedang IN_PROGRESS namun Langkah Berikutnya pada WAL belum terisi spesifik.',
      });
    }
  }

  // Check Rule X1: Timestamp Hallucination Checker
  const timestampsFound: { text: string; location: string; status: 'VALID' | 'SYNTHETIC_HALLUCINATED' | 'NO_TIME_FALLBACK' }[] = [];
  let x1Passed = true;

  // Regex patterns for time
  const timeRegex = /\b(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:WIB|WITA|WIT|UTC|GMT|[+-]\d{2}:\d{2})?\b/gi;
  const noTimeFallbackRegex = /jam:\s*\?/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check header checkpoints e.g. === ZLCE CHECKPOINT [2026-10-14 10:30 WIB] ===
    if (line.includes('ZLCE CHECKPOINT')) {
      const timeMatches = line.match(timeRegex);
      if (line.match(noTimeFallbackRegex)) {
        timestampsFound.push({
          text: line.trim(),
          location: `Baris ${i + 1} (Checkpoint Header)`,
          status: 'NO_TIME_FALLBACK',
        });
      } else if (timeMatches) {
        for (const t of timeMatches) {
          const rawHour = t.split(' ')[0];
          const isKnown = referenceTimes.some((ref) => rawHour.startsWith(ref) || ref.startsWith(rawHour));
          if (!isKnown) {
            x1Passed = false;
            timestampsFound.push({
              text: t,
              location: `Baris ${i + 1} (Checkpoint Header)`,
              status: 'SYNTHETIC_HALLUCINATED',
            });
            issues.push({
              severity: 'ERROR',
              rule: 'X1_TIMESTAMP_HALLUCINATION',
              message: `[ATURAN X1] Jam sintetis "${t}" terdeteksi di Checkpoint Header tanpa ada di sumber fixture/snapshot. Gunakan jam eksis atau "[YYYY-MM-DD jam: ?]".`,
              line: i + 1,
              snippet: line,
            });
          } else {
            timestampsFound.push({
              text: t,
              location: `Baris ${i + 1} (Checkpoint Header)`,
              status: 'VALID',
            });
          }
        }
      }
    }

    // Check Timestamp Audit line
    if (line.includes('Timestamp Audit:')) {
      const timeMatches = line.match(timeRegex);
      if (line.match(noTimeFallbackRegex)) {
        timestampsFound.push({
          text: line.trim(),
          location: `Baris ${i + 1} (Timestamp Audit)`,
          status: 'NO_TIME_FALLBACK',
        });
      } else if (timeMatches) {
        for (const t of timeMatches) {
          const rawHour = t.split(' ')[0];
          const isKnown = referenceTimes.some((ref) => rawHour.startsWith(ref) || ref.startsWith(rawHour));
          if (!isKnown) {
            x1Passed = false;
            timestampsFound.push({
              text: t,
              location: `Baris ${i + 1} (Timestamp Audit)`,
              status: 'SYNTHETIC_HALLUCINATED',
            });
            issues.push({
              severity: 'ERROR',
              rule: 'X1_TIMESTAMP_HALLUCINATION',
              message: `[ATURAN X1] Jam sintetis "${t}" terdeteksi di Timestamp Audit tanpa ada di sumber data. Gunakan format "YYYY-MM-DD jam: ?".`,
              line: i + 1,
              snippet: line,
            });
          } else {
            timestampsFound.push({
              text: t,
              location: `Baris ${i + 1} (Timestamp Audit)`,
              status: 'VALID',
            });
          }
        }
      }
    }

    // Check Log Audit lines
    if (line.trim().startsWith('* **[') || line.trim().startsWith('- **[')) {
      const timeMatches = line.match(timeRegex);
      if (line.match(noTimeFallbackRegex)) {
        timestampsFound.push({
          text: line.trim(),
          location: `Baris ${i + 1} (Log Audit)`,
          status: 'NO_TIME_FALLBACK',
        });
      } else if (timeMatches) {
        for (const t of timeMatches) {
          const rawHour = t.split(' ')[0];
          const isKnown = referenceTimes.some((ref) => rawHour.startsWith(ref) || ref.startsWith(rawHour));
          if (!isKnown) {
            x1Passed = false;
            timestampsFound.push({
              text: t,
              location: `Baris ${i + 1} (Log Audit)`,
              status: 'SYNTHETIC_HALLUCINATED',
            });
            issues.push({
              severity: 'ERROR',
              rule: 'X1_TIMESTAMP_HALLUCINATION',
              message: `[ATURAN X1] Entri log memuat jam sintetis "${t}" yang tidak bersumber dari pesan atau snapshot git.`,
              line: i + 1,
              snippet: line,
            });
          } else {
            timestampsFound.push({
              text: t,
              location: `Baris ${i + 1} (Log Audit)`,
              status: 'VALID',
            });
          }
        }
      }
    }
  }

  const errorCount = issues.filter((i) => i.severity === 'ERROR').length;
  const warnCount = issues.filter((i) => i.severity === 'WARN').length;
  const infoCount = issues.filter((i) => i.severity === 'INFO').length;

  return {
    isValid: errorCount === 0,
    errorCount,
    warnCount,
    infoCount,
    taskCount,
    activeTask,
    activeStatus,
    issues,
    x1Check: {
      passed: x1Passed,
      timestampsFound,
    },
  };
}
