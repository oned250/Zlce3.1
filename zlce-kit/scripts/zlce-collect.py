#!/usr/bin/env python3
"""
zlce-collect.py v3.2: Mengumpulkan feedback pengujian dan membuat bundel arsip zip
"""

import os
import sys
import zipfile
from datetime import datetime

FEEDBACK_DIR = "zlce-feedback"
TRANSCRIPTS_DIR = os.path.join(FEEDBACK_DIR, "transcripts")

FEEDBACK_TEMPLATE = """# FEEDBACK EVALUASI ZLCE v3.2

Tanggal: {date}
Model AI: (mis. Gemini 3.8 Flash / Claude 3.5 Sonnet / GPT-4o)
Suhu (Temperature): 0.2

## Ringkasan Hasil
- Butir LULUS:
- Butir GAGAL (bila ada):

## Catatan Tambahan
(Tuliskan kendala atau observasi selama pengujian di sini)
"""

def init_feedback():
    os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)
    feedback_file = os.path.join(FEEDBACK_DIR, "FEEDBACK.md")
    if not os.path.exists(feedback_file):
        with open(feedback_file, "w", encoding="utf-8") as f:
            f.write(FEEDBACK_TEMPLATE.format(date=datetime.now().strftime("%Y-%m-%d")))
        print(f"[OK] Folder feedback diinisialisasi: {FEEDBACK_DIR}")

def pack_zip():
    init_feedback()
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    zip_name = f"zlce-report-{timestamp}.zip"

    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(FEEDBACK_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path)
                z.write(full_path, rel_path)

    print(f"[OK] Laporan feedback berhasil diarsipkan ke {zip_name}")

if __name__ == "__main__":
    if "--init" in sys.argv:
        init_feedback()
    else:
        pack_zip()
