import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Shield, 
  Calendar, 
  Ticket, 
  IndianRupee, 
  Users, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Filter, 
  Search, 
  Check, 
  X, 
  Eye, 
  QrCode,
  FileSpreadsheet,
  Mail,
  Send
} from 'lucide-react';
import { 
  FALLBACK_EVENTS, 
  FALLBACK_BOOKINGS, 
  FALLBACK_USERS, 
  FALLBACK_VENUES, 
  FALLBACK_INVITATIONS, 
  FALLBACK_STORE 
} from '../../data/seedFallback';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'bookings', 'users', 'venues', 'emails'
  const [search, setSearch] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/admin/overview');
      if (res && res.success && res.data) {
        setData(res.data);
        return;
      }
      throw new Error('No data returned');
    } catch (err) {
      console.warn('Backend API unreachable, using resilient fallback for Admin Console');
      const fallbackOverview = {
        metrics: {
          totalEvents: FALLBACK_EVENTS.length,
          activeEvents: FALLBACK_EVENTS.filter(e => e.status === 'approved').length,
          pendingEvents: FALLBACK_EVENTS.filter(e => e.status === 'pending').length,
          totalTicketsSold: FALLBACK_BOOKINGS.reduce((sum, b) => sum + (b.quantity || 1), 0),
          totalPlatformRevenue: FALLBACK_BOOKINGS.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          checkedInCount: FALLBACK_BOOKINGS.filter(b => b.attendanceStatus === 'checked_in').length,
          totalUsers: FALLBACK_USERS.filter(u => u.role === 'user').length,
          totalOrganizers: FALLBACK_USERS.filter(u => u.role === 'organizer').length,
          totalVenues: FALLBACK_VENUES.length,
          totalInvitations: (FALLBACK_INVITATIONS || []).length,
          totalEmailsDispatched: (FALLBACK_STORE.emailLogs || []).length
        },
        categoryStats: {},
        allEvents: FALLBACK_EVENTS,
        allBookings: FALLBACK_BOOKINGS,
        allUsers: FALLBACK_USERS,
        allVenues: FALLBACK_VENUES,
        allInvitations: FALLBACK_INVITATIONS || [],
        allEmailLogs: FALLBACK_STORE.emailLogs || [],
        emailProviderStatus: {
          provider: 'gmail_smtp',
          user: 'chiranthansiddu@gmail.com',
          status: 'ACTIVE_READY'
        }
      };
      setData(fallbackOverview);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSendTestEmail = async () => {
    setSendingTestEmail(true);
    try {
      const res = await api.post('/admin/send-test-email', { toEmail: user?.email });
      if (res.success) {
        toast.success(res.message);
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch test verification email.');
    } finally {
      setSendingTestEmail(false);
    }
  };

  const handleUpdateEventStatus = async (id, status, isFeatured) => {
    try {
      const res = await api.patch(`/admin/events/${id}/status`, { status, isFeatured });
      toast.success(res.message);
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update event status.');
    }
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      const res = await api.patch(`/admin/users/${id}/status`, { status });
      toast.success(res.message);
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to update user status.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Aggregating platform database records for Admin Console...</p>
      </div>
    );
  }

  const { metrics, allEvents = [], allBookings = [], allUsers = [], allVenues = [], allEmailLogs = [], emailProviderStatus } = data || {};

  // Extract all inquiries across all venues
  const allInquiries = [];
  allVenues.forEach((v) => {
    (v.inquiries || []).forEach((inq) => {
      allInquiries.push({ ...inq, venueName: v.name, venueCity: v.city });
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-500/20">
            🛡️
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold mb-1">
              <Shield className="w-3 h-3" />
              <span>INTERFACE 3: ADMIN PLATFORM CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Platform Master Administration
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Every event, booking transaction, user, organizer, and venue is aggregated and stored here.
            </p>
          </div>
        </div>

        <div className="text-right text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
          <span className="text-slate-400">Admin Account:</span>
          <div className="font-bold text-white">{user?.name}</div>
          <div className="text-[10px] text-indigo-400 uppercase font-semibold">{user?.role}</div>
        </div>
      </div>

      {/* High-Level Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Events</span>
          <div className="text-2xl font-bold text-white font-serif">{metrics?.totalEvents}</div>
          <div className="text-[10px] text-indigo-400">{metrics?.activeEvents} active</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Passes Sold</span>
          <div className="text-2xl font-bold text-saffron-400 font-serif">{metrics?.totalTicketsSold}</div>
          <div className="text-[10px] text-slate-400">across all tiers</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Platform Revenue</span>
          <div className="text-2xl font-bold text-emerald-400 font-serif">
            ₹{metrics?.totalPlatformRevenue?.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">Razorpay transactions</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Users &amp; Org</span>
          <div className="text-2xl font-bold text-cyan-400 font-serif">
            {(metrics?.totalUsers || 0) + (metrics?.totalOrganizers || 0)}
          </div>
          <div className="text-[10px] text-slate-400">{metrics?.totalOrganizers} organizers</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Listed Venues</span>
          <div className="text-2xl font-bold text-teal-400 font-serif">{metrics?.totalVenues}</div>
          <div className="text-[10px] text-slate-400">{allInquiries.length} inquiries</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Gate Check-Ins</span>
          <div className="text-2xl font-bold text-amber-400 font-serif">{metrics?.checkedInCount}</div>
          <div className="text-[10px] text-slate-400">QR verified</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs no-scrollbar">
        <button
          onClick={() => { setActiveTab('events'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>All Events ({allEvents.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('bookings'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Master Bookings Ledger ({allBookings.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('users'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users &amp; Organizers ({allUsers.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('venues'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'venues'
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Venues &amp; Inquiries ({allVenues.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('emails'); setSearch(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'emails'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>SendGrid Verification Ledger ({allEmailLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL EVENTS MASTER LIST */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white font-serif">Platform Master Events Registry</span>
              <span className="text-slate-400">{allEvents.length} total events organized</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Event Details</th>
                    <th className="p-4">Organizer</th>
                    <th className="p-4">Date &amp; Venue</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Capacity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {allEvents.map((evt) => (
                    <tr key={evt._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-white text-sm line-clamp-1">{evt.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{evt.tagline}</div>
                        {evt.isFeatured && (
                          <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ★ Featured
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-200">{evt.organizerName}</div>
                        <div className="text-[10px] text-slate-400">{evt.organizerEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-saffron-400 font-semibold">{evt.date}</div>
                        <div className="text-[11px] text-slate-300">{evt.venueName}, {evt.city}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                          {evt.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {evt.totalCapacity || 500} seats
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          evt.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : evt.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        {evt.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateEventStatus(evt._id, 'approved', evt.isFeatured)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateEventStatus(evt._id, evt.status, !evt.isFeatured)}
                          className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/30 text-[10px]"
                        >
                          {evt.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        {evt.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateEventStatus(evt._id, 'rejected', false)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 text-[10px]"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER BOOKINGS & TRANSACTIONS LEDGER */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white font-serif">Platform Master Bookings &amp; Payment Ledger</span>
              <span className="text-emerald-400 font-bold">
                Total Transaction Volume: ₹{metrics?.totalPlatformRevenue?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Pass ID</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Customer Name &amp; Contact</th>
                    <th className="p-4">Tier</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment Info</th>
                    <th className="p-4">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {allBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-saffron-400">
                        {b.passId}
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="font-bold text-white truncate">{b.eventTitle}</div>
                        <div className="text-[10px] text-slate-400">{b.eventDate}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-200">{b.userName}</div>
                        <div className="text-[10px] text-slate-400">{b.userEmail} &bull; {b.userPhone}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-300 font-medium">{b.ticketTier}</span>
                        <div className="text-[10px] text-slate-400">{b.quantity} seat(s)</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        {b.totalAmount === 0 ? 'Complimentary' : `₹${b.totalAmount.toLocaleString('en-IN')}`}
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-mono text-slate-300 block">{b.razorpayPaymentId || 'N/A'}</span>
                        <span className="text-[9px] uppercase font-bold text-indigo-400">
                          Mode: {b.paymentMethod || 'razorpay'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.attendanceStatus === 'checked_in'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {b.attendanceStatus === 'checked_in' ? 'Checked-In' : 'Pending Entry'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & ORGANIZERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white font-serif">Platform Registered Users &amp; Organizers</span>
              <span className="text-slate-400">{allUsers.length} total registered accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">City / Org</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {allUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'super_admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : u.role === 'admin'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                            : u.role === 'organizer'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">
                        {u.phone || 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="text-slate-200">{u.city || 'India'}</div>
                        {u.organization && <div className="text-[10px] text-slate-400">{u.organization}</div>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          u.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'super_admin' && u.role !== 'admin' && (
                          <button
                            onClick={() => handleUpdateUserStatus(u._id, u.status === 'active' ? 'suspended' : 'active')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              u.status === 'active'
                                ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VENUES & INQUIRIES */}
      {activeTab === 'venues' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allVenues.map((ven) => (
              <div key={ven._id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white font-serif">{ven.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 uppercase">
                    {ven.type}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {ven.city}, {ven.state} &bull; Capacity: <strong className="text-white">{ven.capacity}</strong>
                </div>
                <div className="text-xs text-emerald-400 font-bold">
                  Tariff: ₹{ven.pricePerDay.toLocaleString('en-IN')} / day
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  Manager: {ven.contactPerson} ({ven.contactPhone})
                </div>
              </div>
            ))}
          </div>

          {/* Inquiries table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 text-xs font-bold text-white font-serif">
              Master Client Inquiries Submitted for Venues ({allInquiries.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Venue</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Occasion &amp; Date</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Client Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allInquiries.map((inq, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-teal-400">{inq.venueName} ({inq.venueCity})</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{inq.userName}</div>
                        <div className="text-[10px] text-slate-400">{inq.userEmail} &bull; {inq.userPhone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-saffron-400 font-semibold">{inq.eventType}</div>
                        <div className="text-[10px] text-slate-400">{inq.eventDate}</div>
                      </td>
                      <td className="p-4 text-slate-200">{inq.guestsCount}</td>
                      <td className="p-4 text-slate-300 italic max-w-xs">{inq.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TRANSACTIONAL VERIFICATION & EMAIL LEDGER */}
      {activeTab === 'emails' && (
        <div className="space-y-6">
          {/* Email Engine Status & Dispatch Controls */}
          <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${emailProviderStatus?.isLive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Transactional Verification Engine &bull; {emailProviderStatus?.activeProvider || 'Gmail SMTP / SendGrid'}
                </span>
                {emailProviderStatus?.isLive && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    LIVE DISPATCH ACTIVE
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white font-serif">
                Automated Multi-Stakeholder Email Dispatcher
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Automatically verifies bookings for attendees, sends booking revenue alerts to organizers, and notifies admins &amp; super admins of platform GMV transactions and new user registrations via Gmail SMTP or SendGrid.
              </p>
            </div>

            <button
              onClick={handleSendTestEmail}
              disabled={sendingTestEmail}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendingTestEmail ? 'Dispatching...' : 'Send Test Verification Email'}</span>
            </button>
          </div>

          {/* Email Ledger Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white font-serif">
                SendGrid Verification &amp; Transaction Ledger ({allEmailLogs.length})
              </span>
              <span className="text-slate-400">Recipient &bull; Subject &bull; Delivery Status</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Notification Type</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Provider &amp; Status</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {allEmailLogs.length > 0 ? (
                    allEmailLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-800/40">
                        <td className="p-4 font-mono font-medium text-slate-200">
                          {log.to}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            log.type.includes('USER')
                              ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/30'
                              : log.type.includes('ORGANIZER')
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {log.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="p-4 text-slate-300 max-w-sm truncate font-medium">
                          {log.subject}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {log.dispatchStatus || 'SENT'} &bull; {log.provider}
                          </span>
                        </td>
                        <td className="p-4 text-right text-slate-400 text-[11px] font-mono whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                        No SendGrid verification emails recorded yet. Book tickets or create an event to see live dispatches here!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

