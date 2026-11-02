import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, Sparkles, X } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const RazorpayModal = ({ isOpen, onClose, event, selectedTier, quantity, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay_upi');
  const toast = useToast();

  if (!isOpen || !event || !selectedTier) return null;

  const totalAmount = selectedTier.price * quantity;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#e11d48', '#10b981', '#6366f1']
      });
    } catch (e) {}
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Create simulated or real Razorpay booking
      const generatedRzpId = 'pay_RZP_' + Math.random().toString(36).substring(2, 10).toUpperCase();

      const res = await api.post('/bookings', {
        eventId: event._id,
        ticketTier: selectedTier.name,
        ticketTierId: selectedTier.id,
        quantity,
        paymentMethod: totalAmount === 0 ? 'free' : paymentMethod,
        paymentId: generatedRzpId
      });

      if (res.success && res.booking) {
        triggerCelebration();
        toast.success(`Booking Confirmed! Pass ID: ${res.booking.passId}`);
        onSuccess(res.booking);
      } else {
        toast.error('Booking transaction could not be processed.');
      }
    } catch (err) {
      toast.error(err.message || 'Payment failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        {/* Header with Razorpay logo styling */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 border-b border-indigo-800/40 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
              R
            </div>
            <span className="text-sm font-bold tracking-wider text-blue-300">
              RAZORPAY SECURE CHECKOUT
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Test Mode
            </span>
          </div>

          <h3 className="text-xl font-bold text-white font-serif">{event.title}</h3>
          <p className="text-xs text-slate-300 mt-1">
            {selectedTier.name} &bull; {quantity} {quantity > 1 ? 'Tickets' : 'Ticket'}
          </p>
        </div>

        {/* Amount Summary */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Ticket Rate ({quantity}x)</span>
              <span className="text-slate-200">
                {selectedTier.price === 0 ? 'Free' : `₹${selectedTier.price} x ${quantity}`}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Platform Service Fee</span>
              <span className="text-emerald-400">₹0 (Waived)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-white">
              <span className="text-sm">Total Payable</span>
              <span className="text-2xl text-emerald-400">
                {totalAmount === 0 ? '₹0.00 (FREE)' : `₹${totalAmount.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          {totalAmount > 0 ? (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Indian Payment Mode:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_upi')}
                  className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'razorpay_upi'
                      ? 'border-saffron-500 bg-saffron-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-saffron-400" />
                  <div>
                    <div className="font-bold text-slate-200">UPI Instant</div>
                    <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay_card')}
                  className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'razorpay_card'
                      ? 'border-saffron-500 bg-saffron-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-bold text-slate-200">Cards &amp; Netbanking</div>
                    <div className="text-[10px] text-slate-400">Visa, RuPay, Master</div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Complimentary Pass! No payment required for General Admission.</span>
            </div>
          )}

          {/* Security guarantee */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/30 p-2.5 rounded-xl border border-slate-800/80">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>256-bit encrypted SSL checkout. Instant encrypted QR Pass delivered to dashboard.</span>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-saffron-500 via-rose-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white shadow-xl shadow-saffron-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting Razorpay Gateway...
              </span>
            ) : totalAmount === 0 ? (
              <span>Confirm &amp; Generate Free QR Pass</span>
            ) : (
              <span>
                Pay ₹{totalAmount.toLocaleString('en-IN')} via Razorpay
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

