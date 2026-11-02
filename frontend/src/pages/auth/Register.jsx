import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserPlus, User, Calendar } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Jaipur',
    role: 'user',
    organization: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (res.success) {
      if (res.user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/user/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-500 via-rose-500 to-amber-500 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-saffron-500/20">
          🪔
        </div>
        <h1 className="text-3xl font-extrabold text-white font-serif">Join UtsavMitra</h1>
        <p className="text-xs text-slate-400">Create an account as an Event Attendee or Event Organizer</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'user' })}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                  form.role === 'user'
                    ? 'border-saffron-500 bg-saffron-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <User className="w-4 h-4 text-saffron-400" />
                <div>
                  <div className="text-xs">Guest / Attendee</div>
                  <div className="text-[10px] text-slate-400">Discover &amp; Book</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'organizer' })}
                className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all ${
                  form.role === 'organizer'
                    ? 'border-rose-500 bg-rose-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                <Calendar className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="text-xs">Event Organizer</div>
                  <div className="text-[10px] text-slate-400">Publish &amp; Track</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rohini Deshmukh"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="rohini@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 00000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Jaipur"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          {form.role === 'organizer' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Organization / Agency Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Rajputana Events &amp; Weddings"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-saffron-500 to-rose-600 hover:from-saffron-600 hover:to-rose-700 text-white shadow-xl shadow-saffron-500/20 text-sm flex items-center justify-center gap-2 transition-all mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{submitting ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered on UtsavMitra?{' '}
          <Link to="/login" className="text-saffron-400 hover:text-saffron-300 font-semibold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

