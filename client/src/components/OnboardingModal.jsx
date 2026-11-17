import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Coffee, 
  ArrowRight, 
  CheckCircle2, 
  Inbox,
  ShieldAlert,
  Zap,
  Check
} from 'lucide-react';

const SLIDES = [
  {
    title: 'The Challenge in Executive Inboxes',
    subtitle: 'Who is actually responsible for responding?',
    badge: 'The Problem',
    content: `Personal assistants manage heavy email volumes across multiple clients. A recurring bottleneck is determining whether the client intends to reply personally (e.g. term sheets, capital approvals) or expects the assistant to coordinate (e.g. rescheduling, vendor paperwork). Without clear visibility, important conversations get stalled.`,
    bullets: [
      'Executives read emails without indicating who should follow up',
      'Assistants waste hours double-checking ownership of every message',
      'High-priority investor and business decisions risk falling through cracks'
    ],
    icon: Inbox,
    color: 'text-amber-600 bg-amber-50'
  },
  {
    title: 'Automatic AI Reply Responsibility',
    subtitle: 'Zero-touch classification powered by AI',
    badge: 'The AI Solution',
    content: `Humanity AI reads full conversation threads, extracts deadlines and financial amounts, and classifies each email into three clear responsibilities:`,
    bullets: [
      '🤖 Assistant to Reply: Calendar coordination, RSVP, logistics, and vendor follow-ups',
      '👔 Client to Reply: Legal term sheets, wire authorizations, VIP invitations, board approvals',
      '☕ No Reply Needed: Newsletters, receipts, automated updates, and resolved threads'
    ],
    icon: Bot,
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    title: 'Dual Connected Experience',
    subtitle: 'Tailored for both Assistant and Client workflows',
    badge: 'The Product Experience',
    content: `Two synchronized views designed for two distinct personas:`,
    bullets: [
      'Comprehensive Assistant Hub: Full metrics overview, conversation history, AI draft generation, and 1-click manual overrides',
      'Executive Minimalist Client View: Clean, distraction-free queue showing David only the emails that require his direct sign-off',
      'Instant Bidirectional Sync: When the client marks an email handled or delegates to Sarah, the dashboard updates in real time'
    ],
    icon: Sparkles,
    color: 'text-purple-600 bg-purple-50'
  }
];

export default function OnboardingModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {slide.badge}
            </span>
            <span className="text-xs text-slate-400">Step {currentSlide + 1} of {SLIDES.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-12 h-12 rounded-2xl ${slide.color} flex items-center justify-center shadow-xs shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {slide.title}
              </h2>
              <p className="text-xs text-slate-500">{slide.subtitle}</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            {slide.content}
          </p>

          <div className="space-y-2.5 pt-2">
            {slide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-2 pt-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === i ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5"
          >
            Skip Tour
          </button>

          <div className="flex items-center space-x-2">
            {currentSlide > 0 && (
              <button
                onClick={() => setCurrentSlide(currentSlide - 1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition"
            >
              <span>{currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
