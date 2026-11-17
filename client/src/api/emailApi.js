const API_BASE = '/api';

export const emailApi = {
  // Health
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline', aiEngine: 'Local Fallback' };
    }
  },

  // Accounts
  async getAccounts() {
    try {
      const res = await fetch(`${API_BASE}/accounts`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('API error, returning local state:', err);
      return [];
    }
  },

  async connectAccount(accountData) {
    const res = await fetch(`${API_BASE}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountData),
    });
    const data = await res.json();
    return data.data;
  },

  async syncAccount(accountId) {
    const res = await fetch(`${API_BASE}/accounts/${accountId}/sync`, {
      method: 'POST',
    });
    const data = await res.json();
    return data.data;
  },

  // Emails
  async getEmails(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.accountId) query.append('accountId', params.accountId);
      if (params.segment) query.append('segment', params.segment);
      if (params.search) query.append('search', params.search);
      if (params.responsibility) query.append('responsibility', params.responsibility);
      if (params.status) query.append('status', params.status);

      const res = await fetch(`${API_BASE}/emails?${query.toString()}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Failed to fetch emails from API:', err);
      return [];
    }
  },

  async getEmailById(id) {
    const res = await fetch(`${API_BASE}/emails/${id}`);
    const data = await res.json();
    return data.data;
  },

  // Manual Classification Override
  async overrideClassification(emailId, newType, reason = '', overriddenBy = 'assistant') {
    const res = await fetch(`${API_BASE}/emails/${emailId}/classification`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: newType, reason, overriddenBy }),
    });
    const data = await res.json();
    return data.data;
  },

  // Update Status (Handled, Delegate, Star, Read)
  async updateEmailStatus(emailId, updates) {
    const res = await fetch(`${API_BASE}/emails/${emailId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.data;
  },

  // Send Reply message in thread
  async sendMessage(emailId, messageData) {
    const res = await fetch(`${API_BASE}/emails/${emailId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    const data = await res.json();
    return data.data;
  },

  // Live Simulation: trigger new incoming email with AI classification
  async simulateIncomingEmail(simData) {
    const res = await fetch(`${API_BASE}/emails/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simData),
    });
    const data = await res.json();
    return data.data;
  },

  // AI Draft Generation
  async generateAIDraft(emailId, tone = 'Professional & Confident', userRole = 'assistant', instructions = '') {
    const res = await fetch(`${API_BASE}/ai/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId, tone, userRole, instructions }),
    });
    const data = await res.json();
    return data.data;
  },

  // AI Copilot Query
  async queryCopilot(query, activeEmailId = null) {
    const res = await fetch(`${API_BASE}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, activeEmailId }),
    });
    const data = await res.json();
    return data.data;
  },

  // Reset Demo
  async resetDemo() {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    return await res.json();
  }
};
