'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Trash2, 
  Check, 
  Users, 
  AlertTriangle, 
  Zap, 
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportItem {
  id: string;
  recipeTitle: string;
  reporter: string;
  reason: string;
  date: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isChef: boolean;
  isVerified: boolean;
}

const mockReports: ReportItem[] = [
  { id: 'rep_1', recipeTitle: 'Uncooked Poisonous Mushroom Salad', reporter: 'chef_ramsay', reason: 'Safety concerns regarding raw wild mushroom intake.', date: '2026-05-20' },
  { id: 'rep_2', recipeTitle: 'Spam Garlic Dosa Mix', reporter: 'user_4', reason: 'Duplicate content and spam keywords.', date: '2026-05-19' },
  { id: 'rep_3', recipeTitle: 'Stolen Beef Wellington Post', reporter: 'user_5', reason: 'Copyright infringement on photography.', date: '2026-05-18' }
];

const mockUsers: UserItem[] = [
  { id: 'mock-user-123', name: 'Guest Chef Alice', email: 'alice@skillchef.com', role: 'user', isChef: false, isVerified: false },
  { id: 'chef_ramsay', name: 'Chef Ramsay AI', email: 'ramsay@skillchef.com', role: 'admin', isChef: true, isVerified: true },
  { id: 'chef_alice', name: 'Chef Alice', email: 'alice.real@chef.com', role: 'user', isChef: true, isVerified: true },
  { id: 'user_4', name: 'Culinary Master', email: 'master@cook.com', role: 'user', isChef: false, isVerified: false }
];

export default function AdminConsole() {
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [aiUsageStats, setAiUsageStats] = useState({
    totalCalls: 342,
    successRate: 98.4,
    cacheHits: 120,
    costSimulated: 4.82
  });

  const handleResolveReport = (reportId: string, action: 'approve' | 'delete') => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  const handleToggleChef = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextIsChef = !u.isChef;
        return {
          ...u,
          isChef: nextIsChef,
          // Auto verify if they become a chef
          isVerified: nextIsChef ? true : u.isVerified
        };
      }
      return u;
    }));
  };

  const handleToggleRole = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } 
        : u
    ));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart/10 to-brand-gradientEnd/10 text-brand-500 border border-brand-500/10 px-3.5 py-1.5 rounded-full text-xs font-black mb-2">
          <ShieldCheck className="h-4 w-4" />
          <span>System Administrator Control Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
          Control Panel
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1">
          Monitor neural network queries, oversee user profiles, and audit flagged content queues.
        </p>
      </div>

      {/* Grid: Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 space-y-2 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">AI Formulations</span>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-baseline gap-1">
            {aiUsageStats.totalCalls}
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
              <Zap className="h-3 w-3 fill-emerald-500" />
              Live
            </span>
          </h3>
          <p className="text-[9px] text-gray-400 font-semibold">Total OpenAI completions</p>
        </div>

        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 space-y-2 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Success Index</span>
          <h3 className="text-2xl font-black text-emerald-500">{aiUsageStats.successRate}%</h3>
          <p className="text-[9px] text-gray-400 font-semibold">Zero warning completions</p>
        </div>

        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 space-y-2 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Cache Optimizer</span>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white">{aiUsageStats.cacheHits} Hits</h3>
          <p className="text-[9px] text-gray-400 font-semibold">Saved local response queries</p>
        </div>

        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 space-y-2 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Credit Usage (Est.)</span>
          <h3 className="text-2xl font-black text-brand-500">${aiUsageStats.costSimulated.toFixed(2)}</h3>
          <p className="text-[9px] text-gray-400 font-semibold">Accumulated simulator cost</p>
        </div>

      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Moderation Queue */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-4">
              <AlertTriangle className="h-4.5 w-4.5 text-brand-500 animate-pulse" />
              Recipe Moderation Queue
            </h3>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 bg-gray-50 dark:bg-accent-slateDark border border-gray-100/50 dark:border-accent-borderDark/40 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 px-2 py-0.5 rounded">
                            Reported
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold flex items-center gap-0.5">
                            <Clock className="h-3 w-3" /> {report.date}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-white">
                          {report.recipeTitle}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          Reason: <span className="text-red-500/80 italic">"{report.reason}"</span>
                        </p>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleResolveReport(report.id, 'approve')}
                          className="flex-1 sm:flex-none p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Approve post"
                        >
                          <Check className="h-4.5 w-4.5 mx-auto" />
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id, 'delete')}
                          className="flex-1 sm:flex-none p-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="h-4.5 w-4.5 mx-auto" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 space-y-2 text-gray-400">
                    <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                    <p className="text-xs font-black">All Reported Recipes Audited</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Simulated chart performance */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
              <BarChart3 className="h-4.5 w-4.5 text-brand-500" />
              API Call Intensity Curves
            </h3>
            
            {/* Visual representation of chart using CSS lines */}
            <div className="h-32 flex items-end gap-2.5 pt-4 border-b border-gray-100 dark:border-accent-borderDark">
              {[20, 45, 30, 80, 50, 95, 60, 40, 75, 110, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div 
                    className="w-full bg-gradient-to-t from-brand-gradientStart to-brand-gradientEnd rounded-t-md hover:opacity-90 transition-all cursor-pointer"
                    style={{ height: `${(h / 120) * 100}%` }}
                  />
                  <span className="text-[7px] text-gray-400 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">H{i+1}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-wider">
              <span>00:00 UTC</span>
              <span>12:00 UTC</span>
              <span>23:59 UTC</span>
            </div>
          </div>

        </div>

        {/* Right: User Roles list */}
        <div className="lg:col-span-5">
          
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
              <Users className="h-4.5 w-4.5 text-brand-500" />
              User Directory Audit
            </h3>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-brand-500/20"
              />
            </div>

            {/* Users listing */}
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div 
                  key={user.id}
                  className="p-3 border border-gray-100 dark:border-accent-borderDark rounded-2xl space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-xs font-black text-gray-800 dark:text-white flex items-center gap-0.5">
                        {user.name}
                        {user.isVerified && (
                          <span className="bg-blue-500/10 text-blue-500 text-[8px] font-black px-1.5 py-0.2 rounded uppercase">Verified</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold block">{user.email}</p>
                    </div>

                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      user.role === 'admin' 
                        ? 'bg-brand-500/10 text-brand-500' 
                        : 'bg-gray-100 dark:bg-accent-slateDark text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </div>

                  {/* Actions buttons inside card */}
                  <div className="flex gap-2 border-t border-gray-50 dark:border-gray-800/50 pt-2.5">
                    <button
                      onClick={() => handleToggleChef(user.id)}
                      className={`flex-1 text-center py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                        user.isChef
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {user.isChef ? 'Demote Chef' : 'Promote Chef'}
                    </button>
                    <button
                      onClick={() => handleToggleRole(user.id)}
                      className="flex-1 text-center py-1.5 rounded-xl text-[9px] font-black uppercase bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark text-gray-500 dark:text-gray-400"
                    >
                      Make {user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
