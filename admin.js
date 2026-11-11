import React, { useState } from 'react';

// ==========================================
// 1. INLINE VECTOR ICONS (Zero Dependency)
// ==========================================
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    dashboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    filter: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    gift: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H4v13a2 2 0 002 2h12a2 2 0 002-2V8h-8z" />,
    settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    logs: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />,
    ban: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    pin: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  };
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[name] || null}
    </svg>
  );
};

// ==========================================
// 2. SEED STATE DATA
// ==========================================
const INITIAL_USERS = [
  { id: 'usr_1', name: 'Alex Hunter', email: 'alex@gmail.com', phone: '+14155552671', country: 'United States', coins: 1450, isVIP: true, isBanned: false, isSuspended: false, isVerified: true, joinedDate: '2026-01-15' },
  { id: 'usr_2', name: 'Sarah Connor', email: 'sarah@yahoo.com', phone: '+447911123456', country: 'United Kingdom', coins: 320, isVIP: false, isBanned: false, isSuspended: false, isVerified: true, joinedDate: '2026-02-04' },
  { id: 'usr_3', name: 'Kenji Sato', email: 'kenji@tokyo.jp', phone: '+819012345678', country: 'Japan', coins: 50, isVIP: false, isBanned: true, isSuspended: false, isVerified: false, joinedDate: '2026-02-12' },
  { id: 'usr_4', name: 'Elena Rostova', email: 'elena@mail.ru', phone: '+79161234567', country: 'Germany', coins: 2800, isVIP: true, isBanned: false, isSuspended: true, isVerified: true, joinedDate: '2026-03-01' }
];

const INITIAL_ROOMS = [
  { id: 'room_1', name: 'Global Hangout 🌍', topic: 'General', country: 'Global', isPinned: true, moderator: 'Alex Hunter', totalMembers: 1420 },
  { id: 'room_2', name: 'Language Exchange 🗣️', topic: 'Learning', country: 'United States', isPinned: false, moderator: 'Sarah Connor', totalMembers: 840 },
  { id: 'room_3', name: 'Music & Chill Vibes 🎵', topic: 'Music', country: 'United Kingdom', isPinned: true, moderator: 'Super Admin', totalMembers: 650 },
  { id: 'room_4', name: 'Tech & Founders 💻', topic: 'Tech', country: 'Germany', isPinned: false, moderator: 'Elena Rostova', totalMembers: 930 }
];

const INITIAL_REPORTS = [
  { id: 'rep_1', reporterName: 'Sarah Connor', targetUser: 'Kenji Sato', reason: 'Spamming advertisement links', chatContext: 'Hey check this free coin link: http://spam.xyz now!', date: '10 mins ago', status: 'Pending' },
  { id: 'rep_2', reporterName: 'Alex Hunter', targetUser: 'Guest_992', reason: 'Offensive language in main lounge', chatContext: 'You all are stupid idiots leave this room', date: '45 mins ago', status: 'Pending' }
];

const INITIAL_BANNED_WORDS = ['scam', 'crypto_airdrop', 'hack_tool', 'offensive_word_1', 'free_gift_hack'];

const INITIAL_GIFTS = [
  { id: 'g_1', name: 'Red Rose', coins: 10, icon: '🌹', category: 'Standard' },
  { id: 'g_2', name: 'Coffee Cup', coins: 25, icon: '☕', category: 'Standard' },
  { id: 'g_3', name: 'Diamond Ring', coins: 100, icon: '💍', category: 'Luxury' },
  { id: 'g_4', name: 'Sports Car', coins: 500, icon: '🏎️', category: 'Luxury' },
  { id: 'g_5', name: 'Space Rocket', coins: 1000, icon: '🚀', category: 'Supreme' }
];

