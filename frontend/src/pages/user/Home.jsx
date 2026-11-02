import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Award
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.get('/events');
        if (data.success) {
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    { name: 'All', icon: '🪔' },
    { name: 'Wedding', icon: '💍' },
    { name: 'Cultural Program', icon: '🪘' },
    { name: 'College Fest', icon: '🎸' },
    { name: 'Concert', icon: '🎤' },
    { name: 'Birthday', icon: '🎂' },
    { name: 'Religious', icon: '🌸' },
    { name: 'Corporate', icon: '🥂' }
  ];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 text-xs font-semibold shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Event Management Platform for Indian Celebrations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-serif max-w-4xl mx-auto leading-tight">
            Celebrate Every <span className="bg-gradient-to-r from-saffron-400 via-rose-400 to-amber-300 bg-clip-text text-transparent">Utsav</span> with Intelligent Perfection
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            From regal Rajasthani weddings and Navratri Dandiya nights to mega college fests and cultural galas. Discover events, generate instant QR passes, plan with AI, and manage attendance seamlessly.
          </p>

          {/* Smart Hero Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.homeSearch?.value.trim();
                if (input) navigate(`/events?search=${encodeURIComponent(input)}`);
                else navigate('/events');
              }}
              className="relative flex items-center shadow-2xl rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 backdrop-blur-md group hover:border-saffron-500/50 transition-colors"
            >
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0 group-focus-within:text-saffron-400" />
              <input
                name="homeSearch"
                type="text"
                placeholder="Search celebrations, cities or slangs (e.g. blr, tmk, gubbi, kokothe)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-saffron-500 to-rose-500 hover:from-saffron-600 hover:to-rose-600 text-white shrink-0 shadow-md shadow-saffron-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-slate-400 flex-wrap">
              <span className="font-medium text-slate-400">Quick Slangs:</span>
              {[
                { term: 'blr', label: 'Bangalore' },
                { term: 'tmk', label: 'Tumkur' },
                { term: 'gubbi', label: 'Gubbi' },
                { term: 'kokothe', label: 'Kolkata' },
                { term: 'Concert', label: 'Concerts' }
              ].map(s => (
                <Link
                  key={s.term}
                  to={`/events?search=${encodeURIComponent(s.term)}`}
                  className="px-2 py-0.5 rounded-md bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-saffron-300 hover:border-saffron-500/40 transition-colors font-mono"
                >
                  {s.term} <span className="opacity-60 text-[10px]">({s.label})</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/events"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-saffron-500 via-rose-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white shadow-xl shadow-saffron-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Events</span>
            </Link>

            <Link
              to="/ai-planner"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-rose-500/40 transition-all flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>AI Event Planner</span>
            </Link>

            <Link
              to="/organizer/dashboard"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/30 hover:border-rose-500/60 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>Organizer Portal</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-saffron-400 font-serif">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Encrypted QR Tickets</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-rose-400 font-serif">Instant</div>
              <div className="text-xs text-slate-400 mt-0.5">Razorpay Payments</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-400 font-serif">AI Powered</div>
              <div className="text-xs text-slate-400 mt-0.5">Budgets &amp; Timelines</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-400 font-serif">4 Roles</div>
              <div className="text-xs text-slate-400 mt-0.5">Dedicated Interfaces</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-serif flex items-center gap-2">
              <span>Featured Celebrations</span>
              <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 border border-saffron-500/30">
                Discover
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Browse trending cultural programs, royal weddings &amp; college festivals</p>
          </div>

          <Link to="/events" className="text-xs font-semibold text-saffron-400 hover:text-saffron-300 flex items-center gap-1 group">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.name
                  ? 'bg-gradient-to-r from-saffron-500 to-rose-600 text-white shadow-md shadow-saffron-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No events found in this category.</p>
          </div>
        )}
      </section>

      {/* Feature Showcase: AI & Attendance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-saffron-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-saffron-500/10 border border-saffron-500/30 flex items-center justify-center text-saffron-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">AI Event Consultant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plan Indian weddings and cultural events with AI. Get auspicious muhurat timelines, rupee budget breakdowns (catering, decor, music), and bilingual invitation poetry.
            </p>
            <Link to="/ai-planner" className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-400 hover:text-saffron-300">
              Try AI Planner <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-rose-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">QR Ticketing &amp; Check-In</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every booking generates a unique encrypted QR pass. Organizers can scan guest badges in real-time with anti-duplicate fraud protection.
            </p>
            <Link to="/organizer/scanner" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300">
              Open QR Scanner <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Digital E-Invites &amp; RSVPs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Design exquisite digital invitations with themes like Royal Marigold and Rajasthani Regal. Guests can RSVP with meal preferences and direct blessings.
            </p>
            <Link to="/invitations" className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300">
              Create E-Invite <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner for Venues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/20 p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Royal Indian Heritage Venues</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Discover Grand Palaces, Seaside Lawns &amp; Luxury Banquets
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore handpicked venues across Jaipur, Udaipur, Mumbai, Delhi, and Bengaluru with verified capacity, amenities, and direct inquiry booking.
            </p>
            <div>
              <Link
                to="/venues"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 inline-flex items-center gap-2 transition-all"
              >
                <span>Browse Venues</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shrink-0">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"
              alt="Jaipur Palace Venue"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

