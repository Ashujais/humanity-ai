import React, { useState } from 'react';
import { 
  Star, 
  Archive, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Coffee, 
  AlertCircle, 
  Paperclip, 
  Download, 
  Calendar, 
  DollarSign, 
  ChevronDown, 
  Check, 
  RefreshCw,
  Share2,
  CornerDownRight,
  UserCheck,
  Tag,
  ArrowLeft
} from 'lucide-react';

export default function EmailDetail({ 
  email, 
  onClose, 
  onOverrideClassification, 
  onUpdateStatus, 
  onSendReply,
  onGenerateDraft,
  isGeneratingDraft
}) {
  if (!email) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <Mail className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Select an email conversation</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Choose a conversation from the list to view full thread history, AI triage analysis, extracted action items, and draft responses.
        </p>
      </div>
    );
  }

  const [replyTone, setReplyTone] = useState(email.draftReply?.tone || 'Professional & Confident');
  const [replyBody, setReplyBody] = useState(email.draftReply?.body || '');
  const [isSending, setIsSending] = useState(false);
  const [showOverrideMenu, setShowOverrideMenu] = useState(false);
  const [isCalendarAdded, setIsCalendarAdded] = useState(false);

  // Sync state if draft changes
  React.useEffect(() => {
    if (email.draftReply?.body) {
      setReplyBody(email.draftReply.body);
    }
  }, [email.id, email.draftReply]);

  const handleSend = async () => {
    if (!replyBody.trim()) return;
    setIsSending(true);
    await onSendReply(email.id, {
      body: replyBody,
      from: { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' },
      to: email.recipients
    });
    setIsSending(false);
  };

  const handleRegenerateDraft = async (selectedTone) => {
    setReplyTone(selectedTone);
    const draft = await onGenerateDraft(email.id, selectedTone);
    if (draft?.body) {
      setReplyBody(draft.body);
    }
  };

  const getBadgeConfig = (type) => {
    switch (type) {
      case 'CLIENT_REPLY':
        return {
          label: 'Client to Reply',
          bg: 'bg-amber-500 text-white',
          lightBg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: User,
          desc: 'High-stakes executive decision or signature requiring David’s personal authorization.'
        };
      case 'ASSISTANT_REPLY':
        return {
          label: 'Assistant to Reply',
          bg: 'bg-indigo-600 text-white',
          lightBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
          icon: Bot,
          desc: 'Logistical, scheduling, administrative or routine inquiry for assistant execution.'
        };
      case 'NO_REPLY_NEEDED':
        return {
          label: 'No Reply Needed',
          bg: 'bg-slate-600 text-white',
          lightBg: 'bg-slate-100 border-slate-200 text-slate-800',
          icon: Coffee,
          desc: 'Informational newsletter, receipt, or closed thread.'
        };
      default:
        return {
          label: 'Needs Review',
          bg: 'bg-rose-500 text-white',
          lightBg: 'bg-rose-50 border-rose-200 text-rose-900',
          icon: AlertCircle,
          desc: 'Ambiguous or multi-intent email. Flagged for assistant triage.'
        };
    }
  };

  const badgeConfig = getBadgeConfig(email.classification?.type);
  const ClassificationIcon = badgeConfig.icon;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      
      {/* Top Action Toolbar */}
      <div className="p-3.5 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Handled / Resolve toggle */}
          <button
            onClick={() => onUpdateStatus(email.id, { status: email.status === 'handled' ? 'pending' : 'handled' })}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              email.status === 'handled'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${email.status === 'handled' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{email.status === 'handled' ? 'Marked as Handled' : 'Mark Handled'}</span>
          </button>

          {/* Star Important */}
          <button
            onClick={() => onUpdateStatus(email.id, { isImportant: !email.isImportant })}
            className={`p-1.5 rounded-lg border transition ${
              email.isImportant 
                ? 'bg-amber-50 text-amber-600 border-amber-200' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            title="Toggle Important"
          >
            <Star className={`w-4 h-4 ${email.isImportant ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>

          {/* Archive */}
          <button
            onClick={() => onUpdateStatus(email.id, { isArchived: !email.isArchived })}
            className={`p-1.5 rounded-lg border text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-slate-200 transition ${
              email.isArchived ? 'bg-slate-100 text-slate-800' : ''
            }`}
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>

        {/* Timestamp */}
        <span className="text-xs text-slate-400">
          {new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Main Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* Email Subject */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Thread #{email.threadId}
            </span>
            {email.urgency === 'high' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800">
                High Urgency
              </span>
            )}
            {email.classification.overridden && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-800">
                Manually Overridden by {email.classification.overriddenBy}
              </span>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
            {email.subject}
          </h1>
        </div>

        {/* ========================================================= */}
        {/* CORE FEATURE: AI Executive Classification & Triage Banner */}
        {/* ========================================================= */}
        <div className={`p-4 rounded-2xl border ${badgeConfig.lightBg} shadow-xs space-y-3 relative overflow-hidden`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded-xl ${badgeConfig.bg} flex items-center justify-center shadow-xs`}>
                <ClassificationIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900">
                    {badgeConfig.label}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200/80 text-slate-700">
                    {Math.round(email.classification.confidence * 100)}% AI Confidence
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Automatic AI Responsibility Analysis
                </p>
              </div>
            </div>

            {/* Manual Override Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowOverrideMenu(!showOverrideMenu)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition"
              >
                <span>Change Responsibility</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showOverrideMenu && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Override AI Classification
                  </div>
                  
                  <button
                    onClick={() => {
                      onOverrideClassification(email.id, 'ASSISTANT_REPLY', 'Manually reassigned to Assistant for handling.');
                      setShowOverrideMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 text-left font-medium"
                  >
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>Assistant to Reply</span>
                  </button>

                  <button
                    onClick={() => {
                      onOverrideClassification(email.id, 'CLIENT_REPLY', 'Manually escalated for Client personal review.');
                      setShowOverrideMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 text-left font-medium"
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    <span>Client to Reply</span>
                  </button>

                  <button
                    onClick={() => {
                      onOverrideClassification(email.id, 'NO_REPLY_NEEDED', 'Manually marked as No Reply Needed.');
                      setShowOverrideMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 text-left font-medium"
                  >
                    <Coffee className="w-4 h-4 text-slate-600" />
                    <span>No Reply Needed</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Reasoning Text */}
          <div className="bg-white/90 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900">Why this responsibility: </span>
            {email.classification.reason}
          </div>

          {/* Action Required Callout */}
          {email.actionRequired && (
            <div className="flex items-start space-x-2 text-xs bg-rose-50/80 p-2.5 rounded-xl border border-rose-200/80 text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Next Action: </span>
                <span>{email.actionSummary || 'Action required on this conversation.'}</span>
              </div>
            </div>
          )}

          {/* Detected Entities Bar */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 pt-1 text-[11px]">
            {email.detectedEntities?.deadlines?.length > 0 && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700">
                <Clock className="w-3 h-3 text-rose-500" />
                <span>Deadline: {email.detectedEntities.deadlines.join(', ')}</span>
              </span>
            )}

            {email.detectedEntities?.amountOrFinance && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700">
                <DollarSign className="w-3 h-3 text-emerald-600" />
                <span>Financial: {email.detectedEntities.amountOrFinance}</span>
              </span>
            )}

            {email.detectedEntities?.meetingProposal && (
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 font-medium text-emerald-800">
                <Calendar className="w-3 h-3 text-emerald-600" />
                <span>Meeting: {email.detectedEntities.meetingProposal.date} ({email.detectedEntities.meetingProposal.time})</span>
                <button
                  onClick={() => setIsCalendarAdded(true)}
                  className="underline font-bold text-emerald-900 hover:text-emerald-950 ml-1"
                >
                  {isCalendarAdded ? '✓ Added' : '+ Add to Calendar'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Thread History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Conversation History ({email.messages.length})</span>
          </div>

          {email.messages.map((msg, index) => (
            <div 
              key={msg.id || index}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
            >
              {/* Message Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {msg.from.name ? msg.from.name[0] : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{msg.from.name}</span>
                      <span className="text-[10px] text-slate-400">&lt;{msg.from.email}&gt;</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      To: {msg.to.map(t => t.name).join(', ')}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Body */}
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-normal">
                {msg.body}
              </div>

              {/* Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Attachments ({msg.attachments.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.attachments.map((att, i) => (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <Paperclip className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-800 truncate">{att.name}</p>
                            <p className="text-[10px] text-slate-400">{att.size}</p>
                          </div>
                        </div>
                        <Download className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* AI SMART REPLY COMPOSER & REVIEW EXPERIENCE               */}
        {/* ======================================================== */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">AI Reply Assistant</h3>
                <p className="text-[10px] text-slate-500">Draft, review and send approved responses</p>
              </div>
            </div>

            {/* Tone selector */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
              {[
                'Professional & Confident', 
                'Warm & Accommodating', 
                'Short & Executive', 
                'Polite Decline', 
                'Reschedule'
              ].map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleRegenerateDraft(tone)}
                  disabled={isGeneratingDraft}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                    replyTone === tone
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Reply Box */}
          <div className="relative">
            <textarea
              rows={6}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Draft your reply here or click a tone above to generate an AI draft..."
              className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-800 leading-relaxed font-sans"
            />
            {isGeneratingDraft && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-xl">
                <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-700">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating contextual AI response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Send & Approval Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-slate-500 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sending as: <strong className="text-slate-800">Sarah Jenkins (Assistant)</strong></span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setReplyBody('')}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !replyBody.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/30 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Review & Send Reply'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
