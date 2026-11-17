/**
 * AI Engine for Humanity AI Email Management
 * Supports both dynamic Google Gemini API calls (if GEMINI_API_KEY is present)
 * and a high-accuracy semantic heuristic classifier & reply generator for zero-config offline execution.
 */

// Heuristic keyword patterns for domain-specific classification
const CLIENT_SIGNALS = [
  'term sheet', 'cap table', 'valuation', 'docusign', 'wire transfer', 'wire release',
  'fund transfer', 'board meeting', 'board approval', 'equity', 'esop', 'series a', 'series b',
  'seed round', 'investor', 'keynote', 'signature required', 'legal agreement', 'nda sign',
  'david, what are your thoughts', 'need your decision', 'your approval', 'confidential',
  'executive compensation', 'merger', 'acquisition', 'contract sign-off', 'lawsuit',
  'settlement', 'audit sign-off', 'hire approval', 'vp of', 'press interview', 'fireside chat'
];

const ASSISTANT_SIGNALS = [
  'reschedule', 'calendar', 'availability', 'schedule a call', 'zoom link', 'meeting invite',
  'headcount', 'catering', 'dietary', 'hotel', 'flight', 'travel booking', 'w-9', 'w9',
  'vendor form', 'ach form', 'invoice attached', 'send the deck', 'forward the presentation',
  'rsvp', 'conference room', 'av setup', 'projector', 'courier', 'shipping address',
  'sarah, please', 'assistant', 'coordinate', 'time slot', 'sync next week', 'push to friday'
];

const NO_REPLY_SIGNALS = [
  'newsletter', 'digest', 'no-reply', 'noreply', 'donotreply', 'receipt', 'invoice paid',
  'auto-paid', 'automatic notification', 'shipping update', 'tracking number', 'security alert',
  'login notification', 'weekly recap', 'monthly statement', 'unsubscribe', 'order confirmed',
  'flight itinerary', 'boarding pass', 'github notification', 'stripe notification', 'aws billing'
];

