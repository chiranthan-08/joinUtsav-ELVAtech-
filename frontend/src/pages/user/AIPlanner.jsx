import React, { useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { 
  Sparkles, 
  IndianRupee, 
  Calendar, 
  Clock, 
  FileText, 
  UtensilsCrossed, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export const AIPlanner = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('budget'); // 'budget', 'timeline', 'invite', 'catering', 'chat'

  // --- Budget State ---
  const [budgetForm, setBudgetForm] = useState({
    eventType: 'Royal Wedding & Sangeet',
    guestCount: 350,
    totalBudget: 1500000,
    city: 'Jaipur'
  });
  const [budgetResult, setBudgetResult] = useState(null);
  const [loadingBudget, setLoadingBudget] = useState(false);

  // --- Timeline State ---
  const [timelineForm, setTimelineForm] = useState({
    eventType: 'Wedding',
    days: 1,
    startTime: '10:00 AM'
  });
  const [timelineResult, setTimelineResult] = useState(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // --- Invitation Poetry State ---
  const [inviteForm, setInviteForm] = useState({
    hostNames: 'The Sharma & Verma Families',
    honoree: 'Aarav & Priya',
    eventType: 'Wedding & Sangeet',
    date: '15th November 2026',
    venue: 'Chomu Palace Heritage Courtyard, Jaipur',
    style: 'royal'
  });
  const [inviteResult, setInviteResult] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);

  // --- Catering State ---
  const [cateringForm, setCateringForm] = useState({
    cuisine: 'North Indian Royal',
    preference: 'Pure Veg',
    guestCount: 300
  });
  const [cateringResult, setCateringResult] = useState(null);
  const [loadingCatering, setLoadingCatering] = useState(false);

  // --- Chat Assistant State ---
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! I am your UtsavMitra AI Celebration Assistant. How can I assist you with your upcoming wedding, college fest, or cultural gathering today?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Handlers
  const handleGenerateBudget = async (e) => {
    e?.preventDefault();
    setLoadingBudget(true);
    try {
      const res = await api.post('/ai/budget', budgetForm);
      if (res.success) {
        setBudgetResult(res.data);
        toast.success('AI Budget Allocation generated!');
      }
    } catch (err) {
      toast.error('Failed to generate budget breakdown.');
    } finally {
      setLoadingBudget(false);
    }
  };

  const handleGenerateTimeline = async (e) => {
    e?.preventDefault();
    setLoadingTimeline(true);
    try {
      const res = await api.post('/ai/itinerary', timelineForm);
      if (res.success) {
        setTimelineResult(res.data);
        toast.success('AI Itinerary & Muhurat Timeline ready!');
      }
    } catch (err) {
      toast.error('Failed to generate timeline.');
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleGenerateInvite = async (e) => {
    e?.preventDefault();
    setLoadingInvite(true);
    try {
      const res = await api.post('/ai/invitation-poetry', inviteForm);
      if (res.success) {
        setInviteResult(res.data);
        toast.success('Bilingual Invitation Card Text generated!');
      }
    } catch (err) {
      toast.error('Failed to generate poetry.');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleGenerateCatering = async (e) => {
    e?.preventDefault();
    setLoadingCatering(true);
    try {
      const res = await api.post('/ai/catering', cateringForm);
      if (res.success) {
        setCateringResult(res.data);
        toast.success('Grand 5-Course Festive Banquet Menu created!');
      }
    } catch (err) {
      toast.error('Failed to generate catering menu.');
    } finally {
      setLoadingCatering(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || loadingChat) return;

    const userPrompt = chatInput.trim();
    const updatedHistory = [...chatMessages, { role: 'user', content: userPrompt }];
    setChatMessages(updatedHistory);
    setChatInput('');
    setLoadingChat(true);

    try {
      const res = await api.post('/ai/chat', { 
        prompt: userPrompt, 
        history: updatedHistory.slice(-6) 
      });
      if (res.success) {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered an issue. Please try asking again!' }
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>UtsavMitra Intelligence Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
          AI Event Planner &amp; Consultant
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Streamline Indian festivities with tailored budgeting, auspicious muhurat timelines, bilingual invitation poetry, and royal culinary catering menus.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        <button
          onClick={() => { setActiveTab('budget'); if (!budgetResult) handleGenerateBudget(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'budget'
              ? 'bg-saffron-500 text-white shadow-lg shadow-saffron-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>1. Indian Budget Allocator</span>
        </button>

        <button
          onClick={() => { setActiveTab('timeline'); if (!timelineResult) handleGenerateTimeline(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'timeline'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>2. Muhurat &amp; Timeline</span>
        </button>

        <button
          onClick={() => { setActiveTab('invite'); if (!inviteResult) handleGenerateInvite(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'invite'
              ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Bilingual Invitation Copy</span>
        </button>

        <button
          onClick={() => { setActiveTab('catering'); if (!cateringResult) handleGenerateCatering(); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'catering'
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>4. Royal Catering Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'chat'
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>5. Ask AI Consultant</span>
        </button>
      </div>

      {/* TAB 1: BUDGET ALLOCATOR */}
      {activeTab === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-saffron-400" />
              Configure Budget Parameters
            </h3>

            <form onSubmit={handleGenerateBudget} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Celebration Type</label>
                <select
                  value={budgetForm.eventType}
                  onChange={(e) => setBudgetForm({ ...budgetForm, eventType: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-saffron-500 focus:outline-none"
                >
                  <option value="Royal Wedding & Sangeet">Royal Wedding &amp; Sangeet</option>
                  <option value="College Cultural & Tech Fest">College Cultural &amp; Tech Fest</option>
                  <option value="Navratri Dandiya Raas">Navratri Dandiya Raas</option>
                  <option value="Grand Birthday / Anniversary">Grand Birthday / Anniversary</option>
                  <option value="Corporate Gala & Dinner">Corporate Gala &amp; Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Budget (₹ INR)</label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={budgetForm.totalBudget}
                  onChange={(e) => setBudgetForm({ ...budgetForm, totalBudget: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm focus:border-saffron-500 focus:outline-none"
                />
                <div className="text-[11px] text-saffron-400 mt-1 font-semibold">
                  ₹{Number(budgetForm.totalBudget).toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Expected Guests</label>
                <input
                  type="number"
                  min="20"
                  max="10000"
                  value={budgetForm.guestCount}
                  onChange={(e) => setBudgetForm({ ...budgetForm, guestCount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Host City</label>
                <input
                  type="text"
                  value={budgetForm.city}
                  onChange={(e) => setBudgetForm({ ...budgetForm, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-saffron-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingBudget}
                className="w-full py-3 rounded-xl font-bold bg-saffron-600 hover:bg-saffron-500 text-white shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loadingBudget ? 'Calculating Rupee Allocations...' : 'Recalculate with AI'}
              </button>
            </form>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-6">
            {budgetResult ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Event Budget</span>
                    <div className="text-xl font-extrabold text-saffron-400 font-serif mt-0.5">
                      ₹{budgetResult.totalBudget.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Cost Per Guest</span>
                    <div className="text-xl font-extrabold text-emerald-400 font-serif mt-0.5">
                      ₹{budgetResult.estimatedCostPerGuest.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Guest Footfall</span>
                    <div className="text-xl font-extrabold text-white font-serif mt-0.5">
                      {budgetResult.guestCount} Guests
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown List */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h4 className="text-base font-bold text-white font-serif">Category-wise Rupee Allocation</h4>
                  <div className="space-y-4">
                    {budgetResult.breakdown.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{item.category}</span>
                          <span className="font-mono font-bold text-saffron-400 text-sm">
                            ₹{item.amount.toLocaleString('en-IN')} ({item.percentage}%)
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-saffron-500 to-rose-500 h-full rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.items.map((sub, sidx) => (
                            <span key={sidx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Cost-Saving Tips */}
                {budgetResult.tips && (
                  <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-3">
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      AI Optimization &amp; Savings Advice
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {budgetResult.tips.map((tip, tidx) => (
                        <li key={tidx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
                <IndianRupee className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Configure parameters on the left and click calculate.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MUHURAT & TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-400" />
              Timeline Preferences
            </h3>
            <form onSubmit={handleGenerateTimeline} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Occasion</label>
                <select
                  value={timelineForm.eventType}
                  onChange={(e) => setTimelineForm({ ...timelineForm, eventType: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Wedding">Traditional Hindu Wedding &amp; Pheras</option>
                  <option value="College Fest">College Cultural &amp; Pro-Nite</option>
                  <option value="Birthday Celebration">Birthday &amp; Evening Party</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
                <input
                  type="text"
                  value={timelineForm.startTime}
                  onChange={(e) => setTimelineForm({ ...timelineForm, startTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingTimeline}
                className="w-full py-3 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all"
              >
                {loadingTimeline ? 'Drafting Itinerary...' : 'Generate Auspicious Timeline'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {timelineResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white font-serif">
                    Hour-by-Hour Event Protocol ({timelineResult.eventType})
                  </h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(timelineResult.schedule, null, 2))}
                    className="p-1.5 text-slate-400 hover:text-white"
                    title="Copy Schedule"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
                  {timelineResult.schedule.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 pl-8">
                      <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-slate-900" />
                      <div className="flex-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-rose-400">{item.time}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
                            Coordinator: {item.lead}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white mt-1">{item.title}</div>
                        <p className="text-xs text-slate-400 mt-1">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 3: BILINGUAL INVITATION COPYWRITER */}
      {activeTab === 'invite' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Invitation Details
            </h3>
            <form onSubmit={handleGenerateInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Host Family Names</label>
                <input
                  type="text"
                  value={inviteForm.hostNames}
                  onChange={(e) => setInviteForm({ ...inviteForm, hostNames: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Honorees / Couple Names</label>
                <input
                  type="text"
                  value={inviteForm.honoree}
                  onChange={(e) => setInviteForm({ ...inviteForm, honoree: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Auspicious Date</label>
                <input
                  type="text"
                  value={inviteForm.date}
                  onChange={(e) => setInviteForm({ ...inviteForm, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Venue</label>
                <input
                  type="text"
                  value={inviteForm.venue}
                  onChange={(e) => setInviteForm({ ...inviteForm, venue: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingInvite}
                className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg transition-all"
              >
                {loadingInvite ? 'Writing Poetry...' : 'Generate Bilingual Text'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {inviteResult ? (
              <div className="space-y-6">
                {/* Sanskrit Mangal Shloka */}
                <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center space-y-2">
                  <div className="text-xs text-amber-400 uppercase tracking-widest font-bold">
                    Auspicious Invocation (मंगलाचरण)
                  </div>
                  <div className="text-base sm:text-lg font-serif text-amber-200 font-bold leading-relaxed">
                    {inviteResult.shloka}
                  </div>
                </div>

                {/* Hindi Invitation Text */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-saffron-400 tracking-wider">
                      पारंपरिक हिंदी निमंत्रण पत्र (Hindi Script)
                    </span>
                    <button
                      onClick={() => copyToClipboard(inviteResult.hindiText)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-sans">
                    {inviteResult.hindiText}
                  </div>
                </div>

                {/* English Formal Text */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
                      Royal English Invitation Card Copy
                    </span>
                    <button
                      onClick={() => copyToClipboard(inviteResult.englishText)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-slate-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-serif">
                    {inviteResult.englishText}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 4: ROYAL CATERING MENU */}
      {activeTab === 'catering' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-teal-400" />
              Banquet Cuisines
            </h3>
            <form onSubmit={handleGenerateCatering} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Cuisine Style</label>
                <select
                  value={cateringForm.cuisine}
                  onChange={(e) => setCateringForm({ ...cateringForm, cuisine: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="North Indian Royal">North Indian Royal &amp; Mughlai</option>
                  <option value="Gujarati Kathiawadi">Gujarati &amp; Kathiawadi Mahasabha</option>
                  <option value="South Indian Chettinad">South Indian Chettinad &amp; Sadhya</option>
                  <option value="Indo-Asian Fusion">Pan-Asian &amp; Continental Fusion</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Dietary Preference</label>
                <select
                  value={cateringForm.preference}
                  onChange={(e) => setCateringForm({ ...cateringForm, preference: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="Pure Veg">Pure Vegetarian</option>
                  <option value="Jain Friendly">Jain Friendly (No Onion/Garlic)</option>
                  <option value="Multi Cuisine">Non-Veg &amp; Veg Mixed</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loadingCatering}
                className="w-full py-3 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-lg transition-all"
              >
                {loadingCatering ? 'Crafting Menu...' : 'Generate 5-Course Banquet'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {cateringResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white font-serif">{cateringResult.cuisine} Banquet</h3>
                    <div className="text-xs text-slate-400 mt-0.5">{cateringResult.preference} &bull; Estimated: {cateringResult.estimatedPlateCost}</div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Grand Feast
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px]">
                      Welcome Drinks &amp; Coolers
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {cateringResult.menu.welcomeDrinks.map((d, i) => (
                        <li key={i}>&bull; {d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      Live Counters &amp; Chaat Gali
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {cateringResult.menu.liveCounters.map((c, i) => (
                        <li key={i}>&bull; {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 sm:col-span-2">
                    <span className="font-bold text-saffron-400 uppercase tracking-wider text-[11px]">
                      Royal Main Course &amp; Zafrani Breads
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
                      {cateringResult.menu.mainCourse.map((m, i) => (
                        <li key={i}>&bull; {m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 sm:col-span-2">
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">
                      Dessert Counter &amp; Kolkata Paan
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
                      {cateringResult.menu.desserts.map((ds, i) => (
                        <li key={i}>&bull; {ds}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 5: AI EVENT ASSISTANT CHATBOT */}
      {activeTab === 'chat' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[550px]">
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-600 flex items-center justify-center text-lg">
                🪔
              </div>
              <div>
                <div className="text-sm font-bold text-white">UtsavMitra AI Companion</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Ready to answer event planning &amp; ritual questions
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-saffron-600 to-rose-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loadingChat && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-saffron-400 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce delay-200" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything (e.g. Haldi ceremony checklist, DJ sound clearance, QR gate security)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loadingChat || !chatInput.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

