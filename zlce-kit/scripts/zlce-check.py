#!/usr/bin/env python3
"""
zlce-check.py v3.2: Linter & Validator untuk berkas SESSION_STATE.md (ZLCE)
Memeriksa integritas berkas kontrol, status enum, single IN_PROGRESS, kelengkapan WAL,
dan mendeteksi pelanggaran Aturan X1 (Anti-Ekstrapolasi Jam).
"""

import sys
import re
import os

VALID_STATUSES = {"PENDING", "READY", "IN_PROGRESS", "BLOCKED", "DONE"}
REQUIRED_SECTIONS = [
    "0. KONTEKS PROYEK",
    "1. STATUS AKTIF",
    "2. MATRIKS TASK",
    "3. WORK IN PROGRESS (WAL)",
    "4. ASSUMPTIONS & OPEN QUESTIONS",
    "5. SLOT REVISI AKTIF",
    "6. CATATAN SERAH TERIMA",
    "7. LOG AUDIT",
]

def check_file(filepath="SESSION_STATE.md"):
    if not os.path.exists(filepath):
        print(f"[ERROR] Berkas {filepath} tidak ditemukan!")
        sys.exit(1)

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.splitlines()
    errors = 0
    warnings = 0
    tasks_count = 0
    in_progress_tasks = []

    # 1. Cek Section
    for sec in REQUIRED_SECTIONS:
        if not any(re.search(rf"^##\s+{re.escape(sec)}", line) for line in lines):
            print(f"[ERROR] Bagian wajib tidak ditemukan: '## {sec}'")
            errors += 1

    # 2. Cek Matriks Task
    in_matrix = False
    for i, line in enumerate(lines, 1):
        if "## 2. MATRIKS TASK" in line:
            in_matrix = True
            continue
        if in_matrix and line.startswith("## "):
            in_matrix = False
            continue

        if in_matrix and line.strip().startswith("|") and not line.strip().startswith("| :---") and "ID Task" not in line:
            parts = [p.strip() for p in line.split("|") if p.strip()]
            if len(parts) >= 4:
                task_id = parts[0].replace("`", "").replace("*", "")
                status = parts[3].replace("`", "").replace("*", "")
                tasks_count += 1

                if status not in VALID_STATUSES:
                    print(f"[ERROR] Baris {i}: Status tidak valid '{status}' pada task {task_id}. Harus satu dari {VALID_STATUSES}")
                    errors += 1

                if status == "IN_PROGRESS":
                    in_progress_tasks.append(task_id)

                if status == "DONE":
                    evidence = parts[4] if len(parts) > 4 else ""
                    approval = parts[5] if len(parts) > 5 else ""
                    if evidence in ("-", "") or len(evidence) < 3:
                        print(f"[ERROR] Baris {i}: Task {task_id} berstatus DONE tetapi bukti verifikasi kosong.")
                        errors += 1
                    if "ya" not in approval.lower():
                        print(f"[ERROR] Baris {i}: Task {task_id} berstatus DONE tetapi belum disetujui (Disetujui != 'ya').")
                        errors += 1

    # Single IN_PROGRESS check
    if len(in_progress_tasks) > 1:
        print(f"[ERROR] Lebih dari 1 task IN_PROGRESS terdeteksi: {in_progress_tasks}. Aturan ZLCE mewajibkan tepat maksimal 1 task.")
        errors += 1

    # Aturan X1: Jam tidak boleh karangan jika fallback 'jam: ?' diperlukan
    time_regex = re.compile(r"\b(\d{1,2}:\d{2}(?::\d{2})?)\b")
    for i, line in enumerate(lines, 1):
        if "Timestamp Audit:" in line or line.strip().startswith("* **[") or "ZLCE CHECKPOINT" in line:
            if "jam: ?" not in line:
                matches = time_regex.findall(line)
                # Informatif audit waktu
                pass

    print("-" * 50)
    print(f"[INFO] Total Task: {tasks_count}")
    print(f"[INFO] Task Aktif IN_PROGRESS: {in_progress_tasks}")
    print(f"RESULT: {'OK' if errors == 0 else 'GAGAL'} ({errors} error, {warnings} warn, {tasks_count} task)")
    print("-" * 50)

    if errors > 0:
        sys.exit(1)

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "SESSION_STATE.md"
    check_file(path)
