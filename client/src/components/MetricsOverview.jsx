import React from 'react';
import { 
  Bot, 
  User, 
  Zap, 
  Clock, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function MetricsOverview({ 
  emails = [], 
  activeSegment, 
  setActiveSegment 
}) {
  const assistantCount = emails.filter(e => e.classification.type === 'ASSISTANT_REPLY' && e.status !== 'handled').length;
  const clientCount = emails.filter(e => e.classification.type === 'CLIENT_REPLY' && e.status !== 'handled').length;
  const actionCount = emails.filter(e => e.actionRequired && e.status !== 'handled').length;
  const waitingCount = emails.filter(e => e.waitingForResponse || e.segment === 'waiting').length;
  const meetingsCount = emails.filter(e => e.detectedEntities?.meetingProposal !== null).length;

  const cards = [
    {
      id: 'assistant',
      title: 'Assistant to Reply',
      count: assistantCount,
      subtitle: 'Your immediate action items',
      icon: Bot,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50/70',
      border: 'border-indigo-100',
      isActive: activeSegment === 'assistant'
    },
    {
      id: 'client',
      title: 'Client to Reply',
      count: clientCount,
      subtitle: 'Awaiting David’s sign-off',
      icon: User,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50/70',
      border: 'border-amber-100',
      isActive: activeSegment === 'client'
    },
    {
      id: 'action_required',
      title: 'Action Required',
      count: actionCount,
      subtitle: 'Upcoming deadlines & tasks',
      icon: Zap,
      color: 'from-rose-500 to-rose-600',
      textColor: 'text-rose-600',
      bgLight: 'bg-rose-50/70',
      border: 'border-rose-100',
      isActive: activeSegment === 'action_required'
    },
    {
      id: 'waiting',
      title: 'Waiting for Response',
      count: waitingCount,
      subtitle: 'External parties follow-up',
      icon: Clock,
      color: 'from-sky-500 to-sky-600',
      textColor: 'text-sky-600',
      bgLight: 'bg-sky-50/70',
      border: 'border-sky-100',
      isActive: activeSegment === 'waiting'
    },
    {
      id: 'meetings',
      title: 'Detected Meetings',
      count: meetingsCount,
      subtitle: 'Rescheduling & calendar invites',
      icon: Calendar,
      color: 'from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-600',
      bgLight: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      isActive: activeSegment === 'meetings'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            onClick={() => setActiveSegment(card.id)}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 group relative overflow-hidden ${
              card.isActive
                ? 'bg-white ring-2 ring-indigo-500 border-indigo-200 shadow-md'
                : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-7 h-7 rounded-lg ${card.bgLight} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${card.textColor}`} />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {card.subtitle}
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="group-hover:text-indigo-600 transition font-medium">View segment</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-slate-400 group-hover:text-indigo-600" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
