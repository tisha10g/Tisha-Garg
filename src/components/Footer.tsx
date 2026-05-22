import { Sparkles, MessageSquare, ShieldCheck, Mail, MapPin, Award } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'hi';
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ lang, setCurrentTab }: FooterProps) {
  return (
    <footer id="brand_footer" className="bg-[#080506] border-t border-[#5c141d]/50 pt-12 pb-8 px-6 text-[#ebdcb9]/75 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <span className="font-serif text-lg font-bold tracking-wider text-[#bc8f42]">KUSUM FANCY BINDI</span>
          <p className="text-xs leading-relaxed">
            {lang === 'en' 
              ? 'Blending legacy Indian cosmetic heritage with modern AI styling recommendation and AR virtual try-on technology. Every bindi is crafted symmetrically for royal grace.'
              : 'आधुनिक AI स्टाइलिंग और AR आभासी तकनीक के साथ विरासत भारतीय प्रसाधन का मिलन। हर बिंदी आपके लिए बनाई गई है।'}
          </p>
          <div className="flex gap-2">
            <span className="bg-[#160f11] border border-[#5c141d]/40 p-2 rounded-full text-xs text-[#bc8f42] flex items-center gap-1">
              <Award size={14} /> VIP Luxury Certified
            </span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-white tracking-wide border-b border-[#5c141d]/30 pb-2">
            {lang === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setCurrentTab('home')} className="hover:text-[#bc8f42] transition cursor-pointer">
                {lang === 'en' ? 'Luxury Home' : 'मुख्य पृष्ठ'}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('shop')} className="hover:text-[#bc8f42] transition cursor-pointer">
                {lang === 'en' ? 'Shop Collections' : 'बिंदी संग्रह'}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('ai-recommend')} className="hover:text-[#bc8f42] transition cursor-pointer">
                {lang === 'en' ? 'AI Bindi Recommendations' : 'AI सिफारिशें'}
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab('tryon')} className="hover:text-[#bc8f42] transition cursor-pointer">
                {lang === 'en' ? 'Virtual Try-On Sandbox' : 'आभासी ट्राई-ऑन'}
              </button>
            </li>
          </ul>
        </div>

        {/* CRM Integrations & Technology Column */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-white tracking-wide border-b border-[#5c141d]/30 pb-2">
            {lang === 'en' ? 'Integrations' : 'एकीकरण'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2">
              <Sparkles size={12} className="text-[#bc8f42]" /> Gemini GenAI Engine
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#bc8f42]" /> Zoho & HubSpot CRM Connect
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare size={12} className="text-[#bc8f42]" /> WhatsApp Business API
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Razorpay Secured Mode
            </li>
          </ul>
        </div>

        {/* Address and support Column */}
        <div className="space-y-4">
          <h4 className="font-serif font-bold text-white tracking-wide border-b border-[#5c141d]/30 pb-2">
            {lang === 'en' ? 'Store & Contact' : 'संपर्क करें'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-[#bc8f42] shrink-0 mt-0.5" />
              <span>
                Kusum Luxury Boutique,<br />
                Chowringhee Road, Kolkata,<br />
                West Bengal - 700071
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-[#bc8f42]" />
              <a href="mailto:support@kusumbindi.com" className="hover:text-white">support@kusumbindi.com</a>
            </li>
            <li className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
              WhatsApp: +91 98300 98300
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-[#5c141d]/20 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#ebdcb9]/40 gap-4">
        <p>© 2026 Kusum Fancy Bindi. Crafted with royal Indian prestige and Gemini AI models. All rights reserved.</p>
        <p className="flex gap-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:underline">Terms of Use</a>
          <span>•</span>
          <a href="#" className="hover:underline">COD Regulations</a>
        </p>
      </div>
    </footer>
  );
}
