export const initialAccounts = [
  {
    id: 'acc_1',
    clientName: 'David Sterling',
    clientRole: 'CEO & Co-founder, Apex Labs',
    assistantName: 'Sarah Jenkins',
    email: 'david.sterling@apexlabs.ai',
    provider: 'google',
    providerName: 'Google Workspace',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    autoSync: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    stats: {
      totalEmails: 12,
      unreadEmails: 5,
      assistantToReply: 4,
      clientToReply: 3,
      noReplyNeeded: 4,
      needsReview: 1,
    }
  },
  {
    id: 'acc_2',
    clientName: 'Elena Rostova',
    clientRole: 'Managing Partner, Horizon Ventures',
    assistantName: 'Sarah Jenkins',
    email: 'elena@horizonvc.io',
    provider: 'microsoft',
    providerName: 'Microsoft 365 Outlook',
    status: 'connected',
    lastSyncedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    autoSync: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    stats: {
      totalEmails: 6,
      unreadEmails: 2,
      assistantToReply: 2,
      clientToReply: 2,
      noReplyNeeded: 2,
      needsReview: 0,
    }
  }
];

export const initialEmails = [
  {
    id: 'email_1',
    accountId: 'acc_1',
    threadId: 'th_001',
    subject: 'Series A Term Sheet – Final Sign-off & Cap Table Approval',
    sender: {
      name: 'Sarah Guo',
      email: 'sguo@conviction.vc',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      company: 'Conviction Capital'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    cc: [
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' },
      { name: 'Marcus Vance', email: 'mvance@gunderson.com' }
    ],
    date: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    classification: {
      type: 'CLIENT_REPLY',
      confidence: 0.98,
      reason: 'Contains an investment term sheet requiring the CEO’s legal signature and valuation cap table sign-off before Friday 5 PM PST.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'client',
    urgency: 'high',
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: 'pending', // 'pending' | 'handled' | 'delegated_to_assistant' | 'replied'
    clientNotes: null,
    summary: 'Conviction Capital has countersigned the $18M Series A term sheet. David needs to approve the 12% ESOP pool allocation and provide his final digital signature by Friday 5 PM.',
    actionRequired: true,
    actionSummary: 'Review ESOP pool amendment and sign term sheet before Friday 5 PM PST.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['Friday 5:00 PM PST'],
      deadlines: ['Friday 5:00 PM PST'],
      meetingProposal: null,
      amountOrFinance: '$18M valuation / $3.5M round size',
      urgency: 'high'
    },
    messages: [
      {
        id: 'msg_101',
        from: { name: 'Sarah Guo', email: 'sguo@conviction.vc' },
        to: [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        body: `Hi David,\n\nOur investment committee had our final review this morning, and we are thrilled to formally move forward with the Series A for Apex Labs!\n\nAttached is the revised Term Sheet with the updated 12% unallocated post-money option pool as Marcus negotiated. Everything else reflects our discussed terms ($18M pre-money valuation, $3.5M lead investment from Conviction).\n\nPlease review and let me know if you are comfortable executing the DocuSign link below by Friday 5:00 PM PST so our legal team can start drafting the definitive agreements over the weekend.\n\nCongratulations David, looking forward to building together!\n\nBest,\nSarah Guo\nGeneral Partner | Conviction Capital`,
        attachments: [
          { name: 'Apex_Labs_Series_A_TermSheet_v3.pdf', size: '1.4 MB', type: 'application/pdf' },
          { name: 'Cap_Table_Simulation_Model.xlsx', size: '480 KB', type: 'application/vnd.ms-excel' }
        ]
      }
    ],
    draftReply: {
      tone: 'Executive Confident',
      subject: 'Re: Series A Term Sheet – Final Sign-off & Cap Table Approval',
      body: `Hi Sarah,\n\nThrilled to have Conviction leading the round! I have reviewed the revised option pool terms with Marcus, and everything aligns with our strategy. I'll execute the DocuSign ahead of Friday's deadline.\n\nLooking forward to an exciting journey ahead!\n\nBest regards,\nDavid Sterling\nCEO, Apex Labs`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'email_2',
    accountId: 'acc_1',
    threadId: 'th_002',
    subject: 'Rescheduling Thursday sync + Zoom invite update',
    sender: {
      name: 'Michael Arrington',
      email: 'm.arrington@crunchfund.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      company: 'CrunchFund'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' },
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }
    ],
    cc: [],
    date: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    classification: {
      type: 'ASSISTANT_REPLY',
      confidence: 0.96,
      reason: 'Standard meeting coordination request. Michael needs to move his Thursday 2:00 PM sync to Friday morning or next Monday.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'assistant',
    urgency: 'medium',
    isRead: false,
    isImportant: false,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'Michael Arrington has a board conflict on Thursday at 2:00 PM and requested to reschedule for either Friday at 11:30 AM or Monday afternoon.',
    actionRequired: true,
    actionSummary: 'Check David’s calendar and propose Friday 11:30 AM or Monday 2:00 PM.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['Thursday 2:00 PM', 'Friday 11:30 AM PST', 'Monday 2:00 PM PST'],
      deadlines: [],
      meetingProposal: {
        title: 'Apex Labs & CrunchFund Partnership Sync',
        date: 'This Friday',
        time: '11:30 AM - 12:00 PM PST',
        locationOrLink: 'Zoom (link pending)',
        status: 'pending'
      },
      amountOrFinance: null,
      urgency: 'medium'
    },
    messages: [
      {
        id: 'msg_201',
        from: { name: 'Michael Arrington', email: 'm.arrington@crunchfund.com' },
        to: [
          { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' },
          { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }
        ],
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        body: `Hi David, Sarah,\n\nApologies for the short notice, but an emergency portfolio board meeting was just scheduled over our Thursday 2:00 PM slot.\n\nCould we push our 30-minute sync to either Friday at 11:30 AM PST or anytime Monday afternoon after 2:00 PM? Sarah, please send an updated calendar invite for whatever works best on David's end.\n\nThanks,\nMichael`,
        attachments: []
      }
    ],
    draftReply: {
      tone: 'Professional & Efficient',
      subject: 'Re: Rescheduling Thursday sync + Zoom invite update',
      body: `Hi Michael,\n\nNo problem at all! Friday at 11:30 AM PST works great on David's calendar. I've sent over an updated calendar invite with the Zoom link.\n\nLet me know if you need anything else ahead of the call!\n\nBest,\nSarah Jenkins\nExecutive Assistant to David Sterling`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'email_3',
    accountId: 'acc_1',
    threadId: 'th_003',
    subject: 'Keynote Speaker Invitation: AI Pioneers Summit 2026 (San Francisco)',
    sender: {
      name: 'Jessica Vance',
      email: 'jvance@techsummit.io',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      company: 'AI Pioneers Global'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    cc: [],
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'CLIENT_REPLY',
      confidence: 0.94,
      reason: 'Personal VIP keynote speaking invitation directed specifically to David as CEO, requiring his personal topic approval and travel decision.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'client',
    urgency: 'medium',
    isRead: true,
    isImportant: true,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'Invitation for David to deliver a 25-minute opening keynote at Moscone Center on November 12, 2026. Includes executive VIP travel stipend and fireside panel moderation.',
    actionRequired: true,
    actionSummary: 'Decide whether to accept keynote speaking slot for Nov 12 in San Francisco.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['November 12, 2026'],
      deadlines: ['RSVP by Next Wednesday'],
      meetingProposal: {
        title: 'Opening Keynote: Autonomous Agents in Enterprise',
        date: 'Nov 12, 2026',
        time: '9:30 AM - 10:15 AM PST',
        locationOrLink: 'Moscone Center, SF',
        status: 'pending'
      },
      amountOrFinance: 'VIP honorarium & travel covered',
      urgency: 'medium'
    },
    messages: [
      {
        id: 'msg_301',
        from: { name: 'Jessica Vance', email: 'jvance@techsummit.io' },
        to: [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        body: `Dear David,\n\nOn behalf of the AI Pioneers Summit organizing committee, I would be honored to invite you as our Opening Keynote Speaker for the 2026 Summit at Moscone West in San Francisco on November 12th.\n\nYour work scaling multi-agent architectures at Apex Labs has been remarkable. We have an audience of 3,500+ AI founders, investors, and engineers eager to hear your perspective.\n\nWe provide full executive first-class travel and accommodations. Please let us know if your schedule allows this, or feel free to put me in touch with your team to coordinate.\n\nWarm regards,\nJessica Vance\nChair, AI Pioneers Summit`,
        attachments: [
          { name: 'AI_Pioneers_2026_Speaker_Prospectus.pdf', size: '2.8 MB', type: 'application/pdf' }
        ]
      }
    ],
    draftReply: {
      tone: 'Polite & Gracious',
      subject: 'Re: Keynote Speaker Invitation: AI Pioneers Summit 2026 (San Francisco)',
      body: `Hi Jessica,\n\nThank you for the kind invitation. I would be delighted to deliver the opening keynote at the AI Pioneers Summit this November.\n\nI am looping in Sarah Jenkins from my office (CC'd) who manages my calendar and logistics to finalize details and speaker requirements.\n\nLooking forward to it!\n\nBest,\nDavid Sterling`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'email_4',
    accountId: 'acc_1',
    threadId: 'th_004',
    subject: 'Catering & AV confirmations for Q4 Executive Offsite (Napa Valley)',
    sender: {
      name: 'Chloe Bennett',
      email: 'events@meadowoodresort.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      company: 'Meadowood Napa Valley'
    },
    recipients: [
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }
    ],
    cc: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'ASSISTANT_REPLY',
      confidence: 0.99,
      reason: 'Administrative logistics for upcoming company retreat. Sarah handles all event planning, AV specifications, and dietary requests.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'assistant',
    urgency: 'low',
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'Meadowood Resort requires dietary preferences and AV room setup selections for the executive retreat scheduled on Oct 24-26.',
    actionRequired: true,
    actionSummary: 'Confirm banquet dietary options and projector setup before next Tuesday.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['Oct 24-26', 'Deadline: next Tuesday'],
      deadlines: ['Tuesday 5 PM'],
      meetingProposal: null,
      amountOrFinance: '$8,450 banquet deposit',
      urgency: 'low'
    },
    messages: [
      {
        id: 'msg_401',
        from: { name: 'Chloe Bennett', email: 'events@meadowoodresort.com' },
        to: [{ name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        body: `Hi Sarah,\n\nWe are looking forward to hosting David and the Apex Labs leadership team next month! \n\nCould you please send over the final headcount, dietary restrictions for the private dinner on the 24th, and confirm if you will need the HDMI/wireless dual projector package for the conference room?\n\nThank you!\nChloe`,
        attachments: []
      }
    ],
    draftReply: {
      tone: 'Friendly & Detailed',
      subject: 'Re: Catering & AV confirmations for Q4 Executive Offsite (Napa Valley)',
      body: `Hi Chloe,\n\nThanks for checking in! Our final headcount is 14 attendees. We have two vegetarians and one gluten-free attendee. Please also include the dual wireless projector package for all sessions.\n\nI will send over the credit card authorization form for the deposit by tomorrow afternoon.\n\nWarmly,\nSarah`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'email_5',
    accountId: 'acc_1',
    threadId: 'th_005',
    subject: 'Your AWS Monthly Invoice: $3,412.80 (Auto-Paid)',
    sender: {
      name: 'Amazon Web Services',
      email: 'no-reply-aws-billing@amazon.com',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      company: 'Amazon Web Services'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    cc: [],
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'NO_REPLY_NEEDED',
      confidence: 1.0,
      reason: 'Automated transactional billing notification. Charge has already been processed on the corporate Amex card.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'no_reply',
    urgency: 'low',
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: 'handled',
    clientNotes: null,
    summary: 'AWS monthly infrastructure invoice for $3,412.80 successfully charged to the corporate card ending in 4109.',
    actionRequired: false,
    actionSummary: 'None (Receipt automatically recorded).',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['September Billing Period'],
      deadlines: [],
      meetingProposal: null,
      amountOrFinance: '$3,412.80',
      urgency: 'low'
    },
    messages: [
      {
        id: 'msg_501',
        from: { name: 'Amazon Web Services', email: 'no-reply-aws-billing@amazon.com' },
        to: [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        body: `Hello David Sterling,\n\nThank you for choosing Amazon Web Services. Your invoice for the billing period September 1 - September 30 is now available.\n\nTotal Amount: $3,412.80 USD\nPayment Method: AMEX ending in 4109 (Processed successfully)\n\nYou can download the full PDF breakdown from your AWS Billing Console.\n\nSincerely,\nThe Amazon Web Services Team`,
        attachments: [
          { name: 'AWS_Invoice_982341.pdf', size: '124 KB', type: 'application/pdf' }
        ]
      }
    ],
    draftReply: null
  },
  {
    id: 'email_6',
    accountId: 'acc_1',
    threadId: 'th_006',
    subject: 'Urgent Wire Transfer Approval: GPU Cluster Expansion Tranche 2',
    sender: {
      name: 'Alex Rivera',
      email: 'arivera@apexlabs.ai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      company: 'Apex Labs (VP Eng)'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    cc: [
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' },
      { name: 'accounting@apexlabs.ai', email: 'accounting@apexlabs.ai' }
    ],
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'CLIENT_REPLY',
      confidence: 0.99,
      reason: 'Direct financial authorization for $140,000 capital expenditure wire transfer exceeding assistant approval threshold.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'client',
    urgency: 'high',
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'VP of Engineering requests CEO sign-off to release a $140k wire transfer to Lambda Labs to lock in H100 GPU cluster reservation by 4 PM today.',
    actionRequired: true,
    actionSummary: 'Approve $140k wire release to Lambda Labs before 4 PM today.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['Today before 4:00 PM EST'],
      deadlines: ['Today 4:00 PM EST (Banking cutoff)'],
      meetingProposal: null,
      amountOrFinance: '$140,000.00 USD',
      urgency: 'high'
    },
    messages: [
      {
        id: 'msg_601',
        from: { name: 'Alex Rivera', email: 'arivera@apexlabs.ai' },
        to: [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        body: `David,\n\nLambda Labs just confirmed our 32x H100 SXM5 cluster allocation for the new multi-agent benchmarks. However, the hardware hold expires at 4:00 PM EST today.\n\nCould you please give the green light to Brex/SVB wire #48291 for $140,000 so Accounting can release the funds before banking cutoff?\n\nWire invoice and purchase order attached.\n\nAlex`,
        attachments: [
          { name: 'Lambda_PO_8841.pdf', size: '310 KB', type: 'application/pdf' },
          { name: 'H100_Cluster_Specs.pdf', size: '1.2 MB', type: 'application/pdf' }
        ]
      }
    ],
    draftReply: {
      tone: 'Decisive & Direct',
      subject: 'Re: Urgent Wire Transfer Approval: GPU Cluster Expansion Tranche 2',
      body: `Alex,\n\nApproved. Accounting is authorized to release the $140,000 wire to Lambda Labs immediately. Let's make sure the benchmark scripts are ready to spin up as soon as provisioned.\n\nDavid`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'email_7',
    accountId: 'acc_1',
    threadId: 'th_007',
    subject: 'Vendor Onboarding & W-9: Brand Design Agency (Studio Forma)',
    sender: {
      name: 'Julian Hayes',
      email: 'julian@studioforma.design',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      company: 'Studio Forma'
    },
    recipients: [
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }
    ],
    cc: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    date: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'ASSISTANT_REPLY',
      confidence: 0.97,
      reason: 'Standard administrative document dispatch (W-9 and vendor ACH form) handled directly by the executive assistant.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'assistant',
    urgency: 'medium',
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'Design agency needs Apex Labs’ W-9 and ACH vendor form to kick off brand identity design sprint next week.',
    actionRequired: true,
    actionSummary: 'Send completed W-9 and ACH payment details to Julian.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['Kickoff next Monday'],
      deadlines: ['End of week'],
      meetingProposal: null,
      amountOrFinance: null,
      urgency: 'medium'
    },
    messages: [
      {
        id: 'msg_701',
        from: { name: 'Julian Hayes', email: 'julian@studioforma.design' },
        to: [{ name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        body: `Hi Sarah,\n\nWe are excited to begin our design sprint with David and the team next week!\n\nCould you send us Apex Labs' signed W-9 and your preferred ACH remit email? Once received, we'll send the invitation to our Figma workspace.\n\nBest,\nJulian`,
        attachments: []
      }
    ],
    draftReply: {
      tone: 'Warm & Professional',
      subject: 'Re: Vendor Onboarding & W-9: Brand Design Agency (Studio Forma)',
      body: `Hi Julian,\n\nAttached is our signed 2026 W-9 and ACH remittance instructions. Please use accounting@apexlabs.ai for invoices.\n\nWe look forward to reviewing the Figma workspace on Monday!\n\nBest regards,\nSarah Jenkins`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'email_8',
    accountId: 'acc_1',
    threadId: 'th_008',
    subject: 'Follow-up: IP Assignment & Patent Filing Disclosure (Waiting for Gunderson)',
    sender: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@apexlabs.ai',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
      company: 'Apex Labs'
    },
    recipients: [
      { name: 'Marcus Vance', email: 'mvance@gunderson.com' }
    ],
    cc: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'NO_REPLY_NEEDED',
      confidence: 0.92,
      reason: 'Outbound follow-up sent by assistant. Currently awaiting response from legal counsel Marcus Vance.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'waiting',
    urgency: 'medium',
    isRead: true,
    isImportant: false,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'Sarah sent the finalized patent invention disclosures to legal counsel Marcus Vance. Pending Marcus’s redlines and USPTO filing confirmation.',
    actionRequired: false,
    actionSummary: 'Waiting for response from Marcus Vance (Gunderson Dettmer).',
    waitingForResponse: true,
    detectedEntities: {
      dates: ['Filing target: Oct 30'],
      deadlines: ['Oct 30'],
      meetingProposal: null,
      amountOrFinance: null,
      urgency: 'medium'
    },
    messages: [
      {
        id: 'msg_801',
        from: { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' },
        to: [{ name: 'Marcus Vance', email: 'mvance@gunderson.com' }],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        body: `Hi Marcus,\n\nFollowing up on our call yesterday regarding the agent memory architecture provisional patent. Attached are the signed inventor declarations from David and Dr. Reed.\n\nPlease let us know if anything else is needed before you submit to the USPTO.\n\nThank you,\nSarah`,
        attachments: [
          { name: 'Invention_Declaration_Signed.pdf', size: '890 KB', type: 'application/pdf' }
        ]
      }
    ],
    draftReply: null
  },
  {
    id: 'email_9',
    accountId: 'acc_1',
    threadId: 'th_009',
    subject: 'Lenny’s Newsletter: How top AI startups build product moats',
    sender: {
      name: 'Lenny Rachitsky',
      email: 'newsletter@lennysnewsletter.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      company: 'Lenny’s Newsletter'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    cc: [],
    date: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'NO_REPLY_NEEDED',
      confidence: 1.0,
      reason: 'Weekly industry newsletter publication. Purely informational reading.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'no_reply',
    urgency: 'low',
    isRead: false,
    isImportant: false,
    isArchived: false,
    status: 'handled',
    clientNotes: null,
    summary: 'Weekly deep dive discussing multi-agent systems, defensibility, and proprietary data moats in enterprise SaaS.',
    actionRequired: false,
    actionSummary: 'None (Newsletter).',
    waitingForResponse: false,
    detectedEntities: {
      dates: [],
      deadlines: [],
      meetingProposal: null,
      amountOrFinance: null,
      urgency: 'low'
    },
    messages: [
      {
        id: 'msg_901',
        from: { name: 'Lenny Rachitsky', email: 'newsletter@lennysnewsletter.com' },
        to: [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        body: `Welcome to this week's edition of Lenny's Newsletter!\n\nToday, we explore the question founders ask me most: 'How do you build a real product moat when foundation models are commoditized?'\n\nKey takeaways:\n1. Proprietary workflow embedding\n2. High-frequency user feedback loops\n3. Integrated agentic handoffs\n\nRead the full post on Substack...\n\nCheers,\nLenny`,
        attachments: []
      }
    ],
    draftReply: null
  },
  {
    id: 'email_10',
    accountId: 'acc_1',
    threadId: 'th_010',
    subject: 'Potential Enterprise Pilot: Technical Specs & Security Questionnaire',
    sender: {
      name: 'Robert Chen',
      email: 'rchen@stridesystems.corp',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      company: 'Stride Systems (CIO Office)'
    },
    recipients: [
      { name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }
    ],
    cc: [
      { name: 'Sarah Jenkins', email: 'sarah.jenkins@apexlabs.ai' }
    ],
    date: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
    classification: {
      type: 'NEEDS_REVIEW',
      confidence: 0.68,
      reason: 'Contains both executive pilot terms (pricing decision) and administrative SOC2 security questionnaires. Assistant review suggested to route or split responsibilities.',
      overridden: false,
      overriddenBy: null,
      previousType: null
    },
    segment: 'general',
    urgency: 'medium',
    isRead: false,
    isImportant: true,
    isArchived: false,
    status: 'pending',
    clientNotes: null,
    summary: 'Enterprise prospect requesting custom annual SLA pricing tier and 50-page SOC2 Type II compliance audit packet.',
    actionRequired: true,
    actionSummary: 'Review: Sarah to provide SOC2 packet, David to approve custom pricing discount.',
    waitingForResponse: false,
    detectedEntities: {
      dates: ['Pilot target: Q1 2027'],
      deadlines: ['Next Friday'],
      meetingProposal: null,
      amountOrFinance: '$120,000 ARR potential',
      urgency: 'medium'
    },
    messages: [
      {
        id: 'msg_1001',
        from: { name: 'Robert Chen', email: 'rchen@stridesystems.corp' },
        to: [{ name: 'David Sterling', email: 'david.sterling@apexlabs.ai' }],
        timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(),
        body: `David,\n\nOur executive team was impressed by your demo. We want to move forward with a 500-seat pilot for Stride Systems.\n\nTwo quick items:\n1. Could you confirm if you can do $180/seat/year instead of the list $220?\n2. Can your team complete our standard vendor security questionnaire and attach your SOC2 report?\n\nLooking forward to working together.\n\nBest,\nRobert Chen\nVP Infrastructure, Stride Systems`,
        attachments: [
          { name: 'Stride_Security_Questionnaire_2026.xlsx', size: '640 KB', type: 'application/vnd.ms-excel' }
        ]
      }
    ],
    draftReply: {
      tone: 'Strategic Commercial',
      subject: 'Re: Potential Enterprise Pilot: Technical Specs & Security Questionnaire',
      body: `Hi Robert,\n\nGlad to hear the demo resonated! We can meet you at $195/seat/year for the 500-seat annual commitment. \n\nI have asked Sarah (CC'd) to send over our SOC2 Type II report and pre-filled standard questionnaire today.\n\nBest,\nDavid Sterling`,
      status: 'draft',
      generatedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
    }
  }
];
