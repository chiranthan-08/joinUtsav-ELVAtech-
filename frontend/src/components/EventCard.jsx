import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Sparkles, Users } from 'lucide-react';

export const EventCard = ({ event }) => {
  const minPrice = event.ticketTiers && event.ticketTiers.length > 0
    ? Math.min(...event.ticketTiers.map(t => t.price))
    : 0;

  const categoryColor = {
    Wedding: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'College Fest': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    'Cultural Program': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Religious: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Corporate: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Birthday: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    Concert: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  }[event.category] || 'bg-saffron-500/20 text-saffron-300 border-saffron-500/30';

  // Format date nicely
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-saffron-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-saffron-500/10 flex flex-col h-full">
      {/* Banner with badges */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${categoryColor}`}>
            {event.category}
          </span>
          {event.isFeatured && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-saffron-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{event.city}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-white group-hover:text-saffron-400 transition-colors line-clamp-1 font-serif">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {event.tagline || event.description}
          </p>

          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-400">By:</span>
            <span className="font-medium text-slate-300 truncate">{event.organizerName}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Starting from</div>
            <div className="text-lg font-bold text-emerald-400">
              {minPrice === 0 ? 'FREE ENTRY' : `₹${minPrice.toLocaleString('en-IN')}`}
            </div>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-md shadow-saffron-500/20 group-hover:scale-105 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>View &amp; Book</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
