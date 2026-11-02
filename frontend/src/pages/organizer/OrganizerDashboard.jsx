import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Calendar, 
  QrCode, 
  Ticket, 
  IndianRupee, 
  Users, 
  Plus, 
  Clock, 
  Eye, 
  CheckCircle2, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Trash2,
  Edit
} from 'lucide-react';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    totalAttendeesCheckedIn: 0,
    totalPendingCheckIns: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchOrganizerData = async () => {
    try {
      const res = await api.get('/events/organizer/my-events');
      if (res.success) {
        setEvents(res.events || []);
        if (res.metrics) setMetrics(res.metrics);
      }
    } catch (err) {
      console.warn('Organizer data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel and delete "${title}"?`)) return;
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.success) {
        toast.success('Event deleted successfully.');
        fetchOrganizerData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete event.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Organizer Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-rose-500/20">
            🎪
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-semibold mb-1">
              <Calendar className="w-3 h-3" />
              <span>INTERFACE 2: EVENT ORGANIZER PORTAL</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">
              {user?.organization || `${user?.name}'s Event Hub`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage ticket tiers, sales analytics &amp; gate check-in attendance verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/organizer/events/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </Link>

          <Link
            to="/organizer/scanner"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch QR Scanner</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Events</span>
            <Calendar className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif">{metrics.totalEvents}</div>
          <div className="text-[11px] text-slate-400">Active platform celebrations</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Tickets Sold</span>
            <Ticket className="w-4 h-4 text-saffron-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-saffron-400 font-serif">{metrics.totalTicketsSold}</div>
          <div className="text-[11px] text-slate-400">Total registered passes</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Processed via Razorpay</div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gate Check-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-serif">
            {metrics.totalAttendeesCheckedIn}
          </div>
          <div className="text-[11px] text-slate-400">
            {metrics.totalPendingCheckIns} pending at gate
          </div>
        </div>
      </div>

      {/* Organizer's Events List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" />
            Your Organized Celebrations ({events.length})
          </h2>
          <Link
            to="/organizer/events/new"
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>Add Event</span>
            <Plus className="w-3.5 h-3.5" />
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => {
              const totalCapacity = evt.totalCapacity || 500;
              const bookedTotal = (evt.ticketTiers || []).reduce((acc, t) => acc + (t.bookedSeats || 0), 0);
              const fillPercentage = Math.min(100, Math.round((bookedTotal / totalCapacity) * 100));

              return (
                <div key={evt._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-rose-500/40 transition-all">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                          {evt.category}
                        </span>
                        <h3 className="font-bold text-lg text-white font-serif mt-1">{evt.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1 text-saffron-400">
                            <Calendar className="w-3.5 h-3.5" />
                            {evt.date} ({evt.time})
                          </span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            {evt.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteEvent(evt._id, evt.title)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacity Occupancy</span>
                        <span className="font-bold text-white">{bookedTotal} / {totalCapacity} Booked ({fillPercentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <Link
                      to={`/organizer/events/${evt._id}/attendees`}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-rose-400" />
                      <span>Guest Roster &amp; Attendance</span>
                    </Link>

                    <Link
                      to={`/events/${evt._id}`}
                      className="px-3.5 py-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Public Page</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">You haven't posted any events yet.</p>
            <Link
              to="/organizer/events/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
