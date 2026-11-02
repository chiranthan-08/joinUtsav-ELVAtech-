import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  Download, 
  Printer, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const DigitalPassView = () => {
  const { passId } = useParams();
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPass = async () => {
    try {
      const res = await api.get(`/bookings/pass/${passId}`);
      if (res.success && res.booking) {
        setBooking(res.booking);
        setEvent(res.event);
      }
    } catch (err) {
      toast.error('Could not load digital pass.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPass();
  }, [passId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Rendering digital pass with encrypted QR...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-serif">Pass Not Found</h2>
        <p className="text-slate-400 text-sm">Pass ID #{passId} was not found in our records.</p>
        <Link to="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-semibold text-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const isCheckedIn = booking.attendanceStatus === 'checked_in';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Top back navigation and refresh */}
      <div className="flex items-center justify-between text-xs">
        <Link to="/user/dashboard" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Passes &amp; Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPass}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <RefreshCw className="w-3 h-3 text-saffron-400" />
            <span>Refresh Status</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {/* Printable Festive Ticket Card */}
      <div className="rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl overflow-hidden relative print:bg-white print:text-black print:border-black">
        {/* Festive Golden Top Header */}
        <div className="bg-gradient-to-r from-amber-600 via-saffron-600 to-rose-700 p-6 text-white text-center relative overflow-hidden">
          <div className="text-2xl mb-1">🪔</div>
          <div className="text-xs uppercase tracking-widest font-bold text-amber-200">
            OFFICIAL DIGITAL ENTRY PASS
          </div>
          <h2 className="text-2xl font-black font-serif tracking-tight mt-1">
            UtsavMitra Verification Badge
          </h2>
          <div className="text-xs font-mono font-bold bg-black/30 px-3 py-1 rounded-full inline-block mt-2 tracking-wider border border-white/20">
            PASS ID: {booking.passId}
          </div>
        </div>

        {/* Live Status Banner */}
        <div className={`py-2 px-6 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${
          isCheckedIn
            ? 'bg-emerald-500/20 text-emerald-400 border-b border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-300 border-b border-amber-500/30'
        }`}>
          {isCheckedIn ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ENTRY VERIFIED &bull; GUEST CHECKED IN ON {new Date(booking.checkedInAt).toLocaleTimeString()}</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>VALID TICKET &bull; PRESENT QR CODE AT GATE ENTRANCE</span>
            </>
          )}
        </div>

        {/* Ticket Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Event Title & Venue */}
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">{booking.eventTitle}</h3>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-saffron-400 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                {booking.eventDate}
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="flex items-center gap-1 text-rose-300">
                <MapPin className="w-3.5 h-3.5" />
                {booking.eventVenue}
              </span>
            </div>
          </div>

          {/* QR Code Centerpiece */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-950/70 rounded-2xl border border-slate-800 p-6 space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-xl inline-block border-4 border-saffron-500/50">
              {booking.qrCodeDataUrl ? (
                <img
                  src={booking.qrCodeDataUrl}
                  alt={`QR for ${booking.passId}`}
                  className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-slate-500">
                  <QrCode className="w-24 h-24" />
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-xs font-mono font-bold text-saffron-400">{booking.passId}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Encrypted Anti-Fraud QR Token</div>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium">Guest Name</span>
              <div className="font-bold text-white truncate mt-0.5">{booking.userName}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium">Ticket Tier</span>
              <div className="font-bold text-saffron-400 truncate mt-0.5">{booking.ticketTier}</div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium">Total Passes</span>
              <div className="font-bold text-white mt-0.5">{booking.quantity} Guest(s)</div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium">Amount Paid</span>
              <div className="font-bold text-emerald-400 mt-0.5">
                {booking.totalAmount === 0 ? 'Complimentary' : `₹${booking.totalAmount.toLocaleString('en-IN')}`}
              </div>
            </div>
          </div>

          {/* Verification footer notes */}
          <div className="text-center text-[11px] text-slate-400 space-y-1">
            <div>Payment ID: <span className="font-mono text-slate-300">{booking.razorpayPaymentId || 'Free Ticket'}</span></div>
            <div>Valid with Govt Photo ID at the entry gate. Non-transferable ticket.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
