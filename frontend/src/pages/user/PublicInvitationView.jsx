import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Heart, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  MessageCircle,
  Share2
} from 'lucide-react';

export const PublicInvitationView = () => {
  const { slug } = useParams();
  const toast = useToast();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rsvpForm, setRsvpForm] = useState({
    guestName: '',
    guestPhone: '',
    guestsCount: 2,
    status: 'attending',
    dietaryNotes: 'Pure Vegetarian',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchInvitation = async () => {
    try {
      const res = await api.get(`/invitations/${slug}`);
      if (res.success && res.invitation) {
        setInvitation(res.invitation);
      }
    } catch (err) {
      toast.error('Could not load invitation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitation();
  }, [slug]);

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    if (!rsvpForm.guestName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post(`/invitations/${slug}/rsvp`, rsvpForm);
      if (res.success) {
        setSubmitted(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
        toast.success(res.message);
        fetchInvitation();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit RSVP.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Opening auspicious digital invitation...</p>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-serif">Invitation Card Not Found</h2>
        <p className="text-slate-400 text-sm">This invitation link may have expired or is incorrect.</p>
        <Link to="/" className="inline-block px-4 py-2 rounded-xl bg-saffron-600 text-white text-xs font-semibold">
          Explore UtsavMitra
        </Link>
      </div>
    );
  }

  // Theme styling presets
  const themeClasses = {
    'royal-marigold': 'border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 text-amber-100',
    'rajasthani-regal': 'border-rose-500/50 bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 text-rose-100',
    'modern-glow': 'border-teal-500/50 bg-gradient-to-b from-teal-950/40 via-slate-900 to-slate-950 text-teal-100',
    'bollywood-bash': 'border-purple-500/50 bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950 text-purple-100',
    'college-neon': 'border-cyan-500/50 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 text-cyan-100'
  }[invitation.theme] || 'border-amber-500/50 bg-slate-900 text-slate-100';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Invitation Card */}
      <div className={`rounded-3xl border-2 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-6 ${themeClasses}`}>
        {/* Background Mandala Watermark */}
        <div className="absolute inset-0 bg-mandala-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="text-4xl">🪔</div>
          <div className="text-xs uppercase tracking-widest font-bold text-amber-400">
            ।। श्री गणेशाय नमः ।।
          </div>

          <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
            {invitation.hostName}
          </h2>

          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight leading-tight">
            {invitation.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto italic leading-relaxed">
            "{invitation.customMessage}"
          </p>

          {/* Date, Time & Venue */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-xs">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-left">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Date &amp; Time</div>
                <div className="font-bold text-white mt-0.5">{invitation.eventDate}</div>
                <div className="text-slate-300">{invitation.eventTime}</div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/10 flex items-center gap-3 text-left">
              <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Celebration Venue</div>
                <div className="font-bold text-white mt-0.5 line-clamp-2">{invitation.venue}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>Digital RSVP Submission</span>
          </div>
          <h3 className="text-xl font-bold text-white font-serif">Will You Grace the Occasion?</h3>
          <p className="text-xs text-slate-400">Please confirm your presence to assist with catering and seating arrangements.</p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white font-serif">Dhanyawaad! Your RSVP is Recorded</h4>
            <p className="text-xs text-emerald-300">
              The host family has received your confirmation. We look forward to celebrating together!
            </p>
          </div>
        ) : (
          <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-xl mx-auto text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={rsvpForm.guestName}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestName: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={rsvpForm.guestPhone}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestPhone: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Attendance Status</label>
                <select
                  value={rsvpForm.status}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="attending">Joyfully Attending</option>
                  <option value="declined">Regretfully Declining</option>
                  <option value="tentative">Tentative / To Be Confirmed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Number of Family Members</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rsvpForm.guestsCount}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, guestsCount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Dietary Preference</label>
              <select
                value={rsvpForm.dietaryNotes}
                onChange={(e) => setRsvpForm({ ...rsvpForm, dietaryNotes: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              >
                <option value="Pure Vegetarian">Pure Vegetarian</option>
                <option value="Jain (No Root Veg)">Jain (No Onion / Garlic / Potato)</option>
                <option value="No Special Preference">No Special Preference</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Warm Wishes &amp; Blessings</label>
              <textarea
                rows="2"
                placeholder="Write your wishes for the host and family..."
                value={rsvpForm.message}
                onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting RSVP...' : 'Submit RSVP Response'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Guest Wishes Wall */}
      {invitation.rsvpList && invitation.rsvpList.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Guest Blessings &amp; Confirmations ({invitation.rsvpList.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {invitation.rsvpList.map((r, i) => (
              <div key={i} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{r.guestName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    r.status === 'attending'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {r.status === 'attending' ? `${r.guestsCount} Attending` : 'Declined'}
                  </span>
                </div>
                {r.message && (
                  <p className="text-slate-300 italic text-[11px]">"{r.message}"</p>
                )}
                {r.dietaryNotes && (
                  <div className="text-[10px] text-amber-400/80">Meal: {r.dietaryNotes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
