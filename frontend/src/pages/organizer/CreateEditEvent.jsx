import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Image as ImageIcon 
} from 'lucide-react';

const PRESET_BANNERS = [
  { label: 'Royal Wedding', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80' },
  { label: 'Navratri Garba', url: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=1200&q=80' },
  { label: 'College Pro-Nite', url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80' },
  { label: 'Phoolon Ki Holi', url: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?w=1200&q=80' },
  { label: 'Culinary Carnival', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80' }
];

export const CreateEditEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Wedding',
    date: '2026-12-15',
    time: '06:00 PM',
    endDate: '2026-12-15',
    endTime: '11:30 PM',
    venueName: '',
    venueAddress: '',
    city: user?.city || 'Jaipur',
    state: 'Rajasthan',
    bannerUrl: PRESET_BANNERS[0].url,
    dressCode: 'Royal Ethnic / Festive Indian',
    totalCapacity: 500,
    ticketTiers: [
      {
        id: 'tier_free',
        name: 'General Admission',
        price: 0,
        totalSeats: 300,
        bookedSeats: 0,
        description: 'Complimentary visitor pass for open exhibition & stalls',
        perks: ['Free Entry', 'Welcome Refreshment']
      },
      {
        id: 'tier_vip',
        name: 'VIP Shahi Pass',
        price: 1499,
        totalSeats: 100,
        bookedSeats: 0,
        description: 'Front stage seating, royal dinner buffet & gift hamper',
        perks: ['VIP Reserved Row', 'Dinner Buffet Included', 'Express QR Lane']
      }
    ]
  });

  const handleAddTier = () => {
    const newTier = {
      id: 'tier_' + Date.now(),
      name: 'Standard Ticket',
      price: 499,
      totalSeats: 150,
      bookedSeats: 0,
      description: 'Standard access with all performances',
      perks: ['General Access', 'Goodie Kit']
    };
    setForm({ ...form, ticketTiers: [...form.ticketTiers, newTier] });
  };

  const handleRemoveTier = (index) => {
    if (form.ticketTiers.length === 1) {
      toast.error('Event must have at least one ticket tier.');
      return;
    }
    const updated = form.ticketTiers.filter((_, i) => i !== index);
    setForm({ ...form, ticketTiers: updated });
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...form.ticketTiers];
    updated[index][field] = value;
    setForm({ ...form, ticketTiers: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.venueName || !form.city) {
      toast.error('Please fill in all mandatory event fields.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/events', form);
      if (res.success) {
        toast.success('Celebration event published successfully!');
        navigate('/organizer/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <Link to="/organizer/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Organizer Desk</span>
        </Link>
        <h1 className="text-3xl font-bold text-white font-serif">Publish New Celebration</h1>
        <p className="text-xs text-slate-400 mt-1">Configure multi-tier tickets, venue schedules, and attendance capacity.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Core Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white font-serif border-b border-slate-800 pb-2">
            1. Event Identity &amp; Overview
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Marwar Sangeet &amp; Sufi Night"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tagline / Subheading</label>
                <input
                  type="text"
                  placeholder="e.g. An Evening of Royal Hospitality &amp; Folk Rhythms"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Celebration Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="Wedding">Royal Wedding &amp; Sangeet</option>
                  <option value="Cultural Program">Cultural Program &amp; Dandiya</option>
                  <option value="College Fest">College Cultural &amp; Tech Fest</option>
                  <option value="Religious">Religious &amp; Temple Mahotsav</option>
                  <option value="Corporate">Corporate &amp; Lifestyle Gala</option>
                  <option value="Concert">Music Concert / EDM</option>
                  <option value="Birthday">Grand Birthday Celebration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Description *</label>
              <textarea
                rows="4"
                required
                placeholder="Describe the artists, ceremonies, culinary offerings, and highlights..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>

            {/* Banner Presets */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cover Banner URL</label>
              <input
                type="url"
                required
                value={form.bannerUrl}
                onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none mb-2"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Quick Indian Presets:</span>
                {PRESET_BANNERS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setForm({ ...form, bannerUrl: p.url })}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Date, Venue & Capacity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white font-serif border-b border-slate-800 pb-2">
            2. Date, Timings &amp; Venue
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Time *</label>
              <input
                type="text"
                required
                placeholder="e.g. 05:30 PM"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Venue Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chomu Palace Heritage Lawn"
                value={form.venueName}
                onChange={(e) => setForm({ ...form, venueName: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Host City *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jaipur"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Venue Address</label>
              <input
                type="text"
                placeholder="e.g. Sikar Road, Chomu, Rajasthan"
                value={form.venueAddress}
                onChange={(e) => setForm({ ...form, venueAddress: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Total Venue Capacity (Persons)</label>
              <input
                type="number"
                min="50"
                max="50000"
                value={form.totalCapacity}
                onChange={(e) => setForm({ ...form, totalCapacity: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Multi-Tier Tickets */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-base font-bold text-white font-serif">
              3. Multi-Tier Passes &amp; Pricing
            </h2>
            <button
              type="button"
              onClick={handleAddTier}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Tier</span>
            </button>
          </div>

          <div className="space-y-4">
            {form.ticketTiers.map((tier, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Tier #{idx + 1}</span>
                  {form.ticketTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Tier Name</label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Price (₹ INR - 0 for Free)</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={tier.price}
                      onChange={(e) => handleTierChange(idx, 'price', Number(e.target.value))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Available Seats</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={tier.totalSeats}
                      onChange={(e) => handleTierChange(idx, 'totalSeats', Number(e.target.value))}
                      className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Tier Benefits / Description</label>
                  <input
                    type="text"
                    value={tier.description}
                    onChange={(e) => handleTierChange(idx, 'description', e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
        >
          {submitting ? 'Publishing Event...' : 'Publish Celebration to UtsavMitra'}
        </button>
      </form>
    </div>
  );
};

