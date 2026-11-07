import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MapPin, Users, Star, IndianRupee, Sparkles, Check, Send, Phone, Mail, Search, X } from 'lucide-react';
import { FALLBACK_VENUES } from '../../data/seedFallback';

export const VenueDiscovery = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [searchExplanation, setSearchExplanation] = useState(null);

  // Inquiry modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [activeVenue, setActiveVenue] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactPhone: user?.phone || '',
    eventType: 'Destination Wedding',
    eventDate: '2026-12-10',
    guestsCount: 400,
    message: 'Looking for a comprehensive banquet quote with 40 luxury rooms.'
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selectedCity !== 'All') query.append('city', selectedCity);
      if (selectedType !== 'All') query.append('type', selectedType);
      if (search.trim()) query.append('search', search.trim());

      const res = await api.get(`/venues?${query.toString()}`);
      if (res && res.success && res.venues) {
        setVenues(res.venues || []);
        setSearchExplanation(res.searchMetadata?.explanation || null);
      } else {
        throw new Error('Venues not returned');
      }
    } catch (err) {
      console.warn('API unreachable, using fallback venues:', err.message);
      let list = FALLBACK_VENUES;
      if (selectedCity !== 'All') list = list.filter(v => (v.city || '').toLowerCase().includes(selectedCity.toLowerCase()));
      if (selectedType !== 'All') list = list.filter(v => (v.type || '').toLowerCase() === selectedType.toLowerCase());
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter(v => (v.name || '').toLowerCase().includes(q) || (v.city || '').toLowerCase().includes(q));
      }
      setVenues(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [selectedCity, selectedType, search]);

  const openInquiry = (venue) => {
    setActiveVenue(venue);
    setInquiryModalOpen(true);
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    if (!activeVenue) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/venues/${activeVenue._id}/inquire`, inquiryForm);
      if (res.success) {
        toast.success(res.message);
        setInquiryModalOpen(false);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVenues = venues;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>India’s Most Celebrated Destinations</span>
        </div>
        <h1 className="text-3xl font-bold text-white font-serif">Royal Venues &amp; Banquet Lawns</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Book authentic heritage fort palaces, 5-star seaside lawns, and state-of-the-art convention halls with direct quote inquiries.
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
              placeholder="Search venues by city, name, or slang (e.g. blr, tmk, gubbi)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* City Selector */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter Venues by City"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Indian Cities</option>
              <option value="Bangalore">Bangalore / Bengaluru</option>
              <option value="Tumkur">Tumkur / Gubbi</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
              <option value="New Delhi">New Delhi NCR</option>
              <option value="Thiruvananthapuram">Kovalam / Kerala</option>
            </select>
          </div>

          {/* Venue Type Selector */}
          <div className="relative">
            <Sparkles className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filter Venues by Venue Type"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="All">All Venue Types</option>
              <option value="Palace / Heritage">Palace / Heritage</option>
              <option value="Lawn / Resort">Lawn / Resort</option>
              <option value="Banquet Hall">Banquet Hall</option>
            </select>
          </div>
        </div>

        {/* Smart Query Interpretation Banner */}
        {searchExplanation && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              <strong>Smart Match:</strong> {searchExplanation}
            </span>
          </div>
        )}

        {/* Quick Slang Pills */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-slate-400 font-medium whitespace-nowrap">Try Slangs:</span>
            {[
              { label: 'blr', hint: 'Bangalore' },
              { label: 'tmk', hint: 'Tumkur' },
              { label: 'gubbi', hint: 'Gubbi' },
              { label: 'del', hint: 'Delhi' },
              { label: 'jai', hint: 'Jaipur' }
            ].map((q) => (
              <button
                key={q.label}
                onClick={() => setSearch(q.label)}
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors border ${
                  search.toLowerCase() === q.label
                    ? 'bg-teal-500 text-slate-950 font-bold border-teal-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {q.label} <span className="opacity-60 text-[10px]">({q.hint})</span>
              </button>
            ))}
          </div>

          {(selectedCity !== 'All' || selectedType !== 'All' || search) && (
            <button
              onClick={() => { setSelectedCity('All'); setSelectedType('All'); setSearch(''); }}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors font-medium ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredVenues.map((ven) => (
            <div key={ven._id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-teal-500/40 transition-all shadow-xl flex flex-col justify-between">
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={ven.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'}
                  alt={ven.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-teal-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                  {ven.type}
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-amber-300 text-xs font-bold border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{ven.rating}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-white font-serif">{ven.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-rose-300">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{ven.city}, {ven.state}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ven.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</span>
                    <div className="font-bold text-white flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-teal-400" />
                      <span>{ven.capacity} Guests</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Tariff (Per Day)</span>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      ₹{ven.pricePerDay.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(ven.amenities || []).slice(0, 3).map((a, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800">
                      &bull; {a}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => openInquiry(ven)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Venue Quote &amp; Dates</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No venues found matching the filters.</p>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModalOpen && activeVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-serif">Inquire with {activeVenue.name}</h3>
                <div className="text-xs text-slate-400">{activeVenue.city} &bull; Capacity: {activeVenue.capacity} Guests</div>
              </div>
              <button onClick={() => setInquiryModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={submitInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={inquiryForm.contactPhone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, contactPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={inquiryForm.eventDate}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, eventDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expected Guests</label>
                  <input
                    type="number"
                    required
                    value={inquiryForm.guestsCount}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, guestsCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Celebration Requirements</label>
                <textarea
                  rows="3"
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all"
              >
                {submitting ? 'Submitting Inquiry...' : 'Send Inquiry to Venue Manager'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

