import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Ticket, 
  QrCode, 
  Calendar, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);

  const handleResendVerification = async () => {
    if (!user?.email) return;
    setResendingEmail(true);
    try {
      const res = await api.post('/auth/resend-verification', { email: user.email });
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch verification email.');
    } finally {
      setResendingEmail(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [bkgRes, invRes] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/invitations/my-invitations')
        ]);
        if (bkgRes.success) setBookings(bkgRes.bookings || []);
        if (invRes.success) setInvitations(invRes.invitations || []);
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* User Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-saffron-950/30 to-slate-900 border border-saffron-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 via-rose-500 to-amber-500 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-saffron-500/20">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 text-[11px] font-semibold mb-1">
              <User className="w-3 h-3" />
              <span>INTERFACE 1: ATTENDEE &amp; USER PORTAL</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">{user?.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.email} &bull; {user?.city || 'Jaipur'} &bull; Role: <span className="text-saffron-400 font-semibold uppercase">{user?.role}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResendVerification}
            disabled={resendingEmail}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-saffron-300 border border-saffron-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Resend verification & welcome email to your registered inbox"
          >
            <Mail className="w-3.5 h-3.5 text-saffron-400" />
            <span>{resendingEmail ? 'Dispatching...' : 'Resend Verification Email'}</span>
          </button>
          <Link
            to="/events"
            className="px-4 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Discover Events</span>
          </Link>
          <Link
            to="/ai-planner"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 font-semibold text-xs transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Planner</span>
          </Link>
        </div>
      </div>

      {/* Bookings & Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <QrCode className="w-5 h-5 text-saffron-400" />
              My Digital Passes &amp; Tickets ({bookings.length})
            </h2>
            <p className="text-xs text-slate-400">All passes include real-time encrypted QR tokens for venue gate entry.</p>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b) => {
              const isCheckedIn = b.attendanceStatus === 'checked_in';
              return (
                <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-saffron-500/40 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-saffron-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {b.passId}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCheckedIn
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isCheckedIn ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isCheckedIn ? 'Checked-In' : 'Pending Entry'}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-white font-serif line-clamp-1">{b.eventTitle}</h3>

                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-saffron-400" />
                        <span>{b.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span className="truncate">{b.eventVenue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 text-slate-300">
                        <Ticket className="w-3.5 h-3.5 text-amber-400" />
                        <span>Tier: <strong className="text-white">{b.ticketTier}</strong> ({b.quantity} seat)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Paid Total</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {b.totalAmount === 0 ? 'Complimentary' : `₹${b.totalAmount.toLocaleString('en-IN')}`}
                      </div>
                    </div>

                    <Link
                      to={`/pass/${b.passId}`}
                      className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">You haven't booked any event passes yet.</p>
            <Link to="/events" className="inline-block px-4 py-2 rounded-xl bg-saffron-600 text-white font-bold text-xs">
              Explore Upcoming Celebrations
            </Link>
          </div>
        )}
      </div>

      {/* Invitations Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" />
              My Digital Invitations ({invitations.length})
            </h2>
            <p className="text-xs text-slate-400">Share your digital wedding &amp; party cards with friends and family.</p>
          </div>
          <Link
            to="/invitations"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Manage Invitations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {invitations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {invitations.map((inv) => (
              <div key={inv._id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white font-serif truncate max-w-[200px]">{inv.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">{inv.eventDate} &bull; {inv.theme}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                    {(inv.rsvpList || []).length} RSVPs Received
                  </div>
                </div>

                <Link
                  to={`/invite/${inv.slug}`}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  title="View Invitation Card"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400 text-center">
            No invitations created yet. Click "Manage Invitations" to publish an e-invite card.
          </div>
        )}
      </div>
    </div>
  );
};

