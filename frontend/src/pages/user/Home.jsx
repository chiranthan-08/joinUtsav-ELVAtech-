import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../../api/client';
import { EventCard } from '../../components/EventCard';
import { 
  Sparkles, 
  Compass, 
  QrCode, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Calendar, 
  ArrowRight,
  Search,
  Music,
  HeartHandshake,
  Users,
  Award,
  Star,
  Flame,
  Clock,
  Ticket,
  PartyPopper,
  Building2,
  CheckCircle2,
  ChevronRight,
  Zap,
  SlidersHorizontal
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [filterType, setFilterType] = useState('all'); // 'all', 'featured', 'fast-selling'

  // Fire celebratory festive confetti
  const triggerFestiveConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#ea580c', '#f43f5e', '#fbbf24', '#f59e0b']
    });
  };

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [eventsRes, venuesRes] = await Promise.allSettled([
          api.get('/events'),
          api.get('/venues')
        ]);

        if (eventsRes.status === 'fulfilled' && eventsRes.value?.success) {
          setEvents(eventsRes.value.events || []);
        }
        if (venuesRes.status === 'fulfilled' && venuesRes.value?.success) {
          setVenues(venuesRes.value.venues?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('Failed loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const categories = [
    { name: 'All', icon: '🪔', label: 'All Celebrations' },
    { name: 'Wedding', icon: '💍', label: 'Royal Weddings' },
    { name: 'Cultural Program', icon: '🪘', label: 'Cultural Galas' },
    { name: 'College Fest', icon: '🎸', label: 'College Fests' },
    { name: 'Concert', icon: '🎤', label: 'Live Concerts' },
    { name: 'Birthday', icon: '🎂', label: 'Grand Birthdays' },
    { name: 'Religious', icon: '🌸', label: 'Sacred Rituals' },
    { name: 'Corporate', icon: '🥂', label: 'Corporate Summits' }
  ];

  const popularCities = ['All', 'Jaipur', 'Mumbai', 'Bengaluru', 'Delhi', 'Udaipur', 'Goa', 'Kolkata'];

  // Filter events based on category, city, and secondary filter
  const filteredEvents = events.filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || (e.city && e.city.toLowerCase().includes(selectedCity.toLowerCase()));
    const matchesFilter = filterType === 'all' 
      ? true 
      : filterType === 'featured' 
        ? e.isFeatured 
        : filterType === 'fast-selling'
          ? (e.ticketTiers && e.ticketTiers.some(t => (t.bookedSeats || 0) > 20))
          : true;
    return matchesCategory && matchesCity && matchesFilter;
  });

  const spotlightEvent = events.find(e => e.isFeatured) || events[0];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* ============================================================== */}
      {/* HERO SECTION                                                   */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-saffron-500/20 via-rose-500/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
        <div className="absolute top-1/3 right-4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle geometric grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          
          {/* Top Announcement Pill */}
          <div className="flex justify-center">
            <button
              onClick={triggerFestiveConfetti}
              className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-saffron-500/40 text-saffron-300 text-xs font-semibold shadow-lg shadow-saffron-500/10 hover:border-saffron-400 hover:scale-105 transition-all backdrop-blur-md cursor-pointer"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-500"></span>
              </span>
              <span>⚡ India's #1 AI-Powered Celebration Engine &amp; Instant QR Ticketing</span>
              <PartyPopper className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          {/* Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-serif leading-[1.15]">
              Where India Celebrates.{' '}
              <span className="bg-gradient-to-r from-saffron-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">
                Utsav
              </span>{' '}
              Perfection Powered by AI.
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              Book verified passes with instant QR delivery to your inbox, explore royal palaces, design interactive digital invites, and plan Muhurat timelines with AI.
            </p>
          </div>

          {/* Smart Hero Search & Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="p-2 sm:p-3 rounded-3xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-saffron-950/30 backdrop-blur-xl space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements.homeSearch?.value.trim();
                  const city = selectedCity !== 'All' ? selectedCity : '';
                  const params = new URLSearchParams();
                  if (input) params.append('search', input);
                  if (city) params.append('city', city);
                  navigate(`/events?${params.toString()}`);
                }}
                className="flex flex-col md:flex-row items-center gap-2"
              >
                {/* Search Text Input */}
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-saffron-400 ml-4 shrink-0" />
                  <input
                    name="homeSearch"
                    type="text"
                    placeholder="Search celebrations, artists, or city slangs (e.g. blr, jaipur, dandiya)..."
                    className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>

                {/* City Dropdown Selector */}
                <div className="w-full md:w-44 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-slate-200 text-xs">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                  >
                    {popularCities.map(c => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c === 'All' ? 'All Cities' : c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-7 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-saffron-500 via-rose-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white shadow-xl shadow-saffron-500/25 hover:shadow-saffron-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Slang quick pills */}
              <div className="flex items-center justify-center gap-2 pt-1 pb-1 text-xs text-slate-400 flex-wrap">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Trending:</span>
                {[
                  { term: 'blr', label: 'Bangalore' },
                  { term: 'jaipur', label: 'Jaipur' },
                  { term: 'tmk', label: 'Tumkur' },
                  { term: 'diwali', label: 'Diwali Carnival' },
                  { term: 'dandiya', label: 'Dandiya Night' },
                  { term: 'wedding', label: 'Royal Wedding' }
                ].map(s => (
                  <button
                    key={s.term}
                    type="button"
                    onClick={() => navigate(`/events?search=${encodeURIComponent(s.term)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-saffron-300 hover:border-saffron-500/50 transition-colors text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>#{s.term}</span>
                    <span className="text-[10px] text-slate-400">({s.label})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/events"
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Browse 17+ Celebrations</span>
            </Link>

            <Link
              to="/ai-planner"
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-rose-500/50 hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Wedding &amp; Event Planner</span>
            </Link>

            <Link
              to="/venues"
              className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-saffron-500/50 hover:scale-105 transition-all flex items-center gap-2 shadow-sm"
            >
              <Building2 className="w-4 h-4 text-rose-400" />
              <span>Royal Heritage Venues</span>
            </Link>
          </div>

          {/* Floating Hero Visual Showcase Cards */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Card 1: Verified QR Pass */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-saffron-500/30 backdrop-blur-md shadow-xl hover:border-saffron-500/60 transition-all flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center text-saffron-400 shrink-0 group-hover:scale-110 transition-transform">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>Encrypted QR Ticketing</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">Verified</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Anti-fraud digital pass delivered instantly to your Gmail inbox with 1-tap gate entry.
                </p>
              </div>
            </div>

            {/* Card 2: AI Muhurat & Budget Engine */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-rose-500/30 backdrop-blur-md shadow-xl hover:border-rose-500/60 transition-all flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>AI Muhurat &amp; Timelines</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 text-[10px] font-semibold border border-amber-500/30">Intelligent</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Auspicious dates, catering budgets, and bilingual invitation poetry generated in seconds.
                </p>
              </div>
            </div>

            {/* Card 3: Royal Venues */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-500/30 backdrop-blur-md shadow-xl hover:border-amber-500/60 transition-all flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <span>Grand Palaces &amp; Lawns</span>
                  <span className="px-1.5 py-0.2 rounded bg-saffron-500/20 text-saffron-400 text-[10px] font-semibold border border-saffron-500/30">Jaipur &bull; Udaipur</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Direct inquiry booking with verified capacities across India's most prestigious properties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PLATFORM STATS STRIP                                           */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-saffron-400 font-serif">50,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1">Happy Attendees</div>
            <div className="text-[11px] text-slate-400">Checked in with zero queue wait</div>
          </div>
          <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 font-serif">1,200+</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1">Grand Celebrations</div>
            <div className="text-[11px] text-slate-400">Weddings, galas &amp; college fests</div>
          </div>
          <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-serif">0.4 sec</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1">QR Scan Verification</div>
            <div className="text-[11px] text-slate-400">Instant anti-passback security</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-serif">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-white mt-1">Direct Cloud Sync</div>
            <div className="text-[11px] text-slate-400">MongoDB Atlas &amp; Gmail active</div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SPOTLIGHT EVENT OF THE MONTH BANNER                             */}
      {/* ============================================================== */}
      {spotlightEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-saffron-500/30 bg-slate-900 shadow-2xl group">
            {/* Background image with gradient scrim */}
            <div className="absolute inset-0">
              <img
                src={spotlightEvent.bannerUrl}
                alt={spotlightEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-12 max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-saffron-500 to-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Spotlight Celebration of the Month
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800/90 text-amber-300 border border-amber-500/30 text-xs font-semibold backdrop-blur-sm">
                  {spotlightEvent.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
                {spotlightEvent.title}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {spotlightEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
                  <Calendar className="w-4 h-4 text-saffron-400" />
                  <span>{spotlightEvent.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>{spotlightEvent.time}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{spotlightEvent.venueName}, {spotlightEvent.city}</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to={`/events/${spotlightEvent._id}`}
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/25 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book VIP Pass &bull; Instant QR</span>
                </Link>

                <Link
                  to="/events"
                  className="px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>Explore All Events</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* BROWSE CELEBRATIONS SECTION WITH DYNAMIC FILTERS               */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Handpicked Celebrations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Discover Trending Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              From Dandiya Rasotsav to royal weddings, secure your passes instantly.
            </p>
          </div>

          {/* Secondary filter pills (All / Featured / Fast Selling) */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setFilterType('featured')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                filterType === 'featured'
                  ? 'bg-saffron-500 text-white shadow-sm shadow-saffron-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </button>
            <button
              onClick={() => setFilterType('fast-selling')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                filterType === 'fast-selling'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Fast Selling</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === c.name
                  ? 'bg-gradient-to-r from-saffron-500 to-rose-600 text-white shadow-lg shadow-saffron-500/25 scale-105'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800/80" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No celebrations match your current filters</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Try switching your category, city filter, or search term to explore other royal galas.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedCity('All'); setFilterType('all'); }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-saffron-400 hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-saffron-400 border border-saffron-500/30 hover:border-saffron-500/60 transition-all shadow-md"
          >
            <span>View All {events.length} Events in Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3-STEP VISUAL EXPERIENCE FLOW                                 */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How UtsavMitra Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Effortless Celebrations in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Built for discerning hosts, cultural societies, and celebratory guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-saffron-500/40 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center text-saffron-400 font-bold text-lg font-serif">
                01
              </div>
              <h3 className="text-base font-bold text-white font-serif">Discover or Plan with AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse handpicked cultural galas or use our AI consultant to calculate auspicious Muhurats, rupee budgets, and catering quotas.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-lg font-serif">
                02
              </div>
              <h3 className="text-base font-bold text-white font-serif">Instant Pass via Gmail</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Secure 1-click booking with Razorpay. Your tamper-proof encrypted QR pass arrives directly in your Gmail inbox in under 3 seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg font-serif">
                03
              </div>
              <h3 className="text-base font-bold text-white font-serif">Tap-and-Scan Entry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Flash your smartphone badge at the gate. Organizers verify passes in 400ms with built-in anti-passback and duplicate prevention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ROYAL HERITAGE VENUES SECTION                                  */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Royal Indian Destinations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              Grand Palaces, Lawns &amp; Luxury Banquets
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verified capacity, transparent pricing, and instant inquiry booking across India.
            </p>
          </div>

          <Link
            to="/venues"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group self-start md:self-auto"
          >
            <span>Explore All Venues</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                  <img
                    src={venue.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-300" />
                    <span>{venue.rating || 4.9}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{venue.city}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {venue.type}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-serif">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {venue.description || 'Stunning heritage property with premier banqueting, curated floral setups, and royal Indian ambiance.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Up to {venue.capacity} Guests</span>
                    </div>
                    <div className="font-bold text-saffron-400">
                      ₹{(venue.pricePerDay / 100000).toFixed(1)} Lakh / day
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to="/venues"
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Inquire Availability</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* DIGITAL INVITATIONS PREVIEW STRIP                              */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/20 p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Interactive Digital Invitations</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
              Say Goodbye to Paper Cards. Send Royal E-Invites.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Design bespoke digital invitations with themes like Royal Marigold and Rajasthani Regal. Collect guest RSVPs, meal preferences, and direct blessings on WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/invitations"
                className="px-6 py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Design an Invitation Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/invite/priya-aarav-royal-wedding-2026"
                className="px-5 py-3 rounded-xl font-semibold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700"
              >
                <span>View Sample Royal Invite</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-4 bg-slate-950/80 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold text-amber-400">Live RSVP Ticker</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-white font-medium">Rajesh &amp; Sunita</span>
                <span className="text-emerald-400 font-semibold text-[11px]">&bull; Attending (4 Guests)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-white font-medium">Vikramaditya Rathore</span>
                <span className="text-emerald-400 font-semibold text-[11px]">&bull; Attending (2 Guests)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-white font-medium">Devika Kulkarni</span>
                <span className="text-emerald-400 font-semibold text-[11px]">&bull; Attending (Jain Meal)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* ORGANIZER CALL TO ACTION BANNER                                */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-saffron-950/60 via-slate-900 to-slate-950 border border-saffron-500/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>For Event Organizers, Colleges &amp; Wedding Hosts</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif max-w-2xl mx-auto leading-tight">
            Host Your Next Celebration with Intelligent Ease
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
            Create custom ticket tiers, verify attendee badges with your phone's camera, broadcast updates to guest emails, and track revenue with zero hassle.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/organizer/dashboard"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Launch an Event Now</span>
            </Link>

            <Link
              to="/organizer/scanner"
              className="px-6 py-3.5 rounded-2xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-rose-400" />
              <span>Open QR Gate Scanner</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Confetti Pill at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={triggerFestiveConfetti}
          className="group px-4 py-2.5 rounded-full bg-gradient-to-r from-saffron-500 to-rose-600 text-white text-xs font-bold shadow-2xl shadow-saffron-500/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
          title="Celebrate with festive confetti!"
        >
          <PartyPopper className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          <span>Celebrate!</span>
        </button>
      </div>
    </div>
  );
};
