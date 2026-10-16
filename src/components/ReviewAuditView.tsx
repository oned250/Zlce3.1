import React, { useState } from 'react';
import { REVIEW_DATA, ScenarioReview } from '../zlce/kitData';
import { CheckCircle2, XCircle, AlertCircle, Clock, ArrowRight, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const ReviewAuditView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioReview>(
    REVIEW_DATA.find((r) => r.id === 'X1') || REVIEW_DATA[0]
  );
  const [showX1DeepDive, setShowX1DeepDive] = useState(true);

  const filteredData = REVIEW_DATA.filter((item) => {
    if (filter === 'pass') return item.status === 'LULUS';
    if (filter === 'fail') return item.status === 'GAGAL';
    return true;
  });

  const passCount = REVIEW_DATA.filter((r) => r.status === 'LULUS').length;
  const failCount = REVIEW_DATA.filter((r) => r.status === 'GAGAL').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                STATUS PENGUJIAN KIT v3.1: 12 LULUS / 1 GAGAL
              </span>
              <span className="text-xs text-slate-400">Model: Gemini 3.8 Flash • AI Studio Harness</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Laporan Evaluasi Pengujian ZLCE Kit
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Harness uji mandiri ZLCE 7 skenario (T1–T8, total 13 butir) telah dijalankan. Seluruh logika domain, penolakan DONE tanpa bukti, triase interrupt Level S/M, dan recovery Kasus A–D <strong className="text-emerald-400">LULUS 100%</strong>. Hanya <strong className="text-rose-400">X1 (Halusinasi Jam)</strong> yang gagal dan telah kita selesaikan di <strong className="text-sky-400">v3.2</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 text-center">
              <div className="text-2xl font-bold text-emerald-400">{passCount}</div>
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Lulus (92.3%)</div>
            </div>
            <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-rose-900/50 text-center">
              <div className="text-2xl font-bold text-rose-400">{failCount}</div>
              <div className="text-[11px] text-rose-300 font-medium uppercase tracking-wider">Gagal (X1)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Section on Rule X1 */}
      <div className="border border-amber-900/50 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Akar Masalah Kegagalan Butir X1 & Resolusi di v3.2
                <span className="text-xs bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-800">
                  CRITICAL DEFECT
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Mengapa model mengarang jam 10:30, 11:05, dan 11:15 pada T4c, T7A-C, dan T8?
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowX1DeepDive(!showX1DeepDive)}
            className="text-xs text-amber-400 hover:text-amber-300 underline"
          >
            {showX1DeepDive ? 'Sembunyikan' : 'Buka Detail'}
          </button>
        </div>

        {showX1DeepDive && (
          <div className="space-y-4 pt-2 text-sm text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Failure Analysis */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-rose-900/30">
                <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2">
                  <XCircle className="w-4 h-4" /> Penyebab (Prompt Trap di v3.1)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Di v3.1, instruksi melarang mengarang jam, namun template <code className="text-sky-300">AI_WORKFLOW</code> dan <code className="text-sky-300">SESSION_STATE</code> secara eksplisit menuliskan placeholder:
                </p>
                <div className="bg-slate-900 p-2.5 rounded font-mono text-xs text-rose-300 border border-slate-800 mb-2">
                  === ZLCE CHECKPOINT [YYYY-MM-DD HH:MM TZ] ===<br />
                  * **Timestamp Audit:** [YYYY-MM-DD HH:MM:SS TZ]
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Adanya slot <code>HH:MM</code> memicu autocompletion LLM untuk melakukan extrapolasi waktu sintetis (seperti <code>10:30</code> pada T4c, <code>11:05</code> pada T7, dan <code>11:15</code> pada T8) demi memenuhi format sintaksis header.
                </p>
              </div>

              {/* Solution in v3.2 */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-900/30">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Solusi Paten di v3.2 (Sudah Diterapkan)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Kita memperbarui 4 berkas kit dengan sintaks fallback alternatif dan aturan tegas:
                </p>
                <div className="bg-slate-900 p-2.5 rounded font-mono text-xs text-emerald-300 border border-slate-800 mb-2">
                  === ZLCE CHECKPOINT [YYYY-MM-DD (HH:MM TZ | jam: ?)] ===<br />
                  ATURAN KERAS TIMESTAMP: Jika jam eksplisit tidak ada, WAJIB tulis tanggal saja dan 'jam: ?' (contoh: [2026-10-14 jam: ?]). DILARANG mengarang jam (+5 atau +10 menit).
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Placeholder kini secara gramatikal memperbolehkan <code className="text-emerald-300">jam: ?</code>, menghilangkan dorongan autoregresif model untuk memalsukan jam!
                </p>
              </div>
            </div>

            {/* Exact Evidence Comparison */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Bukti Verbatim Kejadian di Pengujian v3.1
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-amber-400">Kasus T4c:</span>
                  <div className="mt-1 font-mono text-slate-300 text-[11px]">
                    Fixture: <span className="text-sky-300">10:20:00 WIB</span><br />
                    Agen menulis: <span className="text-rose-400">10:30 WIB</span> (halusinasi +10m)
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-amber-400">Kasus T7A, T7B, T7C:</span>
                  <div className="mt-1 font-mono text-slate-300 text-[11px]">
                    Snapshot: <span className="text-sky-300">11:02:10+07:00</span><br />
                    Agen menulis: <span className="text-rose-400">11:05 WIB</span> (halusinasi +3m)
                  </div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-amber-400">Kasus T8:</span>
                  <div className="mt-1 font-mono text-slate-300 text-[11px]">
                    Pesan user: <span className="text-sky-300">tanpa jam</span><br />
                    Agen menulis: <span className="text-rose-400">11:15 WIB</span> (karangan tanpa sumber)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-100 text-base">Matriks Evaluasi Kepatuhan Uji Harness (13 Butir)</h2>
            <p className="text-xs text-slate-400">Klik baris untuk melihat kutipan bukti verbatim dan analisis mendalam</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                filter === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({REVIEW_DATA.length})
            </button>
            <button
              onClick={() => setFilter('pass')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                filter === 'pass' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lulus ({passCount})
            </button>
            <button
              onClick={() => setFilter('fail')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                filter === 'fail' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gagal ({failCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Table List */}
          <div className="lg:col-span-7 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Skenario Uji</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold">Catatan Kepatuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredData.map((item) => {
                  const isSelected = selectedScenario.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedScenario(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-500/10 hover:bg-sky-500/15'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.status === 'LULUS' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                            <CheckCircle2 className="w-3 h-3" /> LULUS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-950/80 text-rose-400 border border-rose-800/60">
                            <XCircle className="w-3 h-3" /> GAGAL
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400 truncate max-w-xs">
                        {item.status === 'LULUS' ? 'Semua butir terpenuhi' : item.failedItems}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-5 p-5 bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-sky-400">{selectedScenario.id}</span>
                <span className="font-semibold text-slate-200 text-sm">{selectedScenario.name}</span>
              </div>
              <div>
                {selectedScenario.status === 'LULUS' ? (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
                    LULUS
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-950 text-rose-400 border border-rose-800">
                    GAGAL (Perlu Fix)
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Kutipan Bukti Verbatim
              </h4>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selectedScenario.quoteEvidence}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Ulasan & Penjelasan Protokol
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
                {selectedScenario.detail}
              </p>
            </div>

            {selectedScenario.id === 'X1' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Status di v3.2:</strong> Seluruh aturan timestamp telah diselaraskan. Buka tab <span className="font-semibold text-white">Jelajah Kit</span> atau <span className="font-semibold text-white">Live Validator</span> untuk melihat validasi otomatis format jam tanpa halusinasi.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
