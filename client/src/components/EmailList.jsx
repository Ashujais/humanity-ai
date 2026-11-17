import React from 'react';
import { 
  Search, 
  Star, 
  Bot, 
  User, 
  Coffee, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Paperclip,
  ArrowUpRight,
  Filter,
  X
} from 'lucide-react';

export default function EmailList({ 
  emails = [], 
  selectedEmailId, 
  onSelectEmail, 
  searchQuery, 
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  onToggleStar,
  activeSegment
}) {
  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getClassificationBadge = (classification) => {
    switch (classification?.type) {
      case 'CLIENT_REPLY':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80">
            <User className="w-3 h-3 text-amber-600" />
            <span>Client to Reply</span>
          </span>
        );
      case 'ASSISTANT_REPLY':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200/80">
            <Bot className="w-3 h-3 text-indigo-600" />
            <span>Assistant to Reply</span>
          </span>
        );
      case 'NO_REPLY_NEEDED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
            <Coffee className="w-3 h-3 text-slate-400" />
            <span>No Reply Needed</span>
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/80">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Needs Review</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      
      {/* Search & Filter Header */}
      <div className="p-3 border-b border-slate-200/80 bg-slate-50/60 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails, senders, action items..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                filterStatus === 'unread'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterStatus('important')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                filterStatus === 'important'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Important
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                filterStatus === 'pending'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Pending
            </button>
          </div>

          <span className="text-[11px] text-slate-400 shrink-0 pl-2">
            {emails.length} emails
          </span>
        </div>
      </div>

      {/* Email Items Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {emails.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-64">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Inbox Zero in this view</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              No conversations match the current filter or search criteria.
            </p>
          </div>
        ) : (
          emails.map((email) => {
            const isSelected = email.id === selectedEmailId;
            const hasAttachments = email.messages?.some(m => m.attachments?.length > 0);
            const hasMeeting = email.detectedEntities?.meetingProposal !== null;

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className={`p-3.5 cursor-pointer transition-all duration-150 relative border-l-4 ${
                  isSelected
                    ? 'bg-indigo-50/50 border-l-indigo-600'
                    : !email.isRead
                    ? 'bg-white hover:bg-slate-50/80 border-l-amber-500 font-semibold'
                    : 'bg-white hover:bg-slate-50/60 border-l-transparent opacity-95'
                }`}
              >
                {/* Header row: Sender + Date + Star */}
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center space-x-2 min-w-0">
                    <img
                      src={email.sender.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"}
                      alt={email.sender.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-xs truncate ${!email.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {email.sender.name}
                        </span>
                        {email.sender.company && (
                          <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                            • {email.sender.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    <span className="text-[10px] text-slate-400 font-normal">
                      {formatRelativeTime(email.date)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(email.id, !email.isImportant);
                      }}
                      className="p-1 text-slate-300 hover:text-amber-500 transition"
                      title={email.isImportant ? 'Starred' : 'Star'}
                    >
                      <Star className={`w-3.5 h-3.5 ${email.isImportant ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Subject Line */}
                <h3 className={`text-xs leading-snug truncate mb-1 ${!email.isRead ? 'font-bold text-slate-950' : 'font-medium text-slate-800'}`}>
                  {email.subject}
                </h3>

                {/* AI Executive Summary preview snippet */}
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2 font-normal">
                  {email.summary || email.messages[0]?.body?.slice(0, 120)}
                </p>

                {/* Bottom Metadata Badges */}
                <div className="flex items-center justify-between pt-1 flex-wrap gap-1">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    {/* Primary AI Classification Badge */}
                    {getClassificationBadge(email.classification)}

                    {/* Urgency Badge */}
                    {email.urgency === 'high' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-100 text-rose-700">
                        Urgent
                      </span>
                    )}

                    {/* Status badge: Handled or Delegated */}
                    {email.status === 'handled' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Handled
                      </span>
                    )}
                    {email.status === 'delegated_to_assistant' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        Delegated by Client
                      </span>
                    )}
                    {email.status === 'replied' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-sky-50 text-sky-700 border border-sky-200">
                        Replied
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-slate-400 text-[10px]">
                    {hasMeeting && <Calendar className="w-3 h-3 text-emerald-600" title="Meeting detected" />}
                    {hasAttachments && <Paperclip className="w-3 h-3" title="Has attachments" />}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