export const classifyEmailContent = async (emailData) => {
  const { subject = '', sender = {}, messages = [], recipients = [], cc = [] } = emailData;
  const latestMessage = messages[messages.length - 1] || {};
  const fullText = `${subject} ${latestMessage.body || ''} ${sender.name || ''} ${sender.company || ''}`.toLowerCase();

  // If Gemini API Key is configured in environment, attempt live LLM classification
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are an AI Executive Assistant classifier for an elite executive (David Sterling, CEO) and his Executive Assistant (Sarah Jenkins).
Analyze the following email and return a JSON object with:
1. "type": one of ["CLIENT_REPLY", "ASSISTANT_REPLY", "NO_REPLY_NEEDED", "NEEDS_REVIEW"]
2. "confidence": number between 0.60 and 0.99
3. "reason": clear concise explanation (1 sentence) why it is assigned to Client, Assistant, or No Reply
4. "urgency": one of ["high", "medium", "low"]
5. "summary": concise 2-sentence executive summary
6. "actionRequired": boolean
7. "actionSummary": short string describing the required action
8. "detectedEntities": object with dates (array), deadlines (array), amountOrFinance (string or null)

Email Details:
Sender: ${sender.name} (${sender.email}) - ${sender.company || ''}
Subject: ${subject}
Recipients: ${JSON.stringify(recipients)}
CC: ${JSON.stringify(cc)}
Body:
${latestMessage.body}

Return ONLY valid JSON.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            type: parsed.type || 'ASSISTANT_REPLY',
            confidence: parsed.confidence || 0.90,
            reason: parsed.reason || 'AI evaluated the message content and required actions.',
            urgency: parsed.urgency || 'medium',
            summary: parsed.summary || 'Email regarding ' + subject,
            actionRequired: parsed.actionRequired ?? true,
            actionSummary: parsed.actionSummary || 'Review email',
            detectedEntities: parsed.detectedEntities || { dates: [], deadlines: [], amountOrFinance: null }
          };
        }
      }
    } catch (err) {
      console.warn('[AI Engine] Live Gemini API error, falling back to heuristic engine:', err.message);
    }
  }

  // --- Intelligent Heuristic NLP Engine ---
  let clientScore = 0;
  let assistantScore = 0;
  let noReplyScore = 0;

  CLIENT_SIGNALS.forEach(sig => {
    if (fullText.includes(sig)) clientScore += 2;
  });

  ASSISTANT_SIGNALS.forEach(sig => {
    if (fullText.includes(sig)) assistantScore += 2;
  });

  NO_REPLY_SIGNALS.forEach(sig => {
    if (fullText.includes(sig)) noReplyScore += 3;
  });

  // Check sender patterns
  const senderEmail = (sender.email || '').toLowerCase();
  if (senderEmail.includes('no-reply') || senderEmail.includes('noreply') || senderEmail.includes('billing@') || senderEmail.includes('newsletter')) {
    noReplyScore += 5;
  }

  // Check if assistant is explicitly mentioned in body or direct recipient
  if (fullText.includes('sarah') && !fullText.includes('david')) {
    assistantScore += 3;
  }

  // Check financial amount patterns like $140,000 or $3.5M
  const moneyMatch = fullText.match(/\$[\d,]+(\.\d+)?\s*(k|m|million|billion|usd)?/i);
  const moneyFound = moneyMatch ? moneyMatch[0] : null;
  if (moneyFound) {
    clientScore += 2;
  }

  // Determine classification
  let type = 'ASSISTANT_REPLY';
  let confidence = 0.88;
  let reason = '';
  let urgency = 'medium';
  let actionRequired = true;
  let actionSummary = '';

  if (noReplyScore > 3 && noReplyScore > clientScore && noReplyScore > assistantScore) {
    type = 'NO_REPLY_NEEDED';
    confidence = 0.97;
    actionRequired = false;
    urgency = 'low';
    reason = senderEmail.includes('newsletter')
      ? 'Identified as recurring industry newsletter/publication. Informative reading only.'
      : 'Automated notification or transactional receipt. No human follow-up required.';
    actionSummary = 'None (Informational).';
  } else if (clientScore >= 2 && clientScore >= assistantScore) {
    type = 'CLIENT_REPLY';
    confidence = Math.min(0.98, 0.82 + clientScore * 0.04);
    urgency = (fullText.includes('urgent') || fullText.includes('today') || moneyFound) ? 'high' : 'medium';
    actionRequired = true;
    if (moneyFound) {
      reason = `Involves executive financial decision or capital allocation (${moneyFound}) requiring CEO authorization.`;
      actionSummary = `Approve financial transfer or transaction (${moneyFound}).`;
    } else if (fullText.includes('term sheet') || fullText.includes('docusign') || fullText.includes('signature')) {
      reason = 'High-stakes legal or investment documentation requiring CEO digital signature and authorization.';
      actionSummary = 'Review and execute legal agreement.';
    } else if (fullText.includes('keynote') || fullText.includes('speaker')) {
      reason = 'VIP keynote speaking invitation specifically requested for the CEO.';
      actionSummary = 'Decide on keynote speaking invitation.';
    } else {
      reason = 'Contains strategic inquiry requiring the client’s personal decision and direct executive input.';
      actionSummary = 'Review strategic request and formulate client response.';
    }
  } else if (assistantScore >= 2) {
    type = 'ASSISTANT_REPLY';
    confidence = Math.min(0.98, 0.84 + assistantScore * 0.03);
    urgency = fullText.includes('urgent') ? 'high' : 'medium';
    actionRequired = true;
    if (fullText.includes('reschedule') || fullText.includes('calendar') || fullText.includes('zoom')) {
      reason = 'Meeting coordination or calendar rescheduling request. Routinely handled by executive assistant.';
      actionSummary = 'Check David’s calendar and coordinate available times.';
    } else if (fullText.includes('w-9') || fullText.includes('vendor') || fullText.includes('invoice')) {
      reason = 'Administrative vendor onboarding or document dispatch handled by the assistant.';
      actionSummary = 'Send requested documentation to vendor.';
    } else if (fullText.includes('catering') || fullText.includes('headcount') || fullText.includes('hotel')) {
      reason = 'Event logistics and coordination task for assistant administration.';
      actionSummary = 'Confirm event details and submit logistics choices.';
    } else {
      reason = 'Routine operational inquiry suitable for executive assistant delegation.';
      actionSummary = 'Review and respond on behalf of the executive.';
    }
  } else {
    // Ambiguous
    type = 'NEEDS_REVIEW';
    confidence = 0.65;
    urgency = 'medium';
    actionRequired = true;
    reason = 'Mixed or ambiguous intent detected. Requires brief assistant review to assign responsibility.';
    actionSummary = 'Triage email responsibility manually.';
  }

  // Extract dates / deadlines
  const dates = [];
  const dateMatches = fullText.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|next week|\b\d{1,2}:\d{2}\s*(?:am|pm)?|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2})\b/gi);
  if (dateMatches) {
    dateMatches.slice(0, 3).forEach(d => dates.push(d));
  }

  // Meeting proposal detection
  let meetingProposal = null;
  if (fullText.includes('zoom') || fullText.includes('reschedule') || fullText.includes('sync') || fullText.includes('meeting')) {
    meetingProposal = {
      title: subject,
      date: dates[0] || 'Proposed time in email',
      time: dates[1] || 'Flexible',
      locationOrLink: fullText.includes('zoom') ? 'Zoom Meeting' : 'Google Meet',
      status: 'pending'
    };
  }

  return {
    type,
    confidence: Number(confidence.toFixed(2)),
    reason,
    urgency,
    summary: latestMessage.body ? latestMessage.body.slice(0, 180) + '...' : subject,
    actionRequired,
    actionSummary,
    detectedEntities: {
      dates,
      deadlines: fullText.includes('deadline') || fullText.includes('by ') ? dates.slice(-1) : [],
      meetingProposal,
      amountOrFinance: moneyFound,
      urgency
    }
  };
};

