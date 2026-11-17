import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ConnectAccountModal({ 
  isOpen, 
  onClose, 
  onAccountConnected 
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: Choose provider, 2: Consent / Auth, 3: Syncing, 4: Done
  const [provider, setProvider] = useState('google');
  const [email, setEmail] = useState('david.sterling@apexlabs.ai');
  const [clientName, setClientName] = useState('David Sterling');
  const [clientRole, setClientRole] = useState('CEO & Co-founder, Apex Labs');
  const [syncProgress, setSyncProgress] = useState(25);

  const startAuthorization = () => {
    setStep(2);
  };

  const grantConsent = () => {
    setStep(3);
    // Simulate real-time sync steps
    let p = 25;
    const interval = setInterval(() => {
      p += 25;
      setSyncProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStep(4);
      }
    }, 450);
  };

  const finish = async () => {
    if (onAccountConnected) {
      await onAccountConnected({
        email,
        clientName,
        clientRole,
        provider
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connect Client Email Account</h3>
              <p className="text-[11px] text-slate-500">Secure OAuth2 integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body based on Step */}
        <div className="p-6">
          
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your client's email inbox so Humanity AI can begin triaging incoming messages, identifying who needs to reply, and drafting executive responses.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProvider('google')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                    provider === 'google'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center mb-3">
                    <span className="text-base font-bold text-red-500">G</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Google Workspace</h4>
                    <p className="text-[10px] text-slate-500">Gmail / Google Business</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('microsoft')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition ${
                    provider === 'microsoft'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center mb-3">
                    <span className="text-base font-bold text-blue-500">M</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Microsoft 365</h4>
                    <p className="text-[10px] text-slate-500">Outlook / Exchange</p>
                  </div>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Client Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={startAuthorization}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition"
                >
                  <span>Continue with {provider === 'google' ? 'Google' : 'Microsoft'} OAuth</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto text-xl font-bold">
                  {provider === 'google' ? 'G' : 'M'}
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Authorize Humanity AI Platform
                </h4>
                <p className="text-xs text-slate-500">
                  Connecting to <strong className="text-slate-800">{email}</strong>
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Read email headers, content and metadata for triage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Create and send approved email reply drafts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Synchronize calendar invites and appointment proposals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>SOC2 compliant 256-bit AES encryption at rest</span>
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={grantConsent}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  Allow & Connect
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Synchronizing Inbox & Running AI Triage</h4>
                <p className="text-xs text-slate-500 mt-1">Analyzing conversation threads and assigning responsibility...</p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-bold text-indigo-600">{syncProgress}% Complete</span>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Account Connected Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  {email} is now fully integrated. Initial AI triage completed for all recent conversations.
                </p>
              </div>

              <button
                type="button"
                onClick={finish}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Go to Inbox Dashboard
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
