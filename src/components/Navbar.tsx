import { useState } from 'react';
import { Sparkles, Calendar, Tag, Activity, ShoppingBag, Info, Phone, Users, ShieldAlert, Heart, MessageSquare } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  cartCount: number;
  wishlistCount: number;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  cartCount,
  wishlistCount
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const navigation = [
    { id: 'home', label: lang === 'en' ? 'Home' : 'मुख्य पृष्ठ', icon: Sparkles },
    { id: 'shop', label: lang === 'en' ? 'Shop Collections' : 'बिंदी संग्रह', icon: ShoppingBag },
    { id: 'ai-recommend', label: lang === 'en' ? 'AI Recommendations' : 'AI सिफारिशें', icon: Sparkles },
    { id: 'tryon', label: lang === 'en' ? 'Virtual Try-On' : 'आभासी ट्राई-ऑन', icon: Sparkles },
    { id: 'crm', label: lang === 'en' ? 'CRM Suite' : 'सीआरएम सुइट', icon: Users },
    { id: 'admin', label: lang === 'en' ? 'Admin Panel' : 'एडमिन पैनल', icon: ShieldAlert },
    { id: 'about', label: lang === 'en' ? 'Our Story' : 'हमारी कहानी', icon: Info },
  ];

  const notifications = [
    { id: 1, text: lang === 'en' ? "🎉 Festival Offer: Code TEEJ30 gives 30% off!" : "🎉 उत्सव ऑफ़र: कोड TEEJ30 से 30% छूट पाएं!", time: "2 min ago" },
    { id: 2, text: lang === 'en' ? "✨ Your AI recommendation report is generated!" : "✨ आपकी AI सिफारिशें तैयार हैं!", time: "1 hour ago" },
    { id: 3, text: lang === 'en' ? "🛍️ New collection 'Shahi Danglers' added!" : "🛍️ नया कलेक्शन 'शाही डैंगलर्स' शामिल!", time: "1 day ago" }
  ];

  return (
    <header id="main_header" className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0708]/90 border-b border-[#5c141d]/40 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start cursor-pointer" onClick={() => setCurrentTab('home')}>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-serif font-bold tracking-wider bg-gradient-to-r from-[#bc8f42] via-[#ebdcb9] to-[#cca75d] bg-clip-text text-transparent">
              KUSUM FANCY BINDI
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#c24050] animate-ping" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#bc8f42] font-semibold">
            {lang === 'en' ? 'Luxury Bindis for Every Occasion' : 'हर अवसर के लिए शाही बिंदु सौंदर्य'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap justify-center items-center gap-1 bg-[#160f11] p-1 rounded-full border border-[#5c141d]/30">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'bg-[#5c141d] text-[#ebdcb9] border border-[#bc8f42]/40 shadow-[0_0_15px_rgba(92,20,29,0.5)]'
                    : 'text-[#ebdcb9]/75 hover:text-[#ebdcb9] hover:bg-[#160f11]'
                }`}
              >
                {isActive && <Icon size={14} className="text-[#bc8f42]" />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Global actions: Language, Wishlist, Cart, Notifications */}
        <div id="nav-actions" className="flex items-center gap-3">
          {/* Language Switch */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center text-xs font-semibold px-2 py-1 rounded bg-[#1c1214] text-[#bc8f42] border border-[#5c141d]/40 cursor-pointer hover:bg-[#281c1f] transition"
          >
            {lang === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
          </button>

          {/* Cart with count badge */}
          <button
            onClick={() => setCurrentTab('shop')}
            className="relative p-2 rounded-full hover:bg-[#1c1214] transition cursor-pointer text-[#ebdcb9] hover:text-[#bc8f42]"
            title="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c24050] text-[#ebdcb9] text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-[#0b0708]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-[#1c1214] transition cursor-pointer text-[#ebdcb9] hover:text-[#bc8f42]"
              title="Notifications & Offers"
            >
              <Sparkles size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#bc8f42] rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div id="notif-dropdown" className="absolute right-0 mt-3 w-80 bg-[#160f11] border border-[#bc8f42]/30 rounded-xl p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-3">
                <div className="flex items-center justify-between border-b border-[#5c141d]/30 pb-2 mb-3">
                  <span className="font-serif font-bold text-sm text-[#bc8f42]">
                    {lang === 'en' ? 'Announcements & Gifts' : 'घोषणाएँ और उपहार'}
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[10px] text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="text-xs border-b border-[#5c141d]/20 pb-2 last:border-none last:pb-0">
                      <p className="text-white font-medium">{n.text}</p>
                      <span className="text-[10px] text-[#bc8f42] font-semibold">{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 text-center border-t border-[#5c141d]/30">
                  <span className="text-[10px] text-gray-300">
                    {lang === 'en' ? '✨ Powered by Kusum AI styling engines' : '✨ कुसुम एआई स्टाइलिंग इंजन द्वारा संचालित'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