export const generateSmartReply = async ({ emailData, tone = 'Professional & Confident', userRole = 'assistant', instructions = '' }) => {
  const { subject, sender, messages = [] } = emailData;
  const latestMessage = messages[messages.length - 1] || {};
  const senderName = sender?.name || 'there';

  // If Gemini API Key is configured, use Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are writing an email response.
Sender: ${senderName} (${sender?.email})
Subject: ${subject}
Context of latest email:
"""
${latestMessage.body}
"""

Tone requested: ${tone}
Sender Persona: ${userRole === 'assistant' ? 'Sarah Jenkins (Executive Assistant to David Sterling, CEO of Apex Labs)' : 'David Sterling (CEO, Apex Labs)'}
Special Instructions: ${instructions || 'Be prompt, clear, courteous, and actionable.'}

Generate:
1. Subject line
2. Email Body text (formatted with appropriate line breaks, greeting, concise body, and professional sign-off).
Do not include markdown ticks, just return the plain email text.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
            body: text.trim(),
            tone,
            generatedAt: new Date().toISOString()
          };
        }
      }
    } catch (e) {
      console.warn('[AI Engine] Live Gemini reply generation fallback:', e.message);
    }
  }

  // Heuristic Smart Reply Generator based on tone & intent
  const isAssistant = userRole === 'assistant';
  let body = '';

  switch (tone) {
    case 'Executive Confident':
    case 'Short & Executive':
      body = `Hi ${senderName.split(' ')[0]},\n\nThank you for the update. I have reviewed this and we are aligned to proceed. Please move forward with the next steps as outlined.\n\nBest,\nDavid Sterling\nCEO, Apex Labs`;
      break;

    case 'Polite Decline':
      body = isAssistant
        ? `Hi ${senderName.split(' ')[0]},\n\nThank you for reaching out. Unfortunately, due to heavy commitments with our product launch, David's calendar cannot accommodate this right now. We truly appreciate the opportunity and will follow up if availability opens up.\n\nBest regards,\nSarah Jenkins\nExecutive Assistant to David Sterling`
        : `Hi ${senderName.split(' ')[0]},\n\nThank you for thinking of me. Unfortunately, I'm fully committed to our current roadmap priorities and won't be able to participate at this time. Wishing you great success with the initiative.\n\nBest,\nDavid Sterling`;
      break;

    case 'Propose Alternative Time':
    case 'Reschedule':
      body = isAssistant
        ? `Hi ${senderName.split(' ')[0]},\n\nThanks for reaching out! David would be glad to sync. He has conflicts on that slot, but how does either Friday at 11:30 AM PST or next Monday at 2:00 PM PST work on your calendar? Let me know and I will send a calendar invite with the Zoom link.\n\nWarmly,\nSarah Jenkins\nExecutive Assistant`
        : `Hi ${senderName.split(' ')[0]},\n\nThanks for following up. That time unfortunately conflicts with a board commitment. I've CC'd Sarah from my office to find an alternative slot that fits both our schedules this week.\n\nBest,\nDavid`;
      break;

    case 'Warm & Accommodating':
      body = isAssistant
        ? `Hi ${senderName.split(' ')[0]},\n\nWe really appreciate you following up! I'm coordinating this for David and will ensure we have all materials and details ready for you shortly. Please don't hesitate to let me know if you need anything else in the meantime.\n\nWarm regards,\nSarah Jenkins`
        : `Hi ${senderName.split(' ')[0]},\n\nThanks so much for reaching out! Looking forward to collaborating on this. Let's make sure the teams connect early next week.\n\nWarmly,\nDavid Sterling`;
      break;

    case 'Professional & Confident':
    default:
      if (emailData.classification?.type === 'CLIENT_REPLY') {
        body = `Hi ${senderName.split(' ')[0]},\n\nThanks for sending this over. I have reviewed the details and everything looks solid. I have noted the upcoming deadline and will ensure our final authorization is completed in time.\n\nBest regards,\nDavid Sterling\nCEO, Apex Labs`;
      } else {
        body = `Hi ${senderName.split(' ')[0]},\n\nThank you for reaching out. I have received your request and am handling this on David's behalf. We will have the requested information over to you by the end of today.\n\nBest,\nSarah Jenkins\nExecutive Assistant to David Sterling`;
      }
      break;
  }

  if (instructions) {
    body += `\n\n[Note: ${instructions}]`;
  }

  return {
    subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
    body,
    tone,
    generatedAt: new Date().toISOString()
  };
};

