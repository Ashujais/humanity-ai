import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  MessageSquare,
  Zap,
  Clock,
  User,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const SUGGESTIONS = [
  'Show me emails that need my attention.',
  'Which emails require the client\'s attention?',
  'What am I waiting for a response on?',
  'Summarize this conversation.',
  'Why has this email been assigned to the client?',
  'Draft a reply to this conversation.'
];

export default function CopilotDrawer({ 
  isOpen, 
  onClose, 
  onQueryCopilot, 
  activeEmail, 
  onSelectEmail 
}) {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: `Hello Sarah! I'm your AI Executive Inbox Copilot. You can ask me to triage emails, inspect pending client approvals, extract deadlines, or generate context-aware response drafts.`,
      items: null
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuery = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Add user message
    const newHistory = [...messages, { sender: 'user', text: q }];
    setMessages(newHistory);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await onQueryCopilot(q, activeEmail?.id);
      setMessages([
        ...newHistory,
        {
          sender: 'copilot',
          text: response.reply,
          items: response.items || null,
          draft: response.draft || null
        }
      ]);
    } catch (err) {
      setMessages([
        ...newHistory,
        {
          sender: 'copilot',
          text: `I ran into an issue analyzing that request: ${err.message}. Please try again.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/70 to-indigo-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <span>Ask AI Copilot</span>
              <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-semibold">Live</span>
            </h3>
            <p className="text-[10px] text-slate-500">Autonomous Assistant Engine</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar flex items-center space-x-1.5">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuery(s)}
            className="text-[10px] font-medium bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 border border-slate-200/80 px-2.5 py-1 rounded-full shrink-0 transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-xs'
                  : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Items Card List if Returned */}
              {m.items && m.items.length > 0 && (
                <div className="mt-3 space-y-2 pt-2 border-t border-slate-200/60">
                  {m.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectEmail && onSelectEmail(item.id)}
                      className="bg-white p-2 rounded-xl border border-slate-200/80 hover:border-indigo-400 cursor-pointer transition shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-900">
                        <span className="truncate">{item.subject}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {item.sender || item.recipient} {item.reason ? `• ${item.reason}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-xs text-purple-700 bg-purple-50 p-3 rounded-2xl w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>AI Copilot is analyzing inbox records...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Copilot a question..."
            className="flex-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-slate-800"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
