import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  CheckCircle2, 
  User, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function MeetingsCalendarView({ 
  emails = [], 
  onSelectEmail 
}) {
  const meetingEmails = emails.filter(e => e.detectedEntities?.meetingProposal !== null);

  return (
    <div className="h-full bg-white p-6 overflow-y-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              AI Calendar Extraction
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            Detected Meetings & Appointments
          </h2>
          <p className="text-xs text-slate-500">
            Automatically identified from incoming conversations, rescheduling requests, and invitations
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
          {meetingEmails.length} Meeting Requests
        </span>
      </div>

      {meetingEmails.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-700">No meeting proposals detected</h4>
          <p className="text-xs text-slate-500">When incoming emails propose calendar times, they appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetingEmails.map((email) => {
            const meeting = email.detectedEntities.meetingProposal;

            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email.id)}
                className="p-5 rounded-2xl border border-slate-200/90 hover:border-indigo-400 bg-white hover:bg-slate-50/50 transition cursor-pointer shadow-xs space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {meeting.title || email.subject}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Requested by: {email.sender.name} ({email.sender.company || 'External'})
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {meeting.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Date & Time:</strong> {meeting.date} at {meeting.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Format:</strong> {meeting.locationOrLink || 'Video Conference'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-400">
                    From thread: {email.subject.slice(0, 35)}...
                  </span>
                  <span className="text-indigo-600 font-bold flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Manage in Thread</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
