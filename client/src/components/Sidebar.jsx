import React from 'react';
import { 
  Inbox, 
  Bot, 
  User, 
  Coffee, 
  AlertCircle, 
  Zap, 
  Clock, 
  Calendar, 
  Star, 
  Archive,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  activeSegment, 
  setActiveSegment, 
  emails = [], 
  currentAccount = {} 
}) {
  // Compute counts for each category
  const assistantCount = emails.filter(e => e.classification.type === 'ASSISTANT_REPLY' && e.status !== 'handled').length;
  const clientCount = emails.filter(e => e.classification.type === 'CLIENT_REPLY' && e.status !== 'handled').length;
  const noReplyCount = emails.filter(e => e.classification.type === 'NO_REPLY_NEEDED').length;
  const reviewCount = emails.filter(e => e.classification.type === 'NEEDS_REVIEW').length;
  
  const allCount = emails.filter(e => !e.isArchived).length;
  const actionCount = emails.filter(e => e.actionRequired && e.status !== 'handled').length;
  const waitingCount = emails.filter(e => e.waitingForResponse || e.segment === 'waiting').length;
  const meetingsCount = emails.filter(e => e.detectedEntities?.meetingProposal !== null).length;
  const importantCount = emails.filter(e => e.isImportant && !e.isArchived).length;

  const responsibilityItems = [
    {
      id: 'assistant',
      label: 'Assistant to Reply',
      desc: 'Logistics, scheduling, routine admin',
      icon: Bot,
      count: assistantCount,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      activeBg: 'bg-indigo-50/80 text-indigo-900 border-indigo-200'
    },
    {
      id: 'client',
      label: 'Client to Reply',
      desc: 'CEO sign-offs, wire approvals, VIPs',
      icon: User,
      count: clientCount,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-100 text-amber-900 font-bold',
      activeBg: 'bg-amber-50/80 text-amber-950 border-amber-200'
    },
    {
      id: 'no_reply',
      label: 'No Reply Needed',
      desc: 'Newsletters, receipts, automated alerts',
      icon: Coffee,
      count: noReplyCount,
      color: 'text-slate-500',
      badgeBg: 'bg-slate-100 text-slate-700',
      activeBg: 'bg-slate-100 text-slate-900 border-slate-200'
    },
    {
      id: 'needs_review',
      label: 'Needs Review',
      desc: 'Low confidence / ambiguous context',
      icon: AlertCircle,
      count: reviewCount,
      color: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800',
      activeBg: 'bg-rose-50/80 text-rose-900 border-rose-200'
    }
  ];

  const workflowItems = [
    {
      id: 'all',
      label: 'All Inbox',
      icon: Inbox,
      count: allCount,
    },
    {
      id: 'action_required',
      label: 'Action Required',
      icon: Zap,
      count: actionCount,
      badgeBg: 'bg-rose-50 text-rose-700'
    },
    {
      id: 'waiting',
      label: 'Waiting for Response',
      icon: Clock,
      count: waitingCount,
      badgeBg: 'bg-sky-50 text-sky-700'
    },
    {
      id: 'meetings',
      label: 'Meetings & Invites',
      icon: Calendar,
      count: meetingsCount,
      badgeBg: 'bg-emerald-50 text-emerald-700'
    },
    {
      id: 'important',
      label: 'Important',
      icon: Star,
      count: importantCount,
    },
    {
      id: 'archived',
      label: 'Archive',
      icon: Archive,
      count: emails.filter(e => e.isArchived).length,
    }
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between h-[calc(100vh-4.1rem)] bg-white border-r border-slate-200/80 p-4 overflow-y-auto">
      
      <div className="space-y-6">
        
        {/* Section 1: AI Reply Responsibility */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Reply Responsibility
            </span>
            <span className="inline-flex items-center text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded-full">
              <Sparkles className="w-2.5 h-2.5 mr-1" />
              AI Triage
            </span>
          </div>

          <nav className="space-y-1">
            {responsibilityItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSegment === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSegment(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium border transition-all duration-150 ${
                    isActive 
                      ? `${item.activeBg} font-semibold shadow-xs` 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 ${item.badgeBg}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 2: General Email Workflow */}
        <div>
          <div className="px-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Inbox Segments
            </span>
          </div>

          <nav className="space-y-1">
            {workflowItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSegment === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSegment(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium border transition-all duration-150 ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 font-semibold border-slate-200 shadow-xs' 
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeBg || 'bg-slate-100 text-slate-600'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Account Info Footer Card */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70">
          <div className="flex items-center space-x-2.5 mb-2">
            <img 
              src={currentAccount.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"}
              alt={currentAccount.clientName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentAccount.clientName || 'David Sterling'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {currentAccount.clientRole || 'Client Account'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/50">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">{currentAccount.providerName || 'Google Workspace'}</span>
            </span>
            <span className="text-emerald-700 font-semibold">Active</span>
          </div>
        </div>
      </div>

    </aside>
  );
}
