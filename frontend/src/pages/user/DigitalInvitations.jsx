import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Plus, Sparkles, Share2, Users, Calendar, MapPin, Eye, ExternalLink } from 'lucide-react';

export const DigitalInvitations = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: 'Aarav & Priya’s Royal Sangeet',
    hostName: 'The Sharma & Patel Families',
    eventType: 'Wedding & Sangeet',
    eventDate: '2026-11-28',
    eventTime: '06:30 PM onwards',
    venue: 'Chomu Palace Heritage Courtyard, Jaipur',
    theme: 'royal-marigold',
    customMessage: 'Together with our families, we joyfully invite you to celebrate music, dance, and love.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80'
  });

  const fetchInvitations = async () => {
    try {
      if (user) {
        const res = await api.get('/invitations/my-invitations');
        if (res.success) setInvitations(res.invitations || []);
      }
    } catch (err) {
      console.warn('Failed to load invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        toast.info('Please sign in to create invitations.');
        return;
      }
      const res = await api.post('/invitations', form);
      if (res.success) {
        toast.success('Digital Invitation created! Share your link.');
        setShowCreateModal(false);
        fetchInvitations();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create invitation.');
    }
  };

  const copyInviteLink = (slug) => {
    const url = `${window.location.origin}/invite/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Invitation link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Digital Festive E-Invites &amp; RSVPs</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-serif">Digital Invitations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Design elegant paperless invitations with automated RSVP guest tracking, meal preferences, and blessings.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/20 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New E-Invite</span>
        </button>
      </div>

      {/* Invitations Grid */}
      {invitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => {
            const confirmedCount = (inv.rsvpList || []).filter(r => r.status === 'attending').length;
            const totalGuestsCount = (inv.rsvpList || []).reduce((sum, r) => sum + (r.guestsCount || 1), 0);

            return (
              <div key={inv._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between">
                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                  <img
                    src={inv.coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80'}
                    alt={inv.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                    {inv.theme}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-white font-serif">{inv.title}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-saffron-400" />
                      <span>{inv.eventDate} ({inv.eventTime})</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">{inv.venue}</span>
                    </div>
                  </div>

                  {/* RSVP counter */}
                  <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      RSVPs Received:
                    </span>
                    <span className="font-bold text-emerald-400">
                      {confirmedCount} Confirmed ({totalGuestsCount} Guests)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => copyInviteLink(inv.slug)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </button>

                    <Link
                      to={`/invite/${inv.slug}`}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview Card</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Mail className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-serif">No Digital Invitations Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first festive digital invitation card and collect RSVPs with custom guest messages.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invitation Now</span>
          </button>
        </div>
      )}

      {/* Modal: Create Invitation */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-serif">Create Digital E-Invite</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-xs">
                Close
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Invitation Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Host Family Name</label>
                  <input
                    type="text"
                    required
                    value={form.hostName}
                    onChange={(e) => setForm({ ...form, hostName: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Type</label>
                  <input
                    type="text"
                    required
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={form.eventTime}
                    onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Venue Address</label>
                <input
                  type="text"
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Theme Style</label>
                <select
                  value={form.theme}
                  onChange={(e) => setForm({ ...form, theme: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="royal-marigold">Royal Marigold &amp; Saffron (Traditional Wedding)</option>
                  <option value="rajasthani-regal">Rajasthani Regal Crimson &amp; Gold</option>
                  <option value="modern-glow">Modern Glow Starlight (Cocktail &amp; Reception)</option>
                  <option value="bollywood-bash">Bollywood Bash &amp; Sangeet</option>
                  <option value="college-neon">College Fest Cyber Neon</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Special Message for Guests</label>
                <textarea
                  rows="3"
                  value={form.customMessage}
                  onChange={(e) => setForm({ ...form, customMessage: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all"
              >
                Publish Digital Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

