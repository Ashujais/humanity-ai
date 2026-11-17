import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  Bot, 
  User, 
  Coffee, 
  AlertCircle, 
  Check, 
  Sparkles, 
  Send,
  RefreshCw
} from 'lucide-react';

const PRESETS = [
  {
    title: 'Series B Term Sheet Review',
    roleTarget: 'Client to Reply',
    badge: 'bg-amber-100 text-amber-800',
    subject: 'Action Required: Series B Lead Investor Term Sheet & Cap Table Validation',
    senderName: 'Hemant Taneja',
    senderEmail: 'htaneja@generalcatalyst.com',
    senderCompany: 'General Catalyst',
    body: `Hi David,\n\nFollowing our partners meeting, General Catalyst is excited to deliver our formal Series B Term Sheet for Apex Labs ($45M round at $220M pre-money).\n\nWe require your personal sign-off on the liquidation preference structure and the unallocated stock option pool before 5 PM PST tomorrow so we can begin formal drafting.\n\nPlease review the attached term sheet and let me know your thoughts.\n\nBest,\nHemant`
  },
  {
    title: 'Reschedule Calendar Invite',
    roleTarget: 'Assistant to Reply',
    badge: 'bg-indigo-100 text-indigo-800',
    subject: 'Reschedule: Product Design Review with Figma Team',
    senderName: 'Dylan Field',
    senderEmail: 'dylan@figma.com',
    senderCompany: 'Figma',
    body: `Hi Sarah, David,\n\nI have an unexpected conflict tomorrow afternoon at 3:00 PM. Could we move our 45-minute design review to either Thursday morning at 10:00 AM or Friday at 2:00 PM?\n\nSarah, please feel free to send an updated calendar invite for whatever time slot works best on David's schedule.\n\nThanks,\nDylan`
  },
  {
    title: 'SaaS Receipt (Auto-Paid)',
    roleTarget: 'No Reply Needed',
    badge: 'bg-slate-100 text-slate-700',
    subject: 'Receipt for Your Monthly Datadog Subscription (#INV-9021)',
    senderName: 'Datadog Billing',
    senderEmail: 'no-reply@datadog.com',
    senderCompany: 'Datadog',
    body: `Thank you for your business. Your credit card ending in 4109 was charged $890.00 on October 14, 2026 for your monthly Datadog APM & Log Management plan.\n\nNo further action is required on your part. You can view or download your invoice in your account settings.\n\nDatadog Finance`
  },
  {
    title: 'Mixed Enterprise SLA & Pricing',
    roleTarget: 'Needs Review',
    badge: 'bg-rose-100 text-rose-800',
    subject: 'Enterprise Agreement: Custom SLA terms & Security Audit Packet',
    senderName: 'Samantha Wu',
    senderEmail: 'swu@palantir.com',
    senderCompany: 'Palantir Technologies',
    body: `Hi David,\n\nOur legal and engineering teams are eager to finalize the Apex Labs agent pilot. However, our procurement team is requesting a 20% discount on the enterprise tier, plus we need your security lead to fill out our attached 80-question vendor compliance form.\n\nLet us know who we should coordinate with for each item.\n\nBest,\nSamantha`
  }
];

export default function SimulateEmailModal({ 
  isOpen, 
  onClose, 
  onSimulate, 
  currentAccountId = 'acc_1' 
}) {
  if (!isOpen) return null;

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [subject, setSubject] = useState(PRESETS[0].subject);
  const [senderName, setSenderName] = useState(PRESETS[0].senderName);
  const [senderEmail, setSenderEmail] = useState(PRESETS[0].senderEmail);
  const [senderCompany, setSenderCompany] = useState(PRESETS[0].senderCompany);
  const [body, setBody] = useState(PRESETS[0].body);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);

  const handleSelectPreset = (idx) => {
    setSelectedPreset(idx);
    const p = PRESETS[idx];
    setSubject(p.subject);
    setSenderName(p.senderName);
    setSenderEmail(p.senderEmail);
    setSenderCompany(p.senderCompany);
    setBody(p.body);
    setClassificationResult(null);
  };

  const handleRunSimulation = async () => {
    setIsAnalyzing(true);
    try {
      const result = await onSimulate({
        accountId: currentAccountId,
        subject,
        senderName,
        senderEmail,
        senderCompany,
        body
      });
      setClassificationResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Simulate Live Incoming Email</h2>
              <p className="text-xs text-slate-500">Test real-time AI reply responsibility classification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select a Test Scenario Preset:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-2.5 rounded-xl text-left border transition text-xs ${
                    selectedPreset === idx
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{preset.title}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${preset.badge}`}>
                    Expected: {preset.roleTarget}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Sender Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Company / Org
              </label>
              <input
                type="text"
                value={senderCompany}
                onChange={(e) => setSenderCompany(e.target.value)}
                className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Email Body
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 leading-relaxed font-sans"
            />
          </div>

          {/* Real-time Classification Result Card */}
          {classificationResult && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-950">
                    Live AI Classification Result:
                  </span>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-indigo-900 border border-indigo-300">
                  {classificationResult.classification.type.replace('_', ' ')} ({Math.round(classificationResult.classification.confidence * 100)}% Confidence)
                </span>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">
                <strong>Reason:</strong> {classificationResult.classification.reason}
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Added to inbox and triage queues automatically!</span>
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Powered by Humanity AI Triage Engine
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isAnalyzing}
              className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Receive & Classify Live</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
