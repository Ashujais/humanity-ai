import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MetricsOverview from './components/MetricsOverview';
import EmailList from './components/EmailList';
import EmailDetail from './components/EmailDetail';
import ClientView from './components/ClientView';
import SimulateEmailModal from './components/SimulateEmailModal';
import ConnectAccountModal from './components/ConnectAccountModal';
import OnboardingModal from './components/OnboardingModal';
import CopilotDrawer from './components/CopilotDrawer';
import MeetingsCalendarView from './components/MeetingsCalendarView';
import { emailApi } from './api/emailApi';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('assistant'); // 'assistant' | 'client'
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('acc_1');
  const [emails, setEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [activeSegment, setActiveSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // UI Modals & Drawers
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initial Data Fetch
  const fetchAccountsAndEmails = async () => {
    try {
      const fetchedAccounts = await emailApi.getAccounts();
      if (fetchedAccounts?.length > 0) {
        setAccounts(fetchedAccounts);
        if (!selectedAccountId) {
          setSelectedAccountId(fetchedAccounts[0].id);
        }
      }

      const fetchedEmails = await emailApi.getEmails({
        accountId: selectedAccountId || 'acc_1',
      });
      setEmails(fetchedEmails || []);

      if (fetchedEmails?.length > 0 && !selectedEmailId) {
        setSelectedEmailId(fetchedEmails[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    fetchAccountsAndEmails();
  }, [selectedAccountId]);

  // Sync Account handler
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await emailApi.syncAccount(selectedAccountId);
      const updatedEmails = await emailApi.getEmails({ accountId: selectedAccountId });
      setEmails(updatedEmails);
      showToast('Inbox synchronized and AI classifications refreshed.');
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  // Override AI classification
  const handleOverrideClassification = async (emailId, newType, reason) => {
    try {
      const updated = await emailApi.overrideClassification(emailId, newType, reason, activeRole);
      setEmails(prev => prev.map(e => e.id === emailId ? updated : e));
      showToast(`Reclassified responsibility as ${newType.replace('_', ' ')}.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Update Status (Handled, Delegate, Star, Read, Archive)
  const handleUpdateStatus = async (emailId, updates) => {
    try {
      const updated = await emailApi.updateEmailStatus(emailId, updates);
      setEmails(prev => prev.map(e => e.id === emailId ? updated : e));
      if (updates.status === 'handled') {
        showToast('Conversation marked as Handled.');
      } else if (updates.status === 'delegated_to_assistant') {
        showToast('Successfully delegated to Assistant (Sarah).');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Reply
  const handleSendReply = async (emailId, messageData) => {
    try {
      const updated = await emailApi.sendMessage(emailId, messageData);
      setEmails(prev => prev.map(e => e.id === emailId ? updated : e));
      showToast('Reply dispatched. Thread moved to Waiting for Response.');
    } catch (err) {
      console.error(err);
    }
  };

  // Generate AI Draft
  const handleGenerateDraft = async (emailId, tone) => {
    setIsGeneratingDraft(true);
    try {
      const draft = await emailApi.generateAIDraft(emailId, tone, activeRole);
      setEmails(prev => prev.map(e => e.id === emailId ? { ...e, draftReply: draft } : e));
      return draft;
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Simulate Incoming Email
  const handleSimulateEmail = async (simData) => {
    const newEmail = await emailApi.simulateIncomingEmail(simData);
    setEmails(prev => [newEmail, ...prev]);
    setSelectedEmailId(newEmail.id);
    showToast(`New email received & classified as ${newEmail.classification.type.replace('_', ' ')}!`);
    return newEmail;
  };

  // Connect Account
  const handleConnectAccount = async (accountData) => {
    const newAccount = await emailApi.connectAccount(accountData);
    setAccounts(prev => [...prev, newAccount]);
    setSelectedAccountId(newAccount.id);
    showToast(`Connected ${newAccount.clientName}'s ${newAccount.providerName} account.`);
  };

  // Query Copilot
  const handleQueryCopilot = async (query, activeEmailId) => {
    return await emailApi.queryCopilot(query, activeEmailId);
  };

  // Filter Emails for current view
  const currentAccount = accounts.find(a => a.id === selectedAccountId) || accounts[0] || {};
  
  const filteredEmails = emails.filter((email) => {
    // Segment filter
    if (activeSegment === 'assistant' && email.classification.type !== 'ASSISTANT_REPLY') return false;
    if (activeSegment === 'client' && email.classification.type !== 'CLIENT_REPLY') return false;
    if (activeSegment === 'no_reply' && email.classification.type !== 'NO_REPLY_NEEDED') return false;
    if (activeSegment === 'needs_review' && email.classification.type !== 'NEEDS_REVIEW') return false;
    if (activeSegment === 'action_required' && (!email.actionRequired || email.status === 'handled')) return false;
    if (activeSegment === 'waiting' && (!email.waitingForResponse && email.segment !== 'waiting')) return false;
    if (activeSegment === 'meetings' && email.detectedEntities?.meetingProposal === null) return false;
    if (activeSegment === 'important' && !email.isImportant) return false;
    if (activeSegment === 'archived' && !email.isArchived) return false;
    if (activeSegment !== 'archived' && email.isArchived) return false;

    // Status filter
    if (filterStatus === 'unread' && email.isRead) return false;
    if (filterStatus === 'important' && !email.isImportant) return false;
    if (filterStatus === 'pending' && email.status === 'handled') return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchSubject = email.subject.toLowerCase().includes(q);
      const matchSender = email.sender.name.toLowerCase().includes(q) || email.sender.email.toLowerCase().includes(q);
      const matchSummary = email.summary?.toLowerCase().includes(q);
      const matchBody = email.messages?.some(m => m.body.toLowerCase().includes(q));
      if (!matchSubject && !matchSender && !matchSummary && !matchBody) return false;
    }

    return true;
  });

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || filteredEmails[0] || null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-900">
      
      {/* Top Header */}
      <Header
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        isSyncing={isSyncing}
        onSync={handleSync}
        onOpenSimulate={() => setShowSimulateModal(true)}
        onOpenConnect={() => setShowConnectModal(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
        copilotOpen={copilotOpen}
      />

      {/* Main Content Area based on Role */}
      {activeRole === 'client' ? (
        /* ======================================================== */
        /* CLIENT-FACING MINIMALIST VIEW                             */
        /* ======================================================== */
        <main className="flex-1">
          <ClientView
            emails={emails}
            onUpdateStatus={handleUpdateStatus}
            onOverrideClassification={handleOverrideClassification}
            onSendReply={handleSendReply}
            clientName={currentAccount.clientName || 'David Sterling'}
          />
        </main>
      ) : (
        /* ======================================================== */
        /* ASSISTANT-FACING FULL EMAIL MANAGEMENT DASHBOARD          */
        /* ======================================================== */
        <main className="flex-1 flex overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <div className="hidden md:block">
            <Sidebar
              activeSegment={activeSegment}
              setActiveSegment={setActiveSegment}
              emails={emails}
              currentAccount={currentAccount}
            />
          </div>

          {/* Central Workspace */}
          <div className="flex-1 flex flex-col h-[calc(100vh-4.1rem)] overflow-hidden">
            
            {/* Top Glance Metrics Counter */}
            <div className="p-4 pb-0 shrink-0 bg-slate-50/70 border-b border-slate-200/50">
              <MetricsOverview
                emails={emails}
                activeSegment={activeSegment}
                setActiveSegment={setActiveSegment}
              />
            </div>

            {/* Split Screen: Email List vs Email Detail (or Meetings Calendar) */}
            <div className="flex-1 flex overflow-hidden">
              {activeSegment === 'meetings' ? (
                <div className="w-full h-full">
                  <MeetingsCalendarView
                    emails={emails}
                    onSelectEmail={(id) => {
                      setActiveSegment('all');
                      setSelectedEmailId(id);
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Left Column: Email List */}
                  <div className={`w-full md:w-96 lg:w-[420px] shrink-0 h-full overflow-hidden ${
                    selectedEmailId ? 'hidden md:block' : 'block'
                  }`}>
                    <EmailList
                      emails={filteredEmails}
                      selectedEmailId={selectedEmailId}
                      onSelectEmail={(id) => {
                        setSelectedEmailId(id);
                        // Mark as read when selected
                        handleUpdateStatus(id, { isRead: true });
                      }}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      filterStatus={filterStatus}
                      setFilterStatus={setFilterStatus}
                      onToggleStar={(id, isImp) => handleUpdateStatus(id, { isImportant: isImp })}
                      activeSegment={activeSegment}
                    />
                  </div>

                  {/* Right Column: Email Detail Thread */}
                  <div className={`flex-1 h-full overflow-hidden ${
                    !selectedEmailId ? 'hidden md:block' : 'block'
                  }`}>
                    <EmailDetail
                      email={selectedEmail}
                      onClose={() => setSelectedEmailId(null)}
                      onOverrideClassification={handleOverrideClassification}
                      onUpdateStatus={handleUpdateStatus}
                      onSendReply={handleSendReply}
                      onGenerateDraft={handleGenerateDraft}
                      isGeneratingDraft={isGeneratingDraft}
                    />
                  </div>
                </>
              )}
            </div>

          </div>

        </main>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Slide-out Drawers */}
      <SimulateEmailModal
        isOpen={showSimulateModal}
        onClose={() => setShowSimulateModal(false)}
        onSimulate={handleSimulateEmail}
        currentAccountId={selectedAccountId}
      />

      <ConnectAccountModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onAccountConnected={handleConnectAccount}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <CopilotDrawer
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        onQueryCopilot={handleQueryCopilot}
        activeEmail={selectedEmail}
        onSelectEmail={(id) => {
          setSelectedEmailId(id);
          setCopilotOpen(false);
        }}
      />

    </div>
  );
}
