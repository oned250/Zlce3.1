import React, { useState } from 'react';
import { KIT_FILES, KitFile, ZLCE_VERSION } from '../zlce/kitData';
import { FileCode, Copy, Check, Sparkles, Search, Layers, FileText, ArrowRight } from 'lucide-react';

export const KitExplorer: React.FC = () => {
  const fileKeys = Object.keys(KIT_FILES);
  const [selectedKey, setSelectedKey] = useState<string>('templates/AI_WORKFLOW.template.md');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showV32Diff, setShowV32Diff] = useState(false);

  const selectedFile: KitFile = KIT_FILES[selectedKey] || KIT_FILES[fileKeys[0]];

  const filteredKeys = fileKeys.filter((key) => {
    const f = KIT_FILES[key];
    const matchSearch =
      key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berkas kit (AI_WORKFLOW, LANDING, TASKS, dll)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowV32Diff(!showV32Diff)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              showV32Diff
                ? 'bg-amber-950 text-amber-300 border-amber-700 shadow'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{showV32Diff ? 'Tampilkan Berkas Lengkap' : 'Sorot Perubahan v3.2'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File Navigator Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1 max-h-[750px] overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Daftar Berkas Kit ({filteredKeys.length})</span>
            <span className="text-sky-400">v3.2</span>
          </div>

          {filteredKeys.map((key) => {
            const file = KIT_FILES[key];
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500/40 text-slate-100 shadow-sm'
                    : 'bg-slate-950/40 border-transparent hover:border-slate-800 hover:bg-slate-800/40 text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-xs truncate">{file.path}</span>
                    {file.hasV32Fix && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 shrink-0">
                        Fix X1
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{file.title}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* File Content Preview */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400">{selectedFile.path}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  v{selectedFile.version}
                </span>
                {selectedFile.hasV32Fix && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Diperbarui di v3.2
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copied ? 'Tersalin' : 'Salin Isi'}</span>
            </button>
          </div>

          {/* V3.2 Specific Diff Highlight Banner */}
          {selectedFile.hasV32Fix && showV32Diff && (
            <div className="bg-amber-950/30 border-b border-amber-800/60 p-4">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Perbaikan Aturan Jam X1 pada berkas ini ({selectedFile.path}):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-rose-900/40">
                  <div className="text-rose-400 font-semibold mb-1">Versi 3.1 Lama (Memicu Halusinasi):</div>
                  <pre className="font-mono text-[11px] text-slate-400 whitespace-pre-wrap">
                    === ZLCE CHECKPOINT [YYYY-MM-DD HH:MM TZ] ===
                  </pre>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format kaku memicu LLM mengarang jam (+5m, +10m) saat jam tidak tersedia di prompt.
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-emerald-900/40">
                  <div className="text-emerald-400 font-semibold mb-1">Versi 3.2 Baru (Anti-Ekstrapolasi):</div>
                  <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap">
                    === ZLCE CHECKPOINT [YYYY-MM-DD (HH:MM TZ | jam: ?)] ===
                    ATURAN KERAS TIMESTAMP: Jika jam eksplisit tidak ada, WAJIB tulis tanggal saja dan 'jam: ?'.
                  </pre>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Alternatif sintaks eksplisit memberi pilihan legal bagi model saat jam tidak diketahui.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Code Body */}
          <div className="p-4 flex-1 overflow-x-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
