import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { RazorpayModal } from '../../components/RazorpayModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Share2, 
  User, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        if (res.success && res.event) {
          setEvent(res.event);
          if (res.event.ticketTiers && res.event.ticketTiers.length > 0) {
            setSelectedTier(res.event.ticketTiers[0]);
          }
        }
      } catch (err) {
        toast.error('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
      toast.info('Please sign in or use the 1-click Role Switcher to book tickets.');
      navigate('/login');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (booking) => {
    setIsPaymentModalOpen(false);
    navigate(`/pass/${booking.passId}`);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading auspicious celebration details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white font-serif">Event Not Found</h2>
        <p className="text-slate-400 text-sm">The event you are looking for may have concluded or been removed.</p>
        <Link to="/events" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 text-white font-semibold text-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>
    );
  }

  const totalPrice = (selectedTier ? selectedTier.price : 0) * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link to="/events" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Celebrations</span>
        </Link>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="aspect-[21/9] max-h-[420px] w-full overflow-hidden bg-slate-950">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 relative -mt-20 z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 backdrop-blur-md">
                {event.category}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                {event.city}, {event.state}
              </span>
            </div>

            <button
              onClick={copyShareLink}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Event</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
            {event.title}
          </h1>

          {event.tagline && (
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-3xl">
              {event.tagline}
            </p>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
            <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="p-2 rounded-xl bg-saffron-500/10 text-saffron-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Event Date</div>
                <div className="font-bold text-white">{event.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Timing</div>
                <div className="font-bold text-white">{event.time} - {event.endTime || 'Late'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Venue</div>
                <div className="font-bold text-white truncate max-w-[180px]">{event.venueName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details Left, Ticket Selector Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Details, Highlights, Schedule) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Event */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron-400" />
              About This Celebration
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* Dress code & Venue address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron-400">
                  Recommended Dress Code
                </span>
                <p className="text-xs font-medium text-slate-200 mt-1">
                  {event.dressCode || 'Festive Indian / Smart Ethnic'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                  Full Venue Address
                </span>
                <p className="text-xs font-medium text-slate-200 mt-1">
                  {event.venueAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {event.highlights && event.highlights.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
              <h2 className="text-xl font-bold text-white font-serif">Event Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule / Timeline */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
              <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-400" />
                Schedule &amp; Program Flow
              </h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-saffron-500 ring-4 ring-slate-900" />
                    <div className="flex-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs font-bold text-saffron-400">
                        <span>{item.time}</span>
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">{item.activity}</div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-rose-600 flex items-center justify-center font-bold text-lg text-white">
                {event.organizerName.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-slate-400">Organized by</div>
                <div className="text-sm font-bold text-white">{event.organizerName}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified UtsavMitra Organizer</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 hidden sm:block">
              <span>Contact: {event.organizerEmail || 'Support Desk'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Selection & Razorpay Booking Box */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-saffron-500/30 rounded-3xl p-6 shadow-2xl lg:sticky lg:top-24 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-saffron-400 uppercase tracking-wider">
                <Ticket className="w-4 h-4" />
                Select Ticket Tier
              </div>
              <h3 className="text-lg font-bold text-white font-serif mt-1">Book Official Passes</h3>
            </div>

            {/* Ticket Tier Cards */}
            <div className="space-y-3">
              {(event.ticketTiers || []).map((tier) => {
                const isSelected = selectedTier?.id === tier.id || selectedTier?.name === tier.name;
                return (
                  <div
                    key={tier.id || tier.name}
                    onClick={() => setSelectedTier(tier)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-saffron-500/10 border-saffron-500 shadow-md ring-1 ring-saffron-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-white">{tier.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{tier.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold text-emerald-400">
                          {tier.price === 0 ? 'FREE' : `₹${tier.price.toLocaleString('en-IN')}`}
                        </div>
                        <div className="text-[10px] text-slate-400">per person</div>
                      </div>
                    </div>

                    {tier.perks && tier.perks.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {tier.perks.map((p, pi) => (
                          <span key={pi} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                            &bull; {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-300">Number of Passes</div>
                <div className="text-[10px] text-slate-400">Maximum 10 per transaction</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-base text-white w-4 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Pass Tier</span>
                <span className="text-slate-200">{selectedTier?.name}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Quantity</span>
                <span className="text-slate-200">{quantity}x</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {totalPrice === 0 ? 'FREE PASS' : `₹${totalPrice.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Booking CTA Button */}
            <button
              onClick={handleBookClick}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-saffron-500 via-rose-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white shadow-xl shadow-saffron-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>{totalPrice === 0 ? 'Claim Free Entry Pass' : `Book with Razorpay (₹${totalPrice.toLocaleString('en-IN')})`}</span>
            </button>

            <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes instant Anti-Fraud QR Pass</span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Checkout Modal */}
      <RazorpayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        event={event}
        selectedTier={selectedTier}
        quantity={quantity}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

