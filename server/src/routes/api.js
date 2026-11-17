import express from 'express';
import { store } from '../models/store.js';
import { generateSmartReply, chatWithCopilot } from '../services/aiEngine.js';

const router = express.Router();

// Health & System Info
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'Gemini 1.5 Flash (Live)' : 'Heuristic Semantic NLP (High Precision)',
    db: 'In-Memory / Multi-Store Hybrid'
  });
});

// Accounts
router.get('/accounts', (req, res) => {
  const accounts = store.getAccounts();
  res.json({ success: true, data: accounts });
});

router.post('/accounts', (req, res) => {
  const { email, clientName, clientRole, assistantName, provider } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  const account = store.createAccount({ email, clientName, clientRole, assistantName, provider });
  res.status(201).json({ success: true, data: account });
});

router.post('/accounts/:id/sync', (req, res) => {
  const account = store.syncAccount(req.params.id);
  if (!account) return res.status(404).json({ success: false, message: 'Account not found' });
  res.json({ success: true, data: account, message: 'Account synchronized successfully' });
});

// Emails
router.get('/emails', (req, res) => {
  const { accountId, segment, search, responsibility, status, urgency } = req.query;
  const emails = store.getEmails({ accountId, segment, search, responsibility, status, urgency });
  res.json({ success: true, count: emails.length, data: emails });
});

router.get('/emails/:id', (req, res) => {
  const email = store.getEmailById(req.params.id);
  if (!email) return res.status(404).json({ success: false, message: 'Email not found' });
  res.json({ success: true, data: email });
});

// Override AI Classification manually
router.patch('/emails/:id/classification', (req, res) => {
  const { type, reason, overriddenBy = 'assistant' } = req.body;
  if (!type) {
    return res.status(400).json({ success: false, message: 'Classification type is required' });
  }

  const updated = store.overrideClassification(req.params.id, type, reason, overriddenBy);
  if (!updated) return res.status(404).json({ success: false, message: 'Email not found' });

  res.json({ success: true, data: updated, message: `Successfully updated classification to ${type}` });
});

// Update Email Status (Mark Handled, Delegate to Assistant, Star, Archive, Read/Unread)
router.patch('/emails/:id/status', (req, res) => {
  const { status, clientNotes, isRead, isImportant, isArchived } = req.body;
  const updatePayload = {};

  if (status !== undefined) updatePayload.status = status;
  if (clientNotes !== undefined) updatePayload.clientNotes = clientNotes;
  if (isRead !== undefined) updatePayload.isRead = isRead;
  if (isImportant !== undefined) updatePayload.isImportant = isImportant;
  if (isArchived !== undefined) updatePayload.isArchived = isArchived;

  // If client delegates to assistant:
  if (status === 'delegated_to_assistant') {
    updatePayload.classification = {
      type: 'ASSISTANT_REPLY',
      confidence: 1.0,
      reason: `Delegated by Client to Assistant with note: "${clientNotes || 'Please handle this.'}"`,
      overridden: true,
      overriddenBy: 'client',
      previousType: 'CLIENT_REPLY'
    };
    updatePayload.segment = 'assistant';
  }

  const updated = store.updateEmail(req.params.id, updatePayload);
  if (!updated) return res.status(404).json({ success: false, message: 'Email not found' });

  res.json({ success: true, data: updated });
});

// Add message (Send Reply)
router.post('/emails/:id/messages', (req, res) => {
  const { body, from, to } = req.body;
  if (!body) return res.status(400).json({ success: false, message: 'Message body is required' });

  const updated = store.addMessageToThread(req.params.id, {
    body,
    from: from || { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' },
    to: to || [{ name: 'Recipient', email: 'partner@example.com' }]
  });

  if (!updated) return res.status(404).json({ success: false, message: 'Email not found' });
  res.json({ success: true, data: updated });
});

// Simulate Incoming Email (demonstrating live AI classification!)
router.post('/emails/simulate', async (req, res) => {
  const { accountId, subject, senderName, senderEmail, senderCompany, body, recipients, cc } = req.body;

  if (!subject || !body) {
    return res.status(400).json({ success: false, message: 'Subject and body are required' });
  }

  try {
    const newEmail = await store.createSimulatedEmail({
      accountId: accountId || 'acc_1',
      subject,
      senderName,
      senderEmail,
      senderCompany,
      body,
      recipients,
      cc
    });

    res.status(201).json({
      success: true,
      data: newEmail,
      message: `Simulated email classified as ${newEmail.classification.type} (${Math.round(newEmail.classification.confidence * 100)}% confidence)`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// AI Smart Reply Generation
router.post('/ai/draft', async (req, res) => {
  const { emailId, tone, userRole = 'assistant', instructions } = req.body;
  const email = store.getEmailById(emailId);
  if (!email) return res.status(404).json({ success: false, message: 'Email not found' });

  try {
    const draft = await generateSmartReply({
      emailData: email,
      tone: tone || 'Professional & Confident',
      userRole,
      instructions
    });

    res.json({ success: true, data: draft });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// AI Copilot Chat
router.post('/ai/copilot', async (req, res) => {
  const { query, activeEmailId } = req.body;
  if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

  try {
    const emails = store.getEmails({});
    const accounts = store.getAccounts();
    const activeEmail = activeEmailId ? store.getEmailById(activeEmailId) : null;

    const answer = await chatWithCopilot({
      query,
      emails,
      accounts,
      activeEmail
    });

    res.json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reset demo data
router.post('/reset', (req, res) => {
  store.reset();
  res.json({ success: true, message: 'Demo data reset successfully' });
});

export default router;
