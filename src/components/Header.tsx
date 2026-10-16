import React from 'react';
import { ShieldCheck, AlertTriangle, FileCode2, PlayCircle, Download, Copy, Sparkles, Check } from 'lucide-react';
import { ZLCE_VERSION } from '../zlce/kitData';

interface HeaderProps {
  activeTab: 'audit' | 'explorer' | 'validator' | 'recovery' | 'bundle';
  setActiveTab: (tab: 'audit' | 'explorer' | 'validator' | 'recovery' | 'bundle') => void;
  onCopyBundle: () => void;
  copiedBundle: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onCopyBundle, copiedBundle }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">ZLCE Studio</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-950 text-sky-400 border border-sky-800/80">
                  {ZLCE_VERSION}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60">
                  <Sparkles className="w-3 h-3" /> Fix Aturan X1
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Zero-Loss Context Engineering • Kit Evaluasi & Validator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyBundle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm ${
                copiedBundle
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title="Salin seluruh kit ZLCE_KIT_SINGLE.md ke clipboard"
            >
              {copiedBundle ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copiedBundle ? 'Tersalin!' : 'Salin Kit Tunggal'}</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-800/60 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Audit Review (12/13 Lulus)</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'explorer'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileCode2 className="w-4 h-4 text-sky-400" />
            <span>Jelajah Kit v3.2</span>
          </button>

          <button
            onClick={() => setActiveTab('validator')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'validator'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Live Validator (zlce-check)</span>
          </button>

          <button
            onClick={() => setActiveTab('recovery')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'recovery'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-indigo-400" />
            <span>Simulator Recovery (Kasus A-D)</span>
          </button>

          <button
            onClick={() => setActiveTab('bundle')}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'bundle'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-purple-400" />
            <span>Unduh & Ekspor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
