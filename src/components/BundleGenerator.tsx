import React, { useState } from 'react';
import { KIT_FILES, ZLCE_VERSION } from '../zlce/kitData';
import { Download, Copy, Check, Sparkles, FileText, CheckCircle2, FolderArchive, Terminal, Github } from 'lucide-react';

export const BundleGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);

  // Generate full single bundle content dynamically
  const generateBundleText = (): string => {
    let out = `# ZLCE KIT (SATU BERKAS) ${ZLCE_VERSION}

Berkas ini menggabungkan seluruh berkas kit yang dibutuhkan AI. Setiap berkas dibatasi penanda
<<<FILE: path>>> dan <<<END FILE>>>. Perlakukan tiap bagian sebagai berkas terpisah dengan nama tersebut.
Dibangun otomatis untuk Zero-Loss Context Engineering ${ZLCE_VERSION} (Aturan Anti-Ekstrapolasi Jam X1 diperbaiki).

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

`;

    const order = [
      'LANDING_PROMPT.md',
      'HANDOVER_PROMPT.md',
      'templates/AI_WORKFLOW.template.md',
      'templates/BLUEPRINT.template.md',
      'templates/ARCHITECTURE.template.md',
      'templates/DATA_MODEL.template.md',
      'templates/TASKS.template.md',
      'templates/SESSION_STATE.template.md',
      'templates/TESTING.template.md',
      'templates/CHECKLISTS.template.md',
      'templates/CHANGELOG.template.md',
      'templates/profiles/DOMAIN_BOOKING.profile.md',
    ];

    for (const key of order) {
      const file = KIT_FILES[key];
      if (file) {
        out += `<<<FILE: ${file.path}>>>\n${file.content.trim()}\n<<<END FILE>>>\n\n`;
      }
    }

    return out;
  };

  const bundleContent = generateBundleText();

  const handleCopy = () => {
    navigator.clipboard.writeText(bundleContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([bundleContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZLCE_KIT_SINGLE_${ZLCE_VERSION}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const gitCommands = `# Ekstrak zip ke folder proyek Anda atau clone repositori baru:
git init
git add .
git commit -m "feat: inisialisasi ZLCE Kit v3.2 dengan fix aturan jam X1"
git branch -M main
git remote add origin https://github.com/USERNAME/zlce-kit.git
git push -u origin main`;

  const handleCopyGitCmd = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2000);
  };

  const linesCount = bundleContent.split('\n').length;
  const approxTokens = Math.round(bundleContent.length / 4);

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-950 text-sky-400 border border-sky-800">
                BUNDLE TUNGGAL & REPO GITHUB {ZLCE_VERSION}
              </span>
              <span className="text-xs text-slate-400">Siap Pakai untuk Repositori GitHub & AI Studio</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ekspor Kit ZLCE v3.2 & Paket GitHub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Unduh bundel zip lengkap dengan struktur direktori resmi (<code className="text-sky-300">templates/</code>, <code className="text-sky-300">scripts/</code>, <code className="text-sky-300">tests/</code>, <code className="text-sky-300">README.md</code>, <code className="text-sky-300">LICENSE</code>) atau berkas tunggal <code className="text-sky-300">ZLCE_KIT_SINGLE.md</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/zlce-kit-v3.2.zip"
              download="zlce-kit-v3.2.zip"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-950/50"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Unduh Repo ZIP (v3.2)</span>
            </a>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-md"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Unduh .md Tunggal</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kit Tunggal'}</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Struktur Repo</div>
            <div className="text-lg font-bold text-slate-100">22 Berkas Lengkap</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Test Suite Python & Node</div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 100% Pass
            </div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Estimasi Token</div>
            <div className="text-lg font-bold text-sky-400">~{approxTokens.toLocaleString()} tokens</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Status Aturan X1</div>
            <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Fixed (v3.2)
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Setup Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-100">Langkah Cepat Membuat Repositori di GitHub</h3>
          </div>
          <button
            onClick={handleCopyGitCmd}
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            {copiedGitCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedGitCmd ? 'Perintah Tersalin' : 'Salin Perintah Git'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-sky-400">1. Unduh Berkas ZIP:</span>
            <p className="text-slate-400">
              Klik tombol hijau <strong className="text-white">"Unduh Repo ZIP (v3.2)"</strong> di atas, lalu ekstrak ke direktori lokal baru di komputer Anda.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-sky-400">2. Buat Repo di GitHub:</span>
            <p className="text-slate-400">
              Buka <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-sky-300 underline">github.com/new</a>, beri nama <code className="text-white">zlce-kit</code> (Public/Private), tanpa centang inisialisasi README.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-sky-400">3. Push ke GitHub:</span>
            <p className="text-slate-400">
              Buka terminal di folder ekstrak tersebut dan jalankan baris perintah git di bawah.
            </p>
          </div>
        </div>

        <div className="mt-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
          <pre>{gitCommands}</pre>
        </div>
      </div>

      {/* Code Preview Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-xs font-bold text-slate-200">ZLCE_KIT_SINGLE.md Preview</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            <Copy className="w-3.5 h-3.5" /> Salin Teks
          </button>
        </div>

        <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed max-h-[450px] overflow-y-auto">
          <pre className="whitespace-pre-wrap">{bundleContent}</pre>
        </div>
      </div>
    </div>
  );
};
