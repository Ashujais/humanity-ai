import React from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Plus, 
  HelpCircle, 
  Bot, 
  UserCheck, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Zap,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function Header({ 
  activeRole, 
  setActiveRole, 
  accounts, 
  selectedAccountId, 
  setSelectedAccountId, 
  isSyncing, 
  onSync, 
  onOpenSimulate, 
  onOpenConnect, 
  onOpenOnboarding,
  onToggleCopilot,
  copilotOpen,
  unreadCount = 0
}) {
  const currentAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0] || {};

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                  Humanity AI
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Assistant Hub
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Intelligent Email Triage & Handoff
              </p>
            </div>
          </div>

          {/* Central Role Switcher: Assistant View vs Client View */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveRole('assistant')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeRole === 'assistant'
                  ? 'bg-white text-indigo-900 shadow-sm border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
              <span>Assistant Dashboard</span>
              <span className="text-[10px] text-slate-400 font-normal">(Sarah Jenkins)</span>
            </button>

            <button
              onClick={() => setActiveRole('client')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeRole === 'client'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${activeRole === 'client' ? 'bg-white' : 'bg-amber-500'}`}></div>
              <span>Client Executive View</span>
              <span className={`text-[10px] ${activeRole === 'client' ? 'text-amber-100' : 'text-slate-400'} font-normal`}>
                (David Sterling)
              </span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Account Switcher */}
            <div className="relative hidden lg:block">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium pl-8 pr-8 py-2 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.clientName} ({acc.providerName.split(' ')[0]})
                  </option>
                ))}
              </select>
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sync Status Button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              title="Synchronize connected email accounts"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 rounded-lg border border-slate-200/80 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Syncing...' : 'Synced'}
              </span>
            </button>

            {/* Simulate Incoming Email Action Button */}
            <button
              onClick={onOpenSimulate}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg shadow-sm shadow-indigo-500/25 transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Simulate Incoming Email</span>
              <span className="sm:hidden">Simulate</span>
            </button>

            {/* AI Copilot Drawer Trigger */}
            <button
              onClick={onToggleCopilot}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                copilotOpen
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title="Ask AI Copilot"
            >
              <Bot className="w-4 h-4 text-purple-600" />
              <span className="hidden xl:inline">Ask Copilot</span>
            </button>

            {/* Product Tour / Help */}
            <button
              onClick={onOpenOnboarding}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
              title="Product Tour & Problem Overview"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Add / Connect Account */}
            <button
              onClick={onOpenConnect}
              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 transition"
              title="Connect another email account"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center pl-1 sm:pl-2">
              <img
                src={activeRole === 'assistant' 
                  ? "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80"
                  : currentAccount.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
            </div>

          </div>

        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100">
          <div className="flex items-center space-x-1 w-full bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveRole('assistant')}
              className={`flex-1 py-1 text-center text-xs font-semibold rounded-md transition ${
                activeRole === 'assistant' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Assistant View
            </button>
            <button
              onClick={() => setActiveRole('client')}
              className={`flex-1 py-1 text-center text-xs font-semibold rounded-md transition ${
                activeRole === 'client' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Client View
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
