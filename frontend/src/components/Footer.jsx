import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, QrCode, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪔</span>
              <span className="text-xl font-bold font-serif bg-gradient-to-r from-saffron-400 to-rose-400 bg-clip-text text-transparent">
                UtsavMitra
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier AI-powered event management platform for traditional weddings, Dandiya nights, college cultural festivals, corporate celebrations, and modern galas.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Smart AI muhurats, budgets & digital invitations</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-3">Event Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/events?category=Wedding" className="hover:text-saffron-400 transition-colors">Royal Weddings & Sangeet</Link></li>
              <li><Link to="/events?category=Cultural+Program" className="hover:text-saffron-400 transition-colors">Navratri Garba & Dandiya</Link></li>
              <li><Link to="/events?category=College+Fest" className="hover:text-saffron-400 transition-colors">Inter-College Youth Fests & Pro-Nites</Link></li>
              <li><Link to="/events?category=Religious" className="hover:text-saffron-400 transition-colors">Phoolon Ki Holi & Vedic Utsav</Link></li>
              <li><Link to="/events?category=Corporate" className="hover:text-saffron-400 transition-colors">Culinary & Music Carnivals</Link></li>
            </ul>
          </div>

          {/* Platform Interfaces */}
          <div>
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-3">4 Interfaces</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-saffron-400 transition-colors">1. User Discovery & Booking</Link></li>
              <li><Link to="/organizer/dashboard" className="hover:text-rose-400 transition-colors">2. Event Organizer Portal</Link></li>
              <li><Link to="/organizer/scanner" className="hover:text-emerald-400 transition-colors">⚡ QR Attendance Verification</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors">3. Admin Central Page</Link></li>
              <li><Link to="/super-admin/dashboard" className="hover:text-amber-400 transition-colors">4. Super Admin Master HQ</Link></li>
            </ul>
          </div>

          {/* Security & Support */}
          <div>
            <h4 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-3">Tech & Trust</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Razorpay Secured Gateway</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <QrCode className="w-4 h-4 text-saffron-400" />
                <span>Anti-Duplicate QR Digital Passes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>24x7 Helpline: 1800 200 8822</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-pink-400" />
                <span>support@utsavmitra.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            &copy; 2026 UtsavMitra Inc. Built with React.js, Node.js, Express.js &amp; MongoDB.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" />
            <span>for Indian Festivals &amp; Celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

