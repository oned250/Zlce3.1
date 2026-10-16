/**
 * ZLCE Studio v3.2 - Zero-Loss Context Engineering Suite
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ReviewAuditView } from './components/ReviewAuditView';
import { KitExplorer } from './components/KitExplorer';
import { LiveValidator } from './components/LiveValidator';
import { RecoverySimulator } from './components/RecoverySimulator';
import { BundleGenerator } from './components/BundleGenerator';
import { KIT_FILES, ZLCE_VERSION } from './zlce/kitData';
import { ShieldCheck, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'explorer' | 'validator' | 'recovery' | 'bundle'>('audit');
  const [copiedBundle, setCopiedBundle] = useState(false);

  const handleCopyBundle = () => {
    // Generate bundle
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

    let out = `# ZLCE KIT (SATU BERKAS) ${ZLCE_VERSION}\n\n`;
    for (const key of order) {
      const file = KIT_FILES[key];
      if (file) {
        out += `<<<FILE: ${file.path}>>>\n${file.content.trim()}\n<<<END FILE>>>\n\n`;
      }
    }

    navigator.clipboard.writeText(out);
    setCopiedBundle(true);
    setTimeout(() => setCopiedBundle(false), 2200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCopyBundle={handleCopyBundle}
        copiedBundle={copiedBundle}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'audit' && <ReviewAuditView />}
        {activeTab === 'explorer' && <KitExplorer />}
        {activeTab === 'validator' && <LiveValidator />}
        {activeTab === 'recovery' && <RecoverySimulator />}
        {activeTab === 'bundle' && <BundleGenerator />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ZLCE Studio</span>
            <span>•</span>
            <span>Zero-Loss Context Engineering {ZLCE_VERSION}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Fix Aturan X1: Lolos Uji Waktu</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('bundle')}
              className="hover:text-sky-400 transition-colors"
            >
              Ekspor Kit
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('validator')}
              className="hover:text-emerald-400 transition-colors"
            >
              Linter Sesi
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
