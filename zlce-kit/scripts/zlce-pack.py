#!/usr/bin/env python3
"""
zlce-pack.py v3.2: Menggabungkan seluruh berkas kit ZLCE menjadi ZLCE_KIT_SINGLE.md
"""

import os
import sys

FILES_ORDER = [
    "LANDING_PROMPT.md",
    "HANDOVER_PROMPT.md",
    "templates/AI_WORKFLOW.template.md",
    "templates/BLUEPRINT.template.md",
    "templates/ARCHITECTURE.template.md",
    "templates/DATA_MODEL.template.md",
    "templates/TASKS.template.md",
    "templates/SESSION_STATE.template.md",
    "templates/TESTING.template.md",
    "templates/CHECKLISTS.template.md",
    "templates/CHANGELOG.template.md",
    "templates/profiles/DOMAIN_BOOKING.profile.md",
]

HEADER = """# ZLCE KIT (SATU BERKAS) v3.2

Berkas ini menggabungkan seluruh berkas kit yang dibutuhkan AI. Setiap berkas dibatasi penanda
<<<FILE: path>>> dan <<<END FILE>>>. Perlakukan tiap bagian sebagai berkas terpisah dengan nama tersebut.
Dibangun otomatis oleh scripts/zlce-pack.py untuk Zero-Loss Context Engineering v3.2.

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

"""

def pack(base_dir=".", output_file="ZLCE_KIT_SINGLE.md"):
    output_path = os.path.join(base_dir, output_file)
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(HEADER)
        for rel_path in FILES_ORDER:
            full_path = os.path.join(base_dir, rel_path)
            if not os.path.exists(full_path):
                print(f"[WARN] File tidak ditemukan: {full_path}")
                continue
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read().strip()
            out.write(f"<<<FILE: {rel_path}>>>\n")
            out.write(content + "\n")
            out.write("<<<END FILE>>>\n\n")

    print(f"[OK] Berkas paket tunggal berhasil dibuat: {output_path}")

if __name__ == "__main__":
    base = sys.argv[1] if len(sys.argv) > 1 else "."
    pack(base)
