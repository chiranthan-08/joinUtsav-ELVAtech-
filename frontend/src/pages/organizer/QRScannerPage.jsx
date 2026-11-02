import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Search, 
  ShieldCheck, 
  Clock, 
  User, 
  MapPin, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const QRScannerPage = () => {
  const toast = useToast();
  const [passInput, setPassInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);

  const scannerRef = useRef(null);

  const handleVerifyPass = async (passIdToVerify) => {
    const id = (passIdToVerify || passInput).trim();
    if (!id) {
      toast.error('Please enter a Pass ID or scan a QR code.');
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.post('/bookings/check-in', { passId: id });
      setScanResult({
        status: 'SUCCESS',
        message: res.message,
        booking: res.booking
      });
      toast.success(res.message);
      setRecentScans((prev) => [
        {
          passId: res.booking.passId,
          guest: res.booking.userName,
          event: res.booking.eventTitle,
          status: 'SUCCESS',
          time: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 9)
      ]);
      setPassInput('');
    } catch (err) {
      const isDuplicate = err.message.includes('DUPLICATE') || err.message.includes('already checked in');
      setScanResult({
        status: isDuplicate ? 'DUPLICATE' : 'INVALID',
        message: err.message
      });
      toast.error(err.message);
      setRecentScans((prev) => [
        {
          passId: id,
          guest: 'Unknown / Blocked',
          status: isDuplicate ? 'DUPLICATE' : 'INVALID',
          time: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 9)
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Setup HTML5 QR scanner when toggled
  useEffect(() => {
    let html5QrcodeScanner = null;
    if (cameraActive) {
      try {
        html5QrcodeScanner = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        );

        html5QrcodeScanner.render(
          (decodedText) => {
            handleVerifyPass(decodedText);
          },
          (error) => {
            // Ignore ongoing scan frame misses
          }
        );
      } catch (e) {
        console.error('Camera initialization error:', e);
      }
    }

    return () => {
      if (html5QrcodeScanner) {
        try {
          html5QrcodeScanner.clear();
        } catch (e) {}
      }
    };
  }, [cameraActive]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <QrCode className="w-3.5 h-3.5" />
          <span>Real-Time Attendance &amp; Gate Verification</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-serif">
          QR Attendance Gate Scanner
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Scan attendee passes directly with webcam/camera or lookup Pass ID. Anti-duplicate system instantly detects re-entry attempts.
        </p>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Camera & Manual Input */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                Live Camera Scanner
              </span>
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  cameraActive
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {cameraActive ? 'Stop Camera' : 'Start Camera Scanner'}
              </button>
            </div>

            {/* Camera Box */}
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 min-h-[260px] flex items-center justify-center">
              {cameraActive ? (
                <div id="qr-reader" className="w-full text-slate-300 text-xs" />
              ) : (
                <div className="text-center space-y-2 p-8">
                  <QrCode className="w-16 h-16 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-400">Click "Start Camera Scanner" to enable webcam QR scanning</p>
                </div>
              )}
            </div>

            {/* Manual Lookup */}
            <div className="pt-2 space-y-2">
              <label className="block text-slate-300 font-semibold text-xs">
                Or Enter Pass ID Manually:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. UM-PASS-8841"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value.toUpperCase())}
                  className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:border-emerald-500 focus:outline-none uppercase"
                />
                <button
                  onClick={() => handleVerifyPass()}
                  disabled={loading || !passInput.trim()}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Check-In'}
                </button>
              </div>

              {/* Demo quick tests */}
              <div className="flex items-center gap-2 pt-2 flex-wrap text-[11px] text-slate-400">
                <span>Quick Test Passes:</span>
                <button
                  type="button"
                  onClick={() => { setPassInput('UM-PASS-8841'); handleVerifyPass('UM-PASS-8841'); }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono"
                  title="Already checked in - tests duplicate detection"
                >
                  UM-PASS-8841 (Duplicate Test)
                </button>
                <button
                  type="button"
                  onClick={() => { setPassInput('UM-PASS-9923'); handleVerifyPass('UM-PASS-9923'); }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono"
                  title="Pending pass - tests successful check-in"
                >
                  UM-PASS-9923 (Valid Pass)
                </button>
                <button
                  type="button"
                  onClick={() => { setPassInput('UM-PASS-7734'); handleVerifyPass('UM-PASS-7734'); }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono"
                >
                  UM-PASS-7734 (Valid Pass)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Scan Result & Activity Feed */}
        <div className="space-y-6">
          {/* Verification Result Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[220px] flex flex-col justify-center">
            {scanResult ? (
              <div className="space-y-4">
                {scanResult.status === 'SUCCESS' && (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/50 space-y-3 animate-slide-up">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <CheckCircle2 className="w-8 h-8 shrink-0" />
                      <div>
                        <div className="text-lg font-bold font-serif text-white">ACCESS GRANTED</div>
                        <div className="text-xs text-emerald-300 font-medium">Valid Pass &bull; Check-in Approved</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-500/30">
                      <div>
                        <span className="text-[10px] uppercase text-emerald-400/80">Guest Name</span>
                        <div className="font-bold text-white text-sm">{scanResult.booking?.userName}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-emerald-400/80">Ticket Tier</span>
                        <div className="font-bold text-emerald-300 text-sm">{scanResult.booking?.ticketTier}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase text-emerald-400/80">Event</span>
                        <div className="font-semibold text-slate-200">{scanResult.booking?.eventTitle}</div>
                      </div>
                    </div>
                  </div>
                )}

                {scanResult.status === 'DUPLICATE' && (
                  <div className="p-6 rounded-2xl bg-rose-500/10 border-2 border-rose-500/60 space-y-2 animate-shake">
                    <div className="flex items-center gap-3 text-rose-400">
                      <AlertTriangle className="w-8 h-8 shrink-0" />
                      <div>
                        <div className="text-lg font-bold font-serif text-white">DUPLICATE ENTRY DETECTED!</div>
                        <div className="text-xs text-rose-300 font-semibold">ENTRY DENIED &bull; ALREADY CHECKED IN</div>
                      </div>
                    </div>
                    <p className="text-xs text-rose-200 leading-relaxed pt-2 border-t border-rose-500/30">
                      {scanResult.message}
                    </p>
                  </div>
                )}

                {scanResult.status === 'INVALID' && (
                  <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 space-y-2">
                    <div className="flex items-center gap-3 text-amber-400">
                      <AlertTriangle className="w-8 h-8 shrink-0" />
                      <div>
                        <div className="text-lg font-bold font-serif text-white">INVALID PASS ID</div>
                        <div className="text-xs text-amber-300">No record exists in database.</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300">{scanResult.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">Scanner Ready at Checkpoint</h4>
                <p className="text-xs text-slate-500">Scan or enter any pass to verify guest authenticity.</p>
              </div>
            )}
          </div>

          {/* Recent Scans Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-white font-serif flex items-center justify-between">
              <span>Recent Gate Check-in Activity</span>
              <span className="text-[10px] text-slate-500 font-sans font-normal">Real-Time</span>
            </h3>

            {recentScans.length > 0 ? (
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto">
                {recentScans.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-200">{s.passId}</span>
                      <div className="text-[11px] text-slate-400">{s.guest}</div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.status === 'SUCCESS'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {s.status}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No passes scanned yet in this session.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

