# PANDUAN PENGUJIAN KIT ZLCE (KIT_TEST.md)

Panduan pengujian integritas, validasi sintaks, dan benchmark perilaku kit ZLCE.

---

## 1. Unit Testing Otomatis Kit (`test_kit.py`)

Jalankan test suite integritas berkas di terminal:
```bash
python3 -m unittest discover -s tests -v
```

Test suite ini memverifikasi:
- Seluruh template `templates/*.template.md` memiliki nomor bagian yang benar.
- Berkas `ZLCE_KIT_SINGLE.md` tersinkronisasi 100% dengan berkas individu.
- Skrip validasi `scripts/zlce-check.py` berjalan bebas error pada contoh fixture.

---

## 2. Pengujian Mandiri AI Studio (`SELF_TEST_AISTUDIO.md`)

Untuk menguji model AI baru (Gemini, Claude, GPT-4o, dll.):
1. Buka sesi chat baru dengan suhu (temperature) 0.2.
2. Unggah berkas `ZLCE_KIT_SINGLE.md`.
3. Tempel **Prompt 1** dari `SELF_TEST_AISTUDIO.md` dan biarkan model menyelesaikan respons T1 hingga T8.
4. Tempel **Prompt 2** untuk evaluasi kepatuhan ketat.
5. Kit dinyatakan **LULUS** jika seluruh 13 butir (termasuk aturan integritas waktu X1) berstatus **LULUS**.