export const chatWithCopilot = async ({ query, emails = [], accounts = [], activeEmail = null }) => {
  const q = query.toLowerCase();

  // 1. "Show me emails that need my attention" / "needs attention"
  if (q.includes('need') && (q.includes('attention') || q.includes('action') || q.includes('my attention'))) {
    const actionEmails = emails.filter(e => e.actionRequired && e.status !== 'handled');
    return {
      reply: `You have **${actionEmails.length} emails** requiring immediate attention right now:`,
      action: 'FILTER_ACTION_REQUIRED',
      items: actionEmails.map(e => ({
        id: e.id,
        subject: e.subject,
        sender: e.sender.name,
        assignedTo: e.classification.type,
        action: e.actionSummary || 'Action required'
      }))
    };
  }

  // 2. "Which emails require the client's attention?" / "client to reply"
  if (q.includes('client') && (q.includes('attention') || q.includes('require') || q.includes('reply'))) {
    const clientEmails = emails.filter(e => e.classification.type === 'CLIENT_REPLY' && e.status !== 'handled');
    return {
      reply: `There are currently **${clientEmails.length} high-priority emails** awaiting David's (Client) personal decision:`,
      action: 'FILTER_CLIENT_REPLY',
      items: clientEmails.map(e => ({
        id: e.id,
        subject: e.subject,
        sender: `${e.sender.name} (${e.sender.company || 'External'})`,
        reason: e.classification.reason,
        urgency: e.urgency
      }))
    };
  }

  // 3. "What am I waiting for a response on?" / "waiting for response"
  if (q.includes('waiting') || q.includes('pending response') || q.includes('follow-up')) {
    const waitingEmails = emails.filter(e => e.waitingForResponse || e.segment === 'waiting');
    return {
      reply: `You are currently tracking **${waitingEmails.length} outgoing conversations** waiting for external response:`,
      action: 'FILTER_WAITING',
      items: waitingEmails.map(e => ({
        id: e.id,
        subject: e.subject,
        recipient: e.recipients?.[0]?.name || 'Recipient',
        summary: e.actionSummary || e.summary
      }))
    };
  }

  // 4. "Summarize this conversation" / "summarize"
  if (q.includes('summarize') || q.includes('summary')) {
    const target = activeEmail || emails[0];
    if (target) {
      return {
        reply: `**Summary of "${target.subject}"**:\n\n${target.summary}\n\n**Action Item**: ${target.actionSummary || 'No pending action'}\n**Assigned Responsibility**: ${target.classification.type === 'CLIENT_REPLY' ? 'Client (David)' : target.classification.type === 'ASSISTANT_REPLY' ? 'Assistant (Sarah)' : 'No Reply Needed'} (${Math.round(target.classification.confidence * 100)}% AI confidence).`,
        action: 'HIGHLIGHT_EMAIL',
        targetId: target.id
      };
    }
  }

  // 5. "Why has this email been assigned to the client?"
  if (q.includes('why') && (q.includes('assigned') || q.includes('client') || q.includes('reason'))) {
    const target = activeEmail || emails.find(e => e.classification.type === 'CLIENT_REPLY') || emails[0];
    if (target) {
      return {
        reply: `**Why this is classified as ${target.classification.type}**:\n\n${target.classification.reason}\n\n• **Confidence**: ${Math.round(target.classification.confidence * 100)}%\n• **Key Factors**: Extracted entities include ${target.detectedEntities?.amountOrFinance ? 'Capital sum: ' + target.detectedEntities.amountOrFinance : 'Executive signature & high-level authority'}.\n\nYou can override this classification anytime using the one-click selector in the conversation view.`,
        action: 'HIGHLIGHT_EMAIL',
        targetId: target.id
      };
    }
  }

  // 6. "Draft a reply"
  if (q.includes('draft') || q.includes('reply')) {
    const target = activeEmail || emails[0];
    const draft = await generateSmartReply({ emailData: target, tone: 'Professional & Confident', userRole: 'assistant' });
    return {
      reply: `Here is a drafted response for "${target.subject}":\n\n\`\`\`\n${draft.body}\n\`\`\`\n\nYou can insert this draft directly into the reply composer below to review and send.`,
      action: 'INSERT_DRAFT',
      draft
    };
  }

  // 7. General briefing
  const clientCount = emails.filter(e => e.classification.type === 'CLIENT_REPLY' && e.status !== 'handled').length;
  const assistantCount = emails.filter(e => e.classification.type === 'ASSISTANT_REPLY' && e.status !== 'handled').length;
  const waitingCount = emails.filter(e => e.waitingForResponse).length;

  return {
    reply: `Here is your current inbox briefing:\n\n• **${assistantCount} emails** ready for your response (Sarah - Assistant)\n• **${clientCount} emails** pending David's personal decision (Client)\n• **${waitingCount} threads** actively waiting for external replies\n\nAsk me anytime to draft responses, extract upcoming meetings, or search for specific client correspondence!`,
    action: 'NONE'
  };
};
