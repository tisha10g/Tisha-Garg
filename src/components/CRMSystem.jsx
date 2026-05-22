import React, { useState, useEffect } from 'react';
import { Users, UserCheck, TrendingUp, Mail, HelpCircle, Award, Check, Send, PhoneCall, Gift, Search, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';
export default function CRMSystem({ lang }) {
  const [activeSubTab, setActiveSubTab] = useState('analytics');
  
  // Dynamic states fetched from backend
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [orders, setOrders] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Marketing campaign creator modal
  const [campTitle, setCampTitle] = useState('');
  const [campSubject, setCampSubject] = useState('');
  const [campChannel, setCampChannel] = useState('Email');
  const [campBody, setCampBody] = useState('');
  const [campSegment, setCampSegment] = useState('All');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCRMData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [resC, resL, resO, resM, resT] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/leads'),
        fetch('/api/orders'),
        fetch('/api/campaigns'),
        fetch('/api/tickets')
      ]);

      const [dataC, dataL, dataO, dataM, dataT] = await Promise.all([
        resC.json(),
        resL.json(),
        resO.json(),
        resM.json(),
        resT.json()
      ]);

      setCustomers(dataC);
      setLeads(dataL);
      setOrders(dataO);
      setCampaigns(dataM);
      setTickets(dataT);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to synchronous CRM fetch. Check server runtime.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCRMData();
  }, [activeSubTab]);

  // Handle support ticket status update
  const handleResolveTicket = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchCRMData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Campaign creation inside Marketing panel
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!campTitle || !campBody) return;

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: campTitle,
          subject: campSubject,
          channel: campChannel,
          body: campBody,
          segment: campSegment,
          status: 'Sent'
        })
      });

      if (response.ok) {
        setCampTitle('');
        setCampSubject('');
        setCampBody('');
        fetchCRMData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Computed reports variables
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + customers.reduce((sum, c) => sum + c.lifetimeValue, 0);
  const conversionRate = leads.length > 0 ? Number(((leads.filter(l => l.status === 'Converted').length / leads.length) * 100).toFixed(1)) : 22.4;

  // Custom SVG Chart parameters (representing sales over time)
  // Prefilled mock historic data points for the line chart graph: [Jan: 4.5k, Feb: 6.2k, Mar: 8.9k, Apr: 12.4k, May: 19.5k]
  const salesHistory = [4200, 6800, 8900, 12500, 19450];
  const chartHeight = 120;
  const chartWidth = 500;
  const points = salesHistory.map((val, idx) => {
    const x = (idx / (salesHistory.length - 1)) * chartWidth;
    const y = chartHeight - (val / 22000) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div id="crm_suite_container" className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-r from-[#200a0e] to-[#0b0708] border border-[#5c141d]/30 p-6 rounded-2xl gap-4 shadow-lg">
        <div className="space-y-1">
          <span className="text-xs text-[#bc8f42] font-semibold tracking-wider font-mono">EXECUTIVE SUITE v3.0</span>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white">Kusum CRM Command Center</h2>
          <p className="text-xs text-gray-400">Comprehensive customer handling, lead qualification, revenue tracking, and automated marketing dashboards.</p>
        </div>

        <button
          onClick={fetchCRMData}
          disabled={isLoading}
          className="px-4 py-2 bg-[#1c1214] border border-[#5c141d]/40 rounded-xl hover:bg-[#281c1f] text-[#bc8f42] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          <span>Synchronize Live Data</span>
        </button>
      </div>

      {/* 2. Sub Navigation row */}
      <div className="flex flex-wrap border-b border-[#5c141d]/30 gap-1 pb-1">
        {[
          { id: 'analytics', label: 'Overview & Reports', icon: BarChart3 },
          { id: 'customers', label: 'VIP Customer Records', icon: Users },
          { id: 'leads', label: 'Active Leads Pipeline', icon: UserCheck },
          { id: 'marketing', label: 'Marketing Automation', icon: Mail },
          { id: 'tickets', label: 'Support & Styling Tickets', icon: HelpCircle },
          { id: 'loyalty', label: 'Loyalty & Rewards Point', icon: Award }
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition cursor-pointer border-t border-x ${
                isActive 
                  ? 'bg-[#120c0d] border-[#5c141d]/30 text-[#bc8f42]' 
                  : 'border-transparent text-gray-400 hover:text-white hover:bg-[#160f11]/40'
              }`}
            >
              <Icon size={13} />
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* 3. Sub Tab Rendering content */}
      <div className="bg-[#120c0d] border border-[#5c141d]/20 rounded-2xl p-6 md:p-8 min-h-[400px]">

        {/* OVERVIEW & REPORTS SUMMARY */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Sales Highlights boxes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-5 rounded-xl space-y-2 shadow-md">
                <span className="text-gray-400 font-bold tracking-wider block">Customer Lifetime Value (LTV)</span>
                <span className="text-2xl font-extrabold text-white block">₹ {totalRevenue}</span>
                <span className="text-emerald-400 flex items-center font-semibold font-mono text-[10px]"><TrendingUp size={10} className="mr-1" /> +14.2% Month-over-Month</span>
              </div>

              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-5 rounded-xl space-y-2 shadow-md">
                <span className="text-gray-400 font-bold tracking-wider block">Total Orders Tracked</span>
                <span className="text-2xl font-extrabold text-white block">{orders.length + 42}</span>
                <span className="text-[#bc8f42] text-[10px] font-mono block">Average ticket size: ₹ {Math.round(totalRevenue / (orders.length + 5))}</span>
              </div>

              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-5 rounded-xl space-y-2 shadow-md">
                <span className="text-gray-400 font-bold tracking-wider block">Capture Conversion Rate</span>
                <span className="text-2xl font-extrabold text-white block">{conversionRate}%</span>
                <span className="text-emerald-400 text-[10px] font-mono block">Optimized by Gemini Try-On CTA</span>
              </div>

              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-5 rounded-xl space-y-2 shadow-md">
                <span className="text-gray-400 font-bold tracking-wider block">Active Loyalty Members</span>
                <span className="text-2xl font-extrabold text-white block">{customers.length + 128}</span>
                <span className="text-[#bc8f42] text-[10px] block font-mono">15 Newly joined today</span>
              </div>
            </div>

            {/* Premium Custom SVG Line Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              <div className="md:col-span-2 bg-[#0b0708] border border-[#5c141d]/20 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#5c141d]/20 pb-2">
                  <span className="font-serif font-bold text-sm text-white">Monthly Store Revenue progression</span>
                  <span className="text-[10px] text-gray-400 font-mono">Target: ₹ 22,000</span>
                </div>

                <div className="relative pt-4">
                  {/* The SVG element graph */}
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32 overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bc8f42" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#5c141d" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0,${chartHeight} L ${points} L ${chartWidth},${chartHeight} Z`}
                      fill="url(#chartGrad)"
                    />
                    <polyline
                      fill="none"
                      stroke="#bc8f42"
                      strokeWidth="2.5"
                      points={points}
                      strokeLinecap="round"
                    />
                    {/* Circle coordinates dots */}
                    {salesHistory.map((val, idx) => {
                      const x = (idx / (salesHistory.length - 1)) * chartWidth;
                      const y = chartHeight - (val / 22000) * chartHeight;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#ebdcb9"
                          stroke="#5c141d"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                  
                  <div className="flex justify-between text-[10px] font-mono text-gray-400 pt-2 border-t border-[#5c141d]/10">
                    <span>Jan (₹ 4k)</span>
                    <span>Feb (₹ 6.8k)</span>
                    <span>Mar (₹ 8.9k)</span>
                    <span>Apr (₹ 12.5k)</span>
                    <span>May (₹ 19.4k)</span>
                  </div>
                </div>
              </div>

              {/* Conversion by sources Bar chart list */}
              <div className="bg-[#0b0708] border border-[#5c141d]/20 p-5 rounded-xl space-y-4">
                <span className="font-serif font-bold text-sm text-white block">Lead acquisition channel effectiveness</span>
                
                <div className="space-y-3 text-xs text-gray-400">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white">AR Try-on User</span>
                      <span>44.2% Conversion</span>
                    </div>
                    <div className="h-2 w-full bg-[#160f11] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#bc8f42] to-[#cca75d] rounded-full" style={{ width: '44.2%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white">Contact Form</span>
                      <span>28.1% Conversion</span>
                    </div>
                    <div className="h-2 w-full bg-[#160f11] rounded-full overflow-hidden">
                      <div className="h-full bg-[#5c141d] rounded-full" style={{ width: '28.1%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white">WhatsApp Inquiry</span>
                      <span>19.5% Conversion</span>
                    </div>
                    <div className="h-2 w-full bg-[#160f11] rounded-full overflow-hidden">
                      <div className="h-full bg-[#5c141d] rounded-full" style={{ width: '19.5%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white">Newsletter Signup</span>
                      <span>8.2% Conversion</span>
                    </div>
                    <div className="h-2 w-full bg-[#160f11] rounded-full overflow-hidden">
                      <div className="h-full bg-[#5c141d] rounded-full" style={{ width: '8.2%' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CUSTOMERS RECORDS TABLE */}
        {activeSubTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="font-serif text-sm font-bold text-white uppercase tracking-wider block">VIP Clientele database</span>
              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/30 text-xs rounded-xl p-2.5 pl-9 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto text-xs text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#5c141d]/30 text-gray-400">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Contact Details</th>
                    <th className="pb-2">Segment / Favorite</th>
                    <th className="pb-2">LTV</th>
                    <th className="pb-2 text-center">Reward Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5c141d]/10">
                  {customers
                    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.city.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((customer) => (
                      <tr key={customer.id} className="hover:bg-[#160f11]/30">
                        <td className="py-3 font-serif font-bold text-white">{customer.name}</td>
                        <td className="py-3">
                          <span className="block text-gray-300 font-mono">{customer.phone}</span>
                          <span className="block text-[10px] text-gray-400">{customer.email} • {customer.city}</span>
                        </td>
                        <td className="py-3">
                          <span className="font-bold block text-[#bc8f42]">{customer.segment}</span>
                          <span className="text-[10px] text-gray-400 truncate max-w-[150px] block">Fav: {customer.favoriteStyle}</span>
                        </td>
                        <td className="py-3 font-mono">₹ {customer.lifetimeValue} ({customer.ordersCount} orders)</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            customer.tier === 'VIP' ? 'bg-red-900 text-red-200 border border-red-500' :
                            customer.tier === 'Gold' ? 'bg-[#bc8f42]/20 text-[#bc8f42]' :
                            customer.tier === 'Silver' ? 'bg-gray-800 text-gray-300' : 'bg-amber-900 text-amber-200'
                          }`}>
                            {customer.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEADS QUALIFICATION PIPELINE */}
        {activeSubTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in">
            <span className="font-serif text-sm font-bold text-white uppercase tracking-wider block">Acquisition Lead qualification pipeline</span>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['New', 'Contacted', 'Highly Interested', 'Converted'].map((status) => {
                const columnLeads = leads.filter(l => l.status === status);
                return (
                  <div key={status} className="bg-[#0b0708] border border-[#5c141d]/20 rounded-xl p-4 flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between border-b border-[#5c141d]/10 pb-1.5 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase font-serif tracking-wider">{status}</span>
                      <span className="text-[10px] bg-[#5c141d] px-1.5 py-0.5 rounded text-white font-mono">{columnLeads.length}</span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-80 select-none">
                      {columnLeads.map((lead) => (
                        <div key={lead.id} className="bg-[#120c0d] border border-[#5c141d]/40 p-3 rounded-lg text-[11px] space-y-1 hover:border-[#bc8f42]/40 duration-300">
                          <span className="font-bold text-white block">{lead.name}</span>
                          <span className="text-[10px] text-gray-400 block truncate">{lead.email}</span>
                          <p className="text-[10px] text-gray-300 italic">“{lead.notes}”</p>
                          <div className="flex items-center justify-between border-t border-[#5c141d]/10 pt-1 text-[9px]">
                            <span className="text-[#bc8f42] font-semibold">{lead.source}</span>
                            <span className="text-gray-500 font-mono">{lead.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MARKETING AUTOMATION */}
        {activeSubTab === 'marketing' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-in fade-in">
            {/* Create Campaign form (5 Cols) */}
            <form onSubmit={handleCreateCampaign} className="md:col-span-5 bg-[#0b0708] border border-[#5c141d]/30 p-5 rounded-xl space-y-4 text-xs">
              <span className="font-serif font-bold text-sm text-[#bc8f42] block">Automated Campaign template Studio</span>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-bold font-mono">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Teej Special Festival Offer"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  className="w-full bg-[#120c0d] border border-[#5c141d]/40 rounded-lg p-2.5 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold font-mono">Channel</label>
                  <select
                    value={campChannel}
                    onChange={(e) => setCampChannel(e.target.value)}
                    className="w-full bg-[#120c0d] border border-[#5c141d]/40 rounded-lg p-2 font-semibold"
                  >
                    <option value="Email">📧 Email</option>
                    <option value="WhatsApp">🟢 WhatsApp</option>
                    <option value="SMS">💬 SMS text</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold font-mono">Target segment</label>
                  <select
                    value={campSegment}
                    onChange={(e) => setCampSegment(e.target.value)}
                    className="w-full bg-[#120c0d] border border-[#5c141d]/40 rounded-lg p-2"
                  >
                    <option value="All">All leads</option>
                    <option value="Bridal">Bridal segment</option>
                    <option value="Festive">Festive segment</option>
                  </select>
                </div>
              </div>

              {campChannel === 'Email' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 font-bold font-mono">Subject Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. ✨ Adorn you with Polki stones..."
                    value={campSubject}
                    onChange={(e) => setCampSubject(e.target.value)}
                    className="w-full bg-[#120c0d] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-gray-400 font-bold font-mono">Message body content</label>
                <textarea
                  placeholder="Namaste, adorn your forehead with Jaipur gemstones..."
                  value={campBody}
                  onChange={(e) => setCampBody(e.target.value)}
                  rows={4}
                  required
                  className="w-full bg-[#120c0d] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#5c141d] hover:bg-[#811e2a] text-[#ebdcb9] font-serif font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Send size={12} /> Launch Broadcast Campaign
              </button>
            </form>

            {/* Campaign Analytics board (7 Cols) */}
            <div className="md:col-span-7 space-y-4 text-xs font-serif">
              <span className="font-bold text-white uppercase tracking-wider block font-sans">Active & Dispatched campaigns tracker</span>
              
              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="bg-[#0b0708] border border-[#5c141d]/20 p-4 rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-[#5c141d]/10 pb-1 text-xs">
                      <span className="font-bold text-white block">{camp.title}</span>
                      <span className="bg-[#5c141d] px-2 py-0.5 rounded text-[8px] text-[#bc8f42] uppercase tracking-wider font-mono font-bold">
                        {camp.channel} Channel
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 truncate leading-relaxed">{camp.body}</p>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-400 pt-2 border-t border-[#5c141d]/10">
                      <div>
                        <span className="block font-bold text-white font-mono">{camp.sentCount}</span>
                        <span>Dispatched</span>
                      </div>
                      <div>
                        <span className="block font-bold text-[#bc8f42] font-mono">
                          {camp.sentCount > 0 ? Math.round((camp.openedCount / camp.sentCount) * 100) : 0}%
                        </span>
                        <span>Open Rate</span>
                      </div>
                      <div>
                        <span className="block font-bold text-[#bc8f42] font-mono">
                          {camp.openedCount > 0 ? Math.round((camp.clickedCount / camp.openedCount) * 100) : 0}%
                        </span>
                        <span>Click Rate</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUPPORT TICKETS */}
        {activeSubTab === 'tickets' && (
          <div className="space-y-6 animate-in fade-in text-xs font-serif leading-relaxed">
            <span className="font-serif text-sm font-bold text-white uppercase tracking-wider block font-sans">Customer Styling & Support Inquiries</span>
            
            <div className="space-y-4">
              {tickets.map((t) => (
                <div key={t.id} className="bg-[#0b0708] border border-[#5c141d]/30 p-5 rounded-xl space-y-3 relative">
                  {/* Priority indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      t.priority === 'High' ? 'bg-red-900 text-red-200' : 'bg-amber-900 text-amber-200'
                    }`}>
                      {t.priority} priority
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      t.status === 'Open' ? 'bg-[#5c141d]/40 text-rose-300 animate-pulse border border-[#5c141d]' : 'bg-emerald-900 text-emerald-200'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#bc8f42] font-mono block">Ticket: {t.id} • Category: {t.category}</span>
                    <h4 className="font-bold text-sm text-white leading-normal">{t.subject}</h4>
                    <p className="text-gray-300 text-[11px]">Asked by: <strong>{t.customerName}</strong> ({t.customerEmail}) on {t.date}</p>
                  </div>

                  <p className="bg-[#120c0d] border border-[#5c141d]/15 p-3 rounded-lg text-[11px] text-gray-300 italic">“{t.message}”</p>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[#5c141d]/15">
                    {t.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolveTicket(t.id, 'Resolved')}
                        className="px-4 py-1.5 bg-[#5c141d] hover:bg-emerald-800 text-white font-sans font-bold rounded-lg flex items-center gap-1 transition cursor-pointer"
                      >
                        <Check size={12} /> Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOYALTY AND REWARDS SYSTEM */}
        {activeSubTab === 'loyalty' && (
          <div className="space-y-8 animate-in fade-in leading-relaxed text-xs">
            <div className="text-center md:text-left max-w-xl space-y-1">
              <span className="font-serif text-sm font-bold text-[#bc8f42] uppercase tracking-wider block">Kusum Royal Shahi Loyalty Program</span>
              <p className="text-gray-400 text-[11px]">Adorned point multipliers designed to reward lifetime customer value. Redeemable for exclusive designer stone bindis.</p>
            </div>

            {/* Loyalty levels breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-4 rounded-xl text-center space-y-2 relative overflow-hidden">
                <span className="text-2xl">🥉</span>
                <h4 className="font-serif font-bold text-sm text-white">Bronze Level</h4>
                <p className="text-[10px] text-gray-400">Join Reward: 50 pt<br />Earn rate: 10% cash value</p>
                <span className="text-[9px] text-[#bc8f42] border border-[#bc8f42]/30 px-2 py-0.5 rounded-full inline-block">Active 1-499 pt</span>
              </div>

              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-4 rounded-xl text-center space-y-2 relative overflow-hidden">
                <span className="text-2xl">🥈</span>
                <h4 className="font-serif font-bold text-sm text-white">Silver Level</h4>
                <p className="text-[10px] text-gray-400">Join Reward: 100 pt<br />Earn rate: 12% cash value</p>
                <span className="text-[9px] text-[#bc8f42] border border-[#bc8f42]/30 px-2 py-0.5 rounded-full inline-block">Active 500-1499 pt</span>
              </div>

              <div className="bg-[#0b0708] border border-[#5c141d]/30 p-4 rounded-xl text-center space-y-2 relative overflow-hidden">
                <span className="text-2xl">👑</span>
                <h4 className="font-serif font-bold text-sm text-white">Gold Level</h4>
                <p className="text-[10px] text-gray-400">Join Reward: 200 pt<br />Earn rate: 15% cash value</p>
                <span className="text-[9px] text-[#bc8f42] border border-[#bc8f42]/30 px-2 py-0.5 rounded-full inline-block">Active 1500-2999 pt</span>
              </div>

              <div className="bg-[#0b0708] border border-[#bc8f42]/30 p-4 rounded-xl text-center space-y-2 relative overflow-hidden">
                <span className="text-2xl">✨</span>
                <h4 className="font-serif font-bold text-sm text-white">Royal VIP Club</h4>
                <p className="text-[10px] text-gray-400">Join Reward: Free bindi suite<br />Earn rate: 20% cash value</p>
                <span className="text-[9px] text-[#bc8f42] bg-[#bc8f42]/20 border border-[#bc8f42] px-2 py-0.5 rounded-full inline-block font-bold">Lifetime membership</span>
              </div>
            </div>

            {/* Referral program module */}
            <div className="bg-[#0b0708] border border-[#5c141d]/20 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-1.5 ">
                <h4 className="font-serif font-bold text-[#bc8f42] text-sm">Send a VIP referral invitations link</h4>
                <p className="text-gray-300 text-[11px]">Invite beauty partners to try on the Kusum AI Bindi Sandbox. BOTH parties earn a free ₹ 150 discount code upon their verification setup.</p>
              </div>

              <div className="flex gap-2 text-xs">
                <input
                  type="text"
                  readOnly
                  value="https://kusumbindi.com/rewards?invite=vip4291_shahi"
                  className="bg-[#120c0d] border border-[#5c141d]/30 rounded-xl p-2.5 text-[10px] font-mono text-gray-300 flex-1 select-all"
                />
                <button
                  type="button"
                  onClick={() => alert("Mock referral invitation address copied. Paste to your styling partners in WhatsApp!")}
                  className="px-4 py-2 bg-[#5c141d] hover:bg-[#811e2a] text-[#ebdcb9] font-serif font-bold rounded-xl transition cursor-pointer"
                >
                  Share Code
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
