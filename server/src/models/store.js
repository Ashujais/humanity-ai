import { initialAccounts, initialEmails } from '../data/seedData.js';
import { v4 as uuidv4 } from 'uuid';
import { classifyEmailContent } from '../services/aiEngine.js';

class DataStore {
  constructor() {
    this.accounts = JSON.parse(JSON.stringify(initialAccounts));
    this.emails = JSON.parse(JSON.stringify(initialEmails));
  }

  // Account operations
  getAccounts() {
    return this.accounts;
  }

  getAccountById(id) {
    return this.accounts.find(a => a.id === id);
  }

  createAccount(accountData) {
    const newAccount = {
      id: `acc_${uuidv4().slice(0, 8)}`,
      clientName: accountData.clientName || 'Executive Client',
      clientRole: accountData.clientRole || 'Executive',
      assistantName: accountData.assistantName || 'Sarah Jenkins',
      email: accountData.email,
      provider: accountData.provider || 'google',
      providerName: accountData.provider === 'google' ? 'Google Workspace' : accountData.provider === 'microsoft' ? 'Microsoft 365 Outlook' : 'Custom IMAP',
      status: 'connected',
      lastSyncedAt: new Date().toISOString(),
      autoSync: true,
      avatar: accountData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      stats: {
        totalEmails: 0,
        unreadEmails: 0,
        assistantToReply: 0,
        clientToReply: 0,
        noReplyNeeded: 0,
        needsReview: 0,
      }
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  updateAccount(id, updateData) {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.accounts[index] = { ...this.accounts[index], ...updateData };
    return this.accounts[index];
  }

  // Email operations
  getEmails({ accountId, segment, search, responsibility, status, urgency }) {
    let list = [...this.emails];

    if (accountId) {
      list = list.filter(e => e.accountId === accountId);
    }

    if (responsibility && responsibility !== 'ALL') {
      list = list.filter(e => e.classification.type === responsibility);
    }

    if (status) {
      if (status === 'unread') list = list.filter(e => !e.isRead);
      else if (status === 'important') list = list.filter(e => e.isImportant);
      else if (status === 'handled') list = list.filter(e => e.status === 'handled');
      else if (status === 'pending') list = list.filter(e => e.status === 'pending');
    }

    if (segment) {
      switch (segment) {
        case 'assistant':
          list = list.filter(e => e.classification.type === 'ASSISTANT_REPLY');
          break;
        case 'client':
          list = list.filter(e => e.classification.type === 'CLIENT_REPLY');
          break;
        case 'no_reply':
          list = list.filter(e => e.classification.type === 'NO_REPLY_NEEDED');
          break;
        case 'needs_review':
          list = list.filter(e => e.classification.type === 'NEEDS_REVIEW');
          break;
        case 'action_required':
          list = list.filter(e => e.actionRequired && e.status !== 'handled');
          break;
        case 'waiting':
          list = list.filter(e => e.waitingForResponse || e.segment === 'waiting');
          break;
        case 'meetings':
          list = list.filter(e => e.detectedEntities?.meetingProposal !== null);
          break;
        case 'important':
          list = list.filter(e => e.isImportant);
          break;
        case 'archived':
          list = list.filter(e => e.isArchived);
          break;
        default:
          break;
      }
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.subject.toLowerCase().includes(q) ||
        e.sender.name.toLowerCase().includes(q) ||
        e.sender.email.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.messages.some(m => m.body.toLowerCase().includes(q))
      );
    }

    // Sort by date descending
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return list;
  }

  getEmailById(id) {
    return this.emails.find(e => e.id === id);
  }

  async createSimulatedEmail({ accountId = 'acc_1', subject, senderName, senderEmail, senderCompany, body, recipients, cc }) {
    const rawEmail = {
      subject,
      sender: {
        name: senderName || 'External Partner',
        email: senderEmail || 'partner@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
        company: senderCompany || 'Partner Corp'
      },
      recipients: recipients || [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
      cc: cc || [{ name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }],
      messages: [
        {
          id: `msg_${uuidv4().slice(0, 8)}`,
          from: { name: senderName || 'External Partner', email: senderEmail || 'partner@example.com' },
          to: recipients || [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
          timestamp: new Date().toISOString(),
          body: body || 'Sample message content',
          attachments: []
        }
      ]
    };

    // Run AI Classification
    const aiResult = await classifyEmailContent(rawEmail);

    const newEmail = {
      id: `email_${uuidv4().slice(0, 8)}`,
      accountId,
      threadId: `th_${uuidv4().slice(0, 6)}`,
      subject: rawEmail.subject,
      sender: rawEmail.sender,
      recipients: rawEmail.recipients,
      cc: rawEmail.cc,
      date: new Date().toISOString(),
      classification: {
        type: aiResult.type,
        confidence: aiResult.confidence,
        reason: aiResult.reason,
        overridden: false,
        overriddenBy: null,
        previousType: null
      },
      segment: aiResult.type === 'CLIENT_REPLY' ? 'client' : aiResult.type === 'ASSISTANT_REPLY' ? 'assistant' : 'no_reply',
      urgency: aiResult.urgency,
      isRead: false,
      isImportant: aiResult.urgency === 'high' || aiResult.type === 'CLIENT_REPLY',
      isArchived: false,
      status: 'pending',
      clientNotes: null,
      summary: aiResult.summary,
      actionRequired: aiResult.actionRequired,
      actionSummary: aiResult.actionSummary,
      waitingForResponse: false,
      detectedEntities: aiResult.detectedEntities,
      messages: rawEmail.messages,
      draftReply: null
    };

    this.emails.unshift(newEmail);
    this.refreshAccountStats(accountId);
    return newEmail;
  }

  updateEmail(id, updateData) {
    const index = this.emails.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.emails[index] = { ...this.emails[index], ...updateData };
    this.refreshAccountStats(this.emails[index].accountId);
    return this.emails[index];
  }

  overrideClassification(id, newType, reasonOverride = '', overriddenBy = 'assistant') {
    const email = this.getEmailById(id);
    if (!email) return null;

    const previousType = email.classification.type;
    email.classification = {
      type: newType,
      confidence: 1.0,
      reason: reasonOverride || `Manually reclassified as ${newType} by ${overriddenBy}.`,
      overridden: true,
      overriddenBy,
      previousType
    };

    if (newType === 'CLIENT_REPLY') email.segment = 'client';
    else if (newType === 'ASSISTANT_REPLY') email.segment = 'assistant';
    else if (newType === 'NO_REPLY_NEEDED') email.segment = 'no_reply';

    this.refreshAccountStats(email.accountId);
    return email;
  }

  addMessageToThread(emailId, message) {
    const email = this.getEmailById(emailId);
    if (!email) return null;

    const newMsg = {
      id: `msg_${uuidv4().slice(0, 8)}`,
      from: message.from,
      to: message.to,
      timestamp: new Date().toISOString(),
      body: message.body,
      attachments: message.attachments || []
    };

    email.messages.push(newMsg);
    email.date = newMsg.timestamp;
    
    // Status update: if sent by assistant/client, set to waiting for response or replied
    email.status = 'replied';
    email.waitingForResponse = true;

    this.refreshAccountStats(email.accountId);
    return email;
  }

  syncAccount(accountId) {
    const account = this.getAccountById(accountId);
    if (!account) return null;
    account.lastSyncedAt = new Date().toISOString();
    account.status = 'connected';
    this.refreshAccountStats(accountId);
    return account;
  }

  refreshAccountStats(accountId) {
    const account = this.getAccountById(accountId);
    if (!account) return;

    const accountEmails = this.emails.filter(e => e.accountId === accountId && !e.isArchived);
    account.stats = {
      totalEmails: accountEmails.length,
      unreadEmails: accountEmails.filter(e => !e.isRead).length,
      assistantToReply: accountEmails.filter(e => e.classification.type === 'ASSISTANT_REPLY' && e.status !== 'handled').length,
      clientToReply: accountEmails.filter(e => e.classification.type === 'CLIENT_REPLY' && e.status !== 'handled').length,
      noReplyNeeded: accountEmails.filter(e => e.classification.type === 'NO_REPLY_NEEDED').length,
      needsReview: accountEmails.filter(e => e.classification.type === 'NEEDS_REVIEW').length,
    };
  }

  reset() {
    this.accounts = JSON.parse(JSON.stringify(initialAccounts));
    this.emails = JSON.parse(JSON.stringify(initialEmails));
    return { success: true };
  }
}

export const store = new DataStore();
