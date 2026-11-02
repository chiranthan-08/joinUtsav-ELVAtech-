import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Clock, 
  Printer, 
  ArrowLeft, 
  QrCode, 
  ShieldCheck,
  Filter
} from 'lucide-react';

export const ManageAttendees = () => {
  const { id } = useParams();
  const toast = useToast();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchAttendees = async () => {
    try {
      const [attRes, evtRes] = await Promise.all([
        api.get(`/bookings/event/${id}/attendees`),
        api.get(`/events/${id}`)
      ]);
      if (attRes.success) setAttendees(attRes.attendees || []);
      if (evtRes.success) setEvent(evtRes.event);
    } catch (err) {
      toast.error('Failed to load attendees list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const handleManualCheckIn = async (passId) => {
    try {
      const res = await api.post('/bookings/check-in', { passId });
      toast.success(res.message);
      fetchAttendees();
    } catch (err) {
      toast.error(err.message || 'Check-in failed.');
    }
  };

  const filtered = attendees.filter((a) => {
    const matchStatus = statusFilter === 'all' || a.attendanceStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = 
      a.userName.toLowerCase().includes(q) ||
      a.passId.toLowerCase().includes(q) ||
      a.userEmail.toLowerCase().includes(q) ||
      (a.userPhone && a.userPhone.includes(q));
    return matchStatus && matchSearch;
  });

  const checkedInCount = attendees.filter(a => a.attendanceStatus === 'checked_in').length;
  const pendingCount = attendees.length - checkedInCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/organizer/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Organizer Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
            ATTENDANCE REGISTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif mt-1">
            {event?.title || 'Celebration Attendee Roster'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {event?.date} &bull; {event?.venueName}, {event?.city}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/organizer/scanner"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Launch Gate Scanner</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Registered</div>
          <div className="text-2xl font-bold text-white font-serif mt-0.5">{attendees.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Checked-In at Gate</div>
          <div className="text-2xl font-bold text-emerald-400 font-serif mt-0.5">{checkedInCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Pending Entry</div>
          <div className="text-2xl font-bold text-amber-400 font-serif mt-0.5">{pendingCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, pass ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-slate-400">Status:</span>
          {['all', 'checked_in', 'pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Pass ID</th>
                <th className="p-4">Guest Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Tier &amp; Seats</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gate Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length > 0 ? (
                filtered.map((a) => {
                  const isCheckedIn = a.attendanceStatus === 'checked_in';
                  return (
                    <tr key={a._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-saffron-400">
                        {a.passId}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{a.userName}</div>
                        <div className="text-[11px] text-slate-400">{a.userEmail}</div>
                      </td>
                      <td className="p-4 text-slate-300">
                        {a.userPhone || 'Not provided'}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-200">{a.ticketTier}</span>
                        <div className="text-[10px] text-slate-400">{a.quantity} pass(es)</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">
                        {a.totalAmount === 0 ? 'Free' : `₹${a.totalAmount.toLocaleString('en-IN')}`}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isCheckedIn
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isCheckedIn ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{isCheckedIn ? 'Checked-In' : 'Pending'}</span>
                        </span>
                        {isCheckedIn && a.checkedInAt && (
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            {new Date(a.checkedInAt).toLocaleTimeString()}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {!isCheckedIn ? (
                          <button
                            onClick={() => handleManualCheckIn(a.passId)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                          >
                            Mark Check-In
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-semibold">Verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No attendee records matched your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
