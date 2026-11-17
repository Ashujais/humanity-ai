import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Send, 
  ArrowRight, 
  CornerDownRight, 
  Mail, 
  Eye, 
  MessageSquare,
  DollarSign,
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClientView({ 
  emails = [], 
  onUpdateStatus, 
  onOverrideClassification, 
  onSendReply,
  onOpenConversationModal,
  clientName = 'David Sterling'
}) {
  // Filter strictly to emails requiring Client's attention
  const clientEmails = emails.filter(
    e => e.classification.type === 'CLIENT_REPLY' && e.status !== 'handled'
  );

  const [activeModalEmail, setActiveModalEmail] = useState(null);
  const [delegatingEmailId, setDelegatingEmailId] = useState(null);
  const [delegateNote, setDelegateNote] = useState('');
  const [approvingEmailId, setApprovingEmailId] = useState(null);
  const [customReply, setCustomReply] = useState('');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const handleMarkHandled = async (emailId) => {
    triggerConfetti();
    await onUpdateStatus(emailId, { status: 'handled' });
  };

  const handleDelegateToAssistant = async (emailId) => {
    await onUpdateStatus(emailId, {
      status: 'delegated_to_assistant',
      clientNotes: delegateNote || 'Please handle this on my behalf.'
    });
    setDelegatingEmailId(null);
    setDelegateNote('');
  };

  const handleApproveReply = async (email) => {
    const bodyToSend = customReply.trim() || email.draftReply?.body || 'Confirmed. Please proceed as discussed.\n\nBest,\nDavid Sterling';
    await onSendReply(email.id, {
      body: bodyToSend,
      from: { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' },
      to: email.recipients
    });
    triggerConfetti();
    setApprovingEmailId(null);
    setCustomReply('');
  };

  return (
    <div className="min-h-[calc(100vh-4.1rem)] bg-gradient-to-b from-slate-50 via-white to-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Executive Minimalist Greeting Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Client Focused Portal
              </span>
              <span className="text-xs text-slate-400">
                Managed by Sarah Jenkins (Assistant)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Good day, {clientName.split(' ')[0]}.
            </h1>

            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {clientEmails.length === 0
                ? "You have zero pending decisions. All high-stakes communications are handled or managed by Sarah."
                : `You have ${clientEmails.length} item${clientEmails.length > 1 ? 's' : ''} specifically requiring your executive input or authorization.`}
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-50/50 to-transparent pointer-events-none hidden sm:block"></div>
        </div>

        {/* Empty State when Client has Zero Pending Items */}
        {clientEmails.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your queue is completely clear</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Every incoming email has been filtered, categorized, or is actively handled by your executive assistant Sarah. You will only be alerted when an email truly demands your personal decision.
            </p>
          </div>
        ) : (
          /* Cards List: Only Emails Classified as "Client to Reply" */
          <div className="space-y-4">
            {clientEmails.map((email) => {
              const isDelegating = delegatingEmailId === email.id;
              const isApproving = approvingEmailId === email.id;

              return (
                <div
                  key={email.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6 space-y-4 relative"
                >
                  {/* Top Bar: Sender & Date */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={email.sender.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={email.sender.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900">
                            {email.sender.name}
                          </h3>
                          {email.sender.company && (
                            <span className="text-xs font-medium text-slate-500">
                              • {email.sender.company}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {email.sender.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {email.urgency === 'high' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          Urgent
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <h2 className="text-base font-bold text-slate-950 leading-snug">
                      {email.subject}
                    </h2>
                  </div>

                  {/* Short AI Executive Summary */}
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>Executive Summary</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {email.summary}
                    </p>
                  </div>

                  {/* ======================================================== */}
                  {/* CRITICAL: "Why the Client's Response is Needed" Callout */}
                  {/* ======================================================== */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 rounded-xl border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-xs font-bold text-amber-950">
                        Why Your Decision is Needed:
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed pl-6 font-medium">
                      {email.classification.reason}
                    </p>
                  </div>

                  {/* Extracted Key Deadlines or Financial Amounts */}
                  {(email.detectedEntities?.deadlines?.length > 0 || email.detectedEntities?.amountOrFinance) && (
                    <div className="flex items-center space-x-3 text-xs text-slate-600 pt-1">
                      {email.detectedEntities?.deadlines?.length > 0 && (
                        <span className="inline-flex items-center space-x-1 font-semibold text-rose-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Deadline: {email.detectedEntities.deadlines.join(', ')}</span>
                        </span>
                      )}
                      {email.detectedEntities?.amountOrFinance && (
                        <span className="inline-flex items-center space-x-1 font-semibold text-emerald-700">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Amount: {email.detectedEntities.amountOrFinance}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Delegate to Assistant Expandable Form */}
                  {isDelegating && (
                    <div className="bg-purple-50/70 p-4 rounded-xl border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-950 flex items-center space-x-1.5">
                          <UserCheck className="w-4 h-4 text-purple-700" />
                          <span>Hand off to Sarah (Assistant)</span>
                        </span>
                        <button
                          onClick={() => setDelegatingEmailId(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                      <input
                        type="text"
                        value={delegateNote}
                        onChange={(e) => setDelegateNote(e.target.value)}
                        placeholder="Add quick direction (e.g. 'Please decline politely' or 'Reschedule to Friday')"
                        className="w-full p-2.5 text-xs bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-slate-800"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleDelegateToAssistant(email.id)}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Confirm Handoff
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Approve Reply Expandable Form */}
                  {isApproving && (
                    <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>Review & Approve AI Draft Reply</span>
                        </span>
                        <button
                          onClick={() => setApprovingEmailId(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        defaultValue={email.draftReply?.body || 'Hi, confirmed. Please proceed.\n\nBest,\nDavid Sterling'}
                        onChange={(e) => setCustomReply(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 leading-relaxed font-sans"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleApproveReply(email)}
                          className="flex items-center space-x-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Approve & Send Now</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons Toolbar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    
                    {/* Left: View Full Conversation modal */}
                    <button
                      onClick={() => setActiveModalEmail(email)}
                      className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Original Thread</span>
                    </button>

                    {/* Right: The 3 Core Executive Actions */}
                    <div className="flex items-center space-x-2">
                      
                      {/* Action 1: Delegate to Sarah */}
                      <button
                        onClick={() => {
                          setDelegatingEmailId(email.id);
                          setApprovingEmailId(null);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Delegate to Sarah</span>
                      </button>

                      {/* Action 2: Quick Approve AI Reply */}
                      <button
                        onClick={() => {
                          setApprovingEmailId(email.id);
                          setDelegatingEmailId(null);
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Approve Reply</span>
                      </button>

                      {/* Action 3: Mark Handled */}
                      <button
                        onClick={() => handleMarkHandled(email.id)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Handled</span>
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Full Conversation Modal for Client View */}
      {activeModalEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate">{activeModalEmail.subject}</h3>
                <p className="text-xs text-slate-400">Thread #{activeModalEmail.threadId}</p>
              </div>
              <button
                onClick={() => setActiveModalEmail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeModalEmail.messages.map((m, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{m.from.name} &lt;{m.from.email}&gt;</span>
                    <span className="text-slate-400">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                    {m.body}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalEmail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