// ==========================================
// 3. MAIN ADMIN PANEL ROOT
// ==========================================
export default function AdminPanel() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for immediate testing
  const [currentAdmin, setCurrentAdmin] = useState({
    name: 'Chief Admin',
    email: 'admin@sayhi.com',
    role: 'Super Admin' // 'Super Admin' | 'Moderator' | 'Support'
  });
  const [loginEmail, setLoginEmail] = useState('admin@sayhi.com');
  const [loginPassword, setLoginPassword] = useState('admin123');

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  // Core Management States
  const [users, setUsers] = useState(INITIAL_USERS);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [bannedWords, setBannedWords] = useState(INITIAL_BANNED_WORDS);
  const [gifts, setGifts] = useState(INITIAL_GIFTS);
  const [activityLogs, setActivityLogs] = useState([
    { id: 'log_1', admin: 'Chief Admin', action: 'Banned user Kenji Sato', timestamp: '2026-03-24 14:32' },
    { id: 'log_2', admin: 'Chief Admin', action: 'Pinned room: Global Hangout 🌍', timestamp: '2026-03-24 13:10' }
  ]);

  // System Config State
  const [systemSettings, setSystemSettings] = useState({
    appName: 'SayHi Live',
    maintenanceMode: false,
    minVersionAndroid: '2.4.1',
    minVersionIOS: '2.3.0',
    bannerText: '🔥 Spring Global Chat Festival is Live! Earn double coins this week.',
    autoKickProfanity: true,
    vipPriceMonthly: 9.99
  });

  // Modals Management
  const [userModal, setUserModal] = useState({ visible: false, user: null });
  const [roomModal, setRoomModal] = useState({ visible: false, isEditing: false, room: null });
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', message: '', target: 'ALL' });
  const [newBannedWord, setNewBannedWord] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Helper: Append Admin Log
  const logAction = (actionDesc) => {
    const newLog = {
      id: 'log_' + Date.now(),
      admin: currentAdmin.name,
      action: actionDesc,
      timestamp: new Date().toLocaleString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Auth Handling
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true);
      logAction('Logged into Admin Dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // ==========================================
  // VIEW: LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Icon name="shield" className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white">SayHi Control Center</h2>
          <p className="text-slate-400 text-sm text-center mt-1 mb-6">Enter administrative credentials</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Admin Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-750 border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Master Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Assigned Role</label>
              <select
                value={currentAdmin.role}
                onChange={(e) => setCurrentAdmin({ ...currentAdmin, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Super Admin">Super Admin (All Privileges)</option>
                <option value="Moderator">Moderator (Users & Rooms)</option>
                <option value="Support">Support (View & Reports Only)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2"
            >
              Sign In to Command Portal
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-slate-500">
            Demo credentials filled automatically for instant verification.
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN APPLICATION SHELL
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md shadow-indigo-600/40">
              S
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">SayHi Admin</h1>
              <span className="text-xs text-indigo-400 font-semibold px-2 py-0.5 bg-indigo-950 rounded-full border border-indigo-800">
                {currentAdmin.role}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'DASHBOARD', name: 'Dashboard', icon: 'dashboard' },
              { id: 'USERS', name: 'User Management', icon: 'users' },
              { id: 'ROOMS', name: 'Chat Rooms', icon: 'chat' },
              { id: 'REPORTS', name: 'Reports & Flagged', icon: 'shield', badge: reports.filter(r => r.status === 'Pending').length },
              { id: 'FILTER', name: 'Banned Words', icon: 'filter' },
              { id: 'BROADCAST', name: 'Push Broadcast', icon: 'bell' },
              { id: 'GIFTS', name: 'Gifts & Monetize', icon: 'gift' },
              { id: 'SETTINGS', name: 'System Settings', icon: 'settings' },
              { id: 'LOGS', name: 'Activity Audit', icon: 'logs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={tab.icon} className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Current Admin User / Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 mb-2">
            <div>
              <p className="text-xs text-slate-400 font-semibold leading-tight">{currentAdmin.name}</p>
              <p className="text-xs text-slate-500 truncate w-32">{currentAdmin.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
            >
              <Icon name="logout" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto max-h-screen p-8 bg-slate-950">
        {/* ========================================================== */}
        {/* TAB 1: DASHBOARD METRICS & REVENUE */}
        {/* ========================================================== */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">Live Operations Dashboard</h1>
                <p className="text-slate-400 text-sm">Real-time statistics across all global chat clusters</p>
              </div>
              <button
                onClick={() => setBroadcastModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
              >
                <Icon name="bell" className="w-4 h-4" />
                <span>Send Global Broadcast</span>
              </button>
            </div>

            {/* Quick Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Total Registered', val: '48,290', sub: '+12% this week', color: 'from-blue-600/20 to-blue-900/10 border-blue-800/40 text-blue-400' },
                { title: 'Online Users Now', val: '3,842', sub: 'Across 112 rooms', color: 'from-emerald-600/20 to-emerald-900/10 border-emerald-800/40 text-emerald-400' },
                { title: 'Daily Messages', val: '298,410', sub: '99.98% delivery rate', color: 'from-purple-600/20 to-purple-900/10 border-purple-800/40 text-purple-400' },
                { title: 'Total Revenue', val: '$14,920', sub: 'Gifts & VIP Passes', color: 'from-amber-600/20 to-amber-900/10 border-amber-800/40 text-amber-400' }
              ].map((card, i) => (
                <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} border p-5`}>
                  <p className="text-slate-400 text-xs font-semibold uppercase">{card.title}</p>
                  <h3 className="text-3xl font-black text-white mt-2">{card.val}</h3>
                  <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* SVG Visual Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Daily Message Volume (Peak Loads)</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-950 text-indigo-400 rounded-lg border border-indigo-800">Last 7 Days</span>
                </div>
                <div className="h-44 flex items-end justify-between space-x-2 pt-6">
                  {[45, 60, 52, 78, 92, 85, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">{h * 3}k</span>
                      <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden h-32 flex items-end">
                        <div style={{ height: `${h}%` }} className="w-full bg-indigo-600 rounded-t-lg transition-all duration-500 hover:bg-indigo-400" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">Day {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Recent System Activities</h3>
                  <button onClick={() => setActiveTab('LOGS')} className="text-xs text-indigo-400 hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {activityLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="text-white font-medium">{log.action}</span>
                      </div>
                      <span className="text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: USER MANAGEMENT (Full Edit, Ban, Coins, Verify) */}
        {/* ========================================================== */}
        {activeTab === 'USERS' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">User Accounts Controller</h1>
                <p className="text-slate-400 text-sm">Inspect profiles, adjust balances, verify identity, or ban offenders</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Icon name="search" className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-4">User</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Coins Balance</th>
                    <th className="p-4">VIP Pass</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {users
                    .filter(u => u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.country.toLowerCase().includes(userSearchQuery.toLowerCase()))
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-850/50 transition">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-semibold text-white">{user.name}</span>
                                {user.isVerified && <Icon name="check" className="w-3.5 h-3.5 text-blue-400" />}
                              </div>
                              <span className="text-xs text-slate-400 block">{user.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{user.country}</td>
                        <td className="p-4 font-mono font-bold text-amber-400">{user.coins} Coins</td>
                        <td className="p-4">
                          {user.isVIP ? (
                            <span className="px-2.5 py-1 text-xs rounded-full bg-amber-950/80 text-amber-400 font-bold border border-amber-800">VIP</span>
                          ) : (
                            <span className="text-slate-500 text-xs">Standard</span>
                          )}
                        </td>
                        <td className="p-4">
                          {user.isBanned ? (
                            <span className="px-2.5 py-1 text-xs rounded-full bg-red-950 text-red-400 font-bold border border-red-800">BANNED</span>
                          ) : user.isSuspended ? (
                            <span className="px-2.5 py-1 text-xs rounded-full bg-orange-950 text-orange-400 font-bold border border-orange-800">SUSPENDED</span>
                          ) : (
                            <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">ACTIVE</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setUserModal({ visible: true, user: { ...user } })}
                              className="p-1.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition"
                              title="Edit User Info / Balance"
                            >
                              <Icon name="edit" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const newBannedState = !user.isBanned;
                                setUsers(users.map(u => u.id === user.id ? { ...u, isBanned: newBannedState } : u));
                                logAction(`${newBannedState ? 'Banned' : 'Unbanned'} user: ${user.name}`);
                              }}
                              className={`p-1.5 rounded-lg transition ${user.isBanned ? 'bg-emerald-900/40 text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'bg-red-950 text-red-400 hover:bg-red-600 hover:text-white'}`}
                              title={user.isBanned ? 'Lift Ban' : 'Ban User'}
                            >
                              <Icon name="ban" className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: CHAT ROOMS CONTROLLER */}
        {/* ========================================================== */}
        {activeTab === 'ROOMS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">Public & Topic Chat Rooms</h1>
                <p className="text-slate-400 text-sm">Create, pin to top, assign room moderators, or terminate rooms</p>
              </div>
              <button
                onClick={() => setRoomModal({ visible: true, isEditing: false, room: { name: '', topic: 'General', country: 'Global', isPinned: false, moderator: currentAdmin.name, totalMembers: 1 } })}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20"
              >
                <span>+ Create New Room</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms.map((room) => (
                <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 text-xs rounded-md bg-indigo-950 text-indigo-400 font-bold border border-indigo-800">
                        {room.topic}
                      </span>
                      <button
                        onClick={() => {
                          const updated = !room.isPinned;
                          setRooms(rooms.map(r => r.id === room.id ? { ...r, isPinned: updated } : r));
                          logAction(`${updated ? 'Pinned' : 'Unpinned'} room: ${room.name}`);
                        }}
                        className={`p-1 rounded-lg ${room.isPinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                        title="Toggle Sticky Pin"
                      >
                        <Icon name="pin" className="w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-lg text-white mb-1">{room.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">Assigned Moderator: <span className="text-slate-200 font-medium">{room.moderator}</span></p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Country: <strong className="text-slate-300">{room.country}</strong></span>
                      <span>Members: <strong className="text-emerald-400 font-mono">{room.totalMembers}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-800">
                    <button
                      onClick={() => setRoomModal({ visible: true, isEditing: true, room: { ...room } })}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 text-xs font-semibold rounded-lg text-white transition"
                    >
                      Edit Room
                    </button>
                    <button
                      onClick={() => {
                        setRooms(rooms.filter(r => r.id !== room.id));
                        logAction(`Deleted room: ${room.name}`);
                      }}
                      className="p-1.5 bg-red-950 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition"
                      title="Terminate Room"
                    >
                      <Icon name="trash" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: REPORTS & SAFETY MODERATION */}
        {/* ========================================================== */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Reported Messages & Safety Queue</h1>
              <p className="text-slate-400 text-sm">Review flagged incidents, inspect full chat context, and take punitive action</p>
            </div>

            <div className="space-y-4">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 text-xs bg-red-950 text-red-400 border border-red-800 rounded-full font-bold">
                        {rep.reason}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{rep.date}</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Reported User: <strong className="text-white">{rep.targetUser}</strong> by <span className="text-slate-400">{rep.reporterName}</span>
                    </p>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono">
                      "{rep.chatContext}"
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => {
                        setReports(reports.filter(r => r.id !== rep.id));
                        logAction(`Dismissed report against ${rep.targetUser}`);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => {
                        setUsers(users.map(u => u.name === rep.targetUser ? { ...u, isBanned: true } : u));
                        setReports(reports.filter(r => r.id !== rep.id));
                        logAction(`Banned user ${rep.targetUser} via reports queue`);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-red-600/30"
                    >
                      Ban Offender Permanently
                    </button>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Icon name="check" className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                  <p className="font-semibold text-white">All Clear!</p>
                  <p className="text-sm">There are no pending user reports at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 5: BANNED WORDS & AUTO-CONTENT FILTER */}
        {/* ========================================================== */}
        {activeTab === 'FILTER' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Automated Word Blacklist & Anti-Spam</h1>
              <p className="text-slate-400 text-sm">Real-time socket messages matching these keywords are immediately blocked</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Enter forbidden word or phrase..."
                  value={newBannedWord}
                  onChange={(e) => setNewBannedWord(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    if (newBannedWord.trim() && !bannedWords.includes(newBannedWord.trim().toLowerCase())) {
                      const updated = [...bannedWords, newBannedWord.trim().toLowerCase()];
                      setBannedWords(updated);
                      logAction(`Added banned word: ${newBannedWord}`);
                      setNewBannedWord('');
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  + Add Keyword
                </button>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-2 pt-4">
                {bannedWords.map((word) => (
                  <span
                    key={word}
                    className="flex items-center space-x-2 bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-red-300 font-mono"
                  >
                    <span>{word}</span>
                    <button
                      onClick={() => {
                        setBannedWords(bannedWords.filter(w => w !== word));
                        logAction(`Removed banned keyword: ${word}`);
                      }}
                      className="text-slate-500 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 6: PUSH BROADCASTER */}
        {/* ========================================================== */}
        {activeTab === 'BROADCAST' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">System Broadcast Notifications</h1>
              <p className="text-slate-400 text-sm">Send high-priority FCM push alerts or in-app announcements to players</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Target Audience</label>
                <select
                  value={broadcastData.target}
                  onChange={(e) => setBroadcastData({ ...broadcastData, target: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="ALL">All Active Users (Worldwide)</option>
                  <option value="VIP_ONLY">VIP Subscribers Only</option>
                  <option value="MODERATORS">Assigned Room Moderators</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Alert Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Maintenance / Coin Bonus"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Push Notification Body</label>
                <textarea
                  rows="4"
                  placeholder="Write clear announcement text..."
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <button
                onClick={() => {
                  if (broadcastData.title && broadcastData.message) {
                    logAction(`Sent broadcast "${broadcastData.title}" to ${broadcastData.target}`);
                    alert('Push broadcast queued successfully across Redis & Firebase FCM!');
                    setBroadcastData({ title: '', message: '', target: 'ALL' });
                  } else {
                    alert('Please enter both title and body text.');
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
              >
                Send Broadcast Instantly
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 7: GIFTS & REVENUE TIERS */}
        {/* ========================================================== */}
        {activeTab === 'GIFTS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">Virtual Gifts & Economy Catalog</h1>
                <p className="text-slate-400 text-sm">Configure coin prices, animations, and economy multipliers</p>
              </div>
              <button
                onClick={() => {
                  const name = prompt('Enter Gift Name:');
                  const coins = prompt('Enter Coin Price:');
                  const icon = prompt('Enter Emoji or Icon Symbol:');
                  if (name && coins) {
                    const newG = { id: 'g_' + Date.now(), name, coins: parseInt(coins) || 10, icon: icon || '🎁', category: 'Standard' };
                    setGifts([...gifts, newG]);
                    logAction(`Added virtual gift: ${name} (${coins} coins)`);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
              >
                + Add New Gift
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {gifts.map((g) => (
                <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center relative group">
                  <div className="text-4xl mb-2">{g.icon}</div>
                  <h4 className="font-bold text-white text-sm">{g.name}</h4>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-1">{g.coins} Coins</p>
                  <button
                    onClick={() => {
                      setGifts(gifts.filter(item => item.id !== g.id));
                      logAction(`Removed gift: ${g.name}`);
                    }}
                    className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-400 rounded-lg transition"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 8: SYSTEM SETTINGS (Maintenance, Versions, Banners) */}
        {/* ========================================================== */}
        {activeTab === 'SETTINGS' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Global Application Configuration</h1>
              <p className="text-slate-400 text-sm">Directly alter live app behavior, maintenance lockouts, and client version policies</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white">Emergency Maintenance Lockout</h4>
                  <p className="text-xs text-slate-400">Temporarily block non-admin users from connecting</p>
                </div>
                <input
                  type="checkbox"
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => {
                    setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked });
                    logAction(`Set Maintenance Mode to ${e.target.checked}`);
                  }}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Global Home Announcement Banner</label>
                <input
                  type="text"
                  value={systemSettings.bannerText}
                  onChange={(e) => setSystemSettings({ ...systemSettings, bannerText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Min Android Version</label>
                  <input
                    type="text"
                    value={systemSettings.minVersionAndroid}
                    onChange={(e) => setSystemSettings({ ...systemSettings, minVersionAndroid: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Min iOS Version</label>
                  <input
                    type="text"
                    value={systemSettings.minVersionIOS}
                    onChange={(e) => setSystemSettings({ ...systemSettings, minVersionIOS: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  logAction('Saved global platform settings');
                  alert('Application settings updated and synced to Redis cache.');
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/30"
              >
                Apply Live Changes
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 9: ACTIVITY AUDIT LOGS */}
        {/* ========================================================== */}
        {activeTab === 'LOGS' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">Administrative Audit Trail</h1>
              <p className="text-slate-400 text-sm">Immutable records of all administrative actions, bans, and policy shifts</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <th className="p-4">Admin Operator</th>
                    <th className="p-4">Action Summary</th>
                    <th className="p-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-850/50">
                      <td className="p-4 font-semibold text-indigo-400">{log.admin}</td>
                      <td className="p-4 text-slate-200">{log.action}</td>
                      <td className="p-4 text-right text-xs text-slate-500 font-mono">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================== */}
      {/* MODAL: EDIT USER & BALANCE */}
      {/* ========================================================== */}
      {userModal.visible && userModal.user && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Edit User: {userModal.user.name}</h3>

            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Display Name</label>
              <input
                type="text"
                value={userModal.user.name}
                onChange={(e) => setUserModal({ ...userModal, user: { ...userModal.user, name: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Coins Balance</label>
              <input
                type="number"
                value={userModal.user.coins}
                onChange={(e) => setUserModal({ ...userModal, user: { ...userModal.user, coins: parseInt(e.target.value) || 0 } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white font-mono text-sm"
              />
            </div>

            <div className="flex items-center space-x-6 py-2">
              <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userModal.user.isVIP}
                  onChange={(e) => setUserModal({ ...userModal, user: { ...userModal.user, isVIP: e.target.checked } })}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span>VIP Membership</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userModal.user.isVerified}
                  onChange={(e) => setUserModal({ ...userModal, user: { ...userModal.user, isVerified: e.target.checked } })}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span>Verified Badge</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setUserModal({ visible: false, user: null })}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUsers(users.map(u => u.id === userModal.user.id ? userModal.user : u));
                  logAction(`Updated user profile: ${userModal.user.name}`);
                  setUserModal({ visible: false, user: null });
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL: CREATE / EDIT ROOM */}
      {/* ========================================================== */}
      {roomModal.visible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">{roomModal.isEditing ? 'Edit Chat Room' : 'Create Chat Room'}</h3>

            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Room Title</label>
              <input
                type="text"
                value={roomModal.room.name}
                onChange={(e) => setRoomModal({ ...roomModal, room: { ...roomModal.room, name: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Topic</label>
              <input
                type="text"
                value={roomModal.room.topic}
                onChange={(e) => setRoomModal({ ...roomModal, room: { ...roomModal.room, topic: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Assigned Moderator</label>
              <input
                type="text"
                value={roomModal.room.moderator}
                onChange={(e) => setRoomModal({ ...roomModal, room: { ...roomModal.room, moderator: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setRoomModal({ visible: false, isEditing: false, room: null })}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (roomModal.isEditing) {
                    setRooms(rooms.map(r => r.id === roomModal.room.id ? roomModal.room : r));
                    logAction(`Updated room: ${roomModal.room.name}`);
                  } else {
                    const created = { ...roomModal.room, id: 'room_' + Date.now() };
                    setRooms([created, ...rooms]);
                    logAction(`Created room: ${created.name}`);
                  }
                  setRoomModal({ visible: false, isEditing: false, room: null });
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                {roomModal.isEditing ? 'Save Changes' : 'Create Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}