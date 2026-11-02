import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import { EventCard } from '../../components/EventCard';
import { Search, Filter, Calendar, MapPin, Sparkles, X } from 'lucide-react';

export const ExploreEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const categories = ['All', 'Wedding', 'Cultural Program', 'College Fest', 'Concert', 'Birthday', 'Religious', 'Corporate'];
  const cities = ['All', 'Bangalore', 'Mumbai', 'New Delhi', 'Jaipur', 'Ahmedabad', 'Goa', 'Kolkata', 'Udaipur', 'Mathura'];

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (category !== 'All') query.append('category', category);
      if (city !== 'All') query.append('city', city);
      if (search) query.append('search', search);

      const res = await api.get(`/events?${query.toString()}`);
      if (res.success) {
        setEvents(res.events || []);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, city, search]);

  const resetFilters = () => {
    setCategory('All');
    setCity('All');
    setSearch('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover Traditions &amp; Celebrations</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-serif">Explore Events</h1>
        <p className="text-sm text-slate-400 mt-1">
          Search across royal wedding expos, live concerts, birthday galas, dandiya nights, college youth carnivals, and cultural festivals across India.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by event title, artist, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 transition-colors"
            />
          </div>

          {/* City Selector */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Filter by City"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-saffron-500 transition-colors appearance-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Indian Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by Event Category"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-saffron-500 transition-colors appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick category pills */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-slate-400 font-medium">Quick Pick:</span>
            {categories.slice(1).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  category === c
                    ? 'bg-saffron-500/20 text-saffron-300 border border-saffron-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {(category !== 'All' || city !== 'All' || search) && (
            <button
              onClick={resetFilters}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors font-medium ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Events Results */}
      <div>
        <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
          <span>Found <strong className="text-white">{events.length}</strong> upcoming celebrations</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt._id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-serif">No Events Matched Your Criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, changing the city, or resetting the filter options.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

