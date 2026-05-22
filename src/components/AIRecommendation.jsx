import React, { useState } from 'react';
import { Sparkles, RefreshCw, Eye, Camera, ArrowRight, User, ShoppingBag } from 'lucide-react';
export default function AIRecommendation({
  lang,
  products,
  setCurrentTab,
  onSelectProduct,
  setRecommendedBindiId,
  onAddLead
}) {
  // Wizard state
  const [faceShape, setFaceShape] = useState('');
  const [occasion, setOccasion] = useState('');
  const [outfit, setOutfit] = useState('');
  const [makeupStyle, setMakeupStyle] = useState('');
  
  // Lead Capture Dialog (to increase conversion rate of AI user)
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [askedForLead, setAskedForLead] = useState(false);

  // Recommendation states
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [matchedProducts, setMatchedProducts] = useState([]);

  const faceShapes = [
    { id: 'Round', name: lang === 'en' ? 'Round Face' : 'गोल चेहरा', desc: lang === 'en' ? 'Balanced width & length' : 'समान चौड़ाई और लंबाई', icon: '🔴' },
    { id: 'Oval', name: lang === 'en' ? 'Oval Face' : 'अंडाकार चेहरा', desc: lang === 'en' ? 'Slightly longer shape' : 'लंबाई थोड़ी और अधिक', icon: '🥚' },
    { id: 'Heart', name: lang === 'en' ? 'Heart Face' : 'हृदयाकार चेहरा', desc: lang === 'en' ? 'Wide temples, pointed chin' : 'चौड़ा माथा, नुकीली ठुड्डी', icon: '🤍' },
    { id: 'Square', name: lang === 'en' ? 'Square Face' : 'चौकोर चेहरा', desc: lang === 'en' ? 'Strong jawline, sharp angles' : 'मजबूत जबड़ा, तीखे कोण', icon: '⬜' },
    { id: 'Diamond', name: lang === 'en' ? 'Diamond Face' : 'हीरा आकार चेहरा', desc: lang === 'en' ? 'Short forehead, wide cheeks' : 'छोटा माथा, चौड़े गाल', icon: '🔹' }
  ];

  const occasions = [
    { id: 'Wedding', name: lang === 'en' ? 'Royal Wedding' : 'शादी समारोह' },
    { id: 'Festival', name: lang === 'en' ? 'Traditional Festival' : 'त्यौहार विशेष' },
    { id: 'Party', name: lang === 'en' ? 'Glam Party / Dinner' : 'पार्टी और डिनर' },
    { id: 'Casual', name: lang === 'en' ? 'Casual Outing' : 'साधारण दिन' },
    { id: 'Office', name: lang === 'en' ? 'Formal / Corporate' : 'कार्यालय' }
  ];

  const outfits = [
    { id: 'Saree', name: lang === 'en' ? 'Classic Silk Saree' : 'सिल्क साड़ी' },
    { id: 'Lehenga', name: lang === 'en' ? 'Heavy Designer Lehenga' : 'हैवी लहंगा' },
    { id: 'Suit', name: lang === 'en' ? 'Salwar Suit & Anarkali' : 'सलवार सूट' },
    { id: 'Indo-Western', name: lang === 'en' ? 'Indo-Western Dress' : 'इंडो-वेस्टर्न पोशाक' },
    { id: 'Western', name: lang === 'en' ? 'Western Evening Gown' : 'वेस्टर्न शाम का गाउन' }
  ];

  const makeupStyles = [
    { id: 'Bridal Glam', name: lang === 'en' ? 'Gilded Bridal Glamor' : 'दुल्हन विशेष सजना' },
    { id: 'Natural Makeup', name: lang === 'en' ? 'Soft Dewy Natural Look' : 'प्राकृतिक रूप' },
    { id: 'Smokey Eyes', name: lang === 'en' ? 'Smokey Kohl-Rimmed Eyes' : 'काजल युक्त स्मोकी आँखें' },
    { id: 'Bold Party Look', name: lang === 'en' ? 'Bold Lipstick & Contour' : 'बोल्ड लिपस्टिक और सजना' },
    { id: 'Minimal Makeup', name: lang === 'en' ? 'Fine Eyeliner & Gloss' : 'न्यूनतम मेकअप' }
  ];

  const triggerAIRecommendation = async (e) => {
    e.preventDefault();
    if (!faceShape || !occasion || !outfit || !makeupStyle) return;

    setIsLoading(true);
    setRecommendationResult(null);

    // Save lead data automatically in CRM
    if (customerEmail) {
      onAddLead({
        name: customerName || 'Anoymous Guest',
        email: customerEmail,
        phone: customerPhone || '+91 91234 56789',
        source: 'Try-On User',
        notes: `AI Recommendation requested: ${faceShape}, ${occasion}, ${outfit}, ${makeupStyle}`
      });
    }

    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceShape, occasion, outfit, makeupStyle })
      });
      const data = await response.json();
      
      if (data.success && data.recommendation) {
        setRecommendationResult(data.recommendation);
        
        // Match actual products based on recommendations
        const searchTags = [faceShape.toLowerCase(), occasion.toLowerCase(), outfit.toLowerCase()];
        const matched = products.filter(p => {
          // If the product lists this face shape
          const shapeMatch = p.recommendedFaceShapes.some(s => s.toLowerCase() === faceShape.toLowerCase());
          // Or matches tags/category
          const categoryMatch = p.category.toLowerCase() === (occasion === 'Wedding' ? 'bridal' : occasion === 'Festival' ? 'traditional' : 'designer');
          return shapeMatch || categoryMatch;
        });

        // Fallback if none matched
        setMatchedProducts(matched.length > 0 ? matched.slice(0, 3) : products.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFaceShape('');
    setOccasion('');
    setOutfit('');
    setMakeupStyle('');
    setRecommendationResult(null);
    setAskedForLead(false);
  };

  return (
    <div id="ai_recommendation_screen" className="space-y-10 max-w-5xl mx-auto py-6 pb-12 animate-in fade-in duration-500">
      
      {/* Header Block */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#bc8f42]/10 border border-[#bc8f42]/40 rounded-full text-xs text-[#bc8f42] font-semibold">
          <Sparkles size={12} />
          <span>{lang === 'en' ? 'KUSUM COUTURE AI' : 'कुसुम विशेष एआई'}</span>
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {lang === 'en' ? 'AI Bindi Suggestion Engine' : 'एआई बिंदी सिफारिश शैली'}
        </h2>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Input your styling parameters, and let our Gemini AI match your physical anatomy with symmetric luxury accessories.'
            : 'अपनी स्टाइलिंग आवश्यकताएं दर्ज करें, और कुसुम एआई को आपके चेहरे के अनुकूल आदम कद ज्वेलरी का मेल बिठाने दें।'}
        </p>
      </div>

      {!recommendationResult ? (
        /* WIZARD SETUP FORM */
        <div className="bg-[#120c0d] border border-[#5c141d]/30 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8">
          
          {/* Step 1: Face Shape Selector */}
          <div className="space-y-4">
            <label className="block font-serif text-sm font-bold text-[#bc8f42] uppercase tracking-wider">
              {lang === 'en' ? '1. Select Your Face Profile' : '1. अपने चेहरे का आकार चुनें'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {faceShapes.map((shape) => {
                const isSel = faceShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    onClick={() => setFaceShape(shape.id)}
                    className={`p-4 rounded-xl border text-left transition duration-300 cursor-pointer flex flex-col justify-between h-28 ${
                      isSel 
                        ? 'border-[#bc8f42] bg-[#5c141d]/20 text-white shadow-[0_0_12px_rgba(188,143,66,0.2)]' 
                        : 'border-[#5c141d]/20 bg-[#0b0708] text-[#ebdcb9]/70 hover:border-[#bc8f42]/40'
                    }`}
                  >
                    <span className="text-2xl">{shape.icon}</span>
                    <div>
                      <span className="block text-xs font-bold font-serif">{shape.name}</span>
                      <span className="text-[9px] text-[#bc8f42]/85 line-clamp-1">{shape.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 2: Occasion */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-serif uppercase tracking-wider">
                {lang === 'en' ? '2. Event/Occasion' : '2. अवसर प्रकार'}
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-xl px-4 py-3 text-xs text-[#ebdcb9] focus:outline-none focus:border-[#bc8f42] cursor-pointer"
              >
                <option value="">{lang === 'en' ? '-- Select Occasion --' : '-- अवसर चुनें --'}</option>
                {occasions.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            {/* Step 3: Outfit style */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-serif uppercase tracking-wider">
                {lang === 'en' ? '3. Outfit Shade & Style' : '3. पोशाक और परिधान रंग'}
              </label>
              <select
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-xl px-4 py-3 text-xs text-[#ebdcb9] focus:outline-none focus:border-[#bc8f42] cursor-pointer"
              >
                <option value="">{lang === 'en' ? '-- Select Outfit Style --' : '-- पोशाक प्रकार --'}</option>
                {outfits.map((ou) => (
                  <option key={ou.id} value={ou.id}>{ou.name}</option>
                ))}
              </select>
            </div>

            {/* Step 4: Makeup Layout */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-serif uppercase tracking-wider">
                {lang === 'en' ? '4. Cosmetics / Makeup Theme' : '4. सौंदर्य प्रसाधन मेकअप रंग'}
              </label>
              <select
                value={makeupStyle}
                onChange={(e) => setMakeupStyle(e.target.value)}
                className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-xl px-4 py-3 text-xs text-[#ebdcb9] focus:outline-none focus:border-[#bc8f42] cursor-pointer"
              >
                <option value="">{lang === 'en' ? '-- Select Makeup Style --' : '-- मेकअप प्रकार चुनें --'}</option>
                {makeupStyles.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer / VIP lead generation trigger (optional but good for CRM value capture) */}
          {!askedForLead ? (
            <div className="p-4 rounded-2xl bg-[#5c141d]/15 border border-[#bc8f42]/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#bc8f42] font-serif block">✨ Want an instant VIP Style Profile in Kusum CRM?</span>
                <p className="text-[10px] text-gray-400">Unlock a free 200 welcome shopping reward points by adding your email address.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setAskedForLead(true)} 
                className="px-4 py-2 bg-[#5c141d] hover:bg-[#811e2a] text-[#ebdcb9] font-semibold text-[11px] rounded-lg transition"
              >
                Sync Kusum CRM Profile
              </button>
            </div>
          ) : (
            <div className="bg-[#1c1214] border border-[#5c141d]/40 rounded-2xl p-4 space-y-3">
              <span className="font-serif text-xs font-bold text-[#bc8f42] block">Kusum CRM Style Profile Capture</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  placeholder="Your Full Name" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-[#0b0708] border border-[#5c141d]/30 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
                <input 
                  type="email" 
                  placeholder="Your VIP Email Address" 
                  value={customerEmail} 
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="bg-[#0b0708] border border-[#5c141d]/30 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
                <input 
                  type="tel" 
                  placeholder="Your WhatsApp Number (For notifications)" 
                  value={customerPhone} 
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-[#0b0708] border border-[#5c141d]/30 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Trigger button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={triggerAIRecommendation}
              disabled={isLoading || !faceShape || !occasion || !outfit || !makeupStyle}
              className="px-10 py-4 bg-gradient-to-r from-[#bc8f42] to-[#cca75d] hover:from-[#cca75d] hover:to-[#bc8f42] rounded-full text-black font-serif font-extrabold text-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(188,143,66,0.3)]"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin inline" />
                  <span>Curating Royal Report via Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Customized Styling Report</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        /* RECOMMENDATION REPORT BLOCK */
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          
          {/* Top general styling advice */}
          <div className="bg-[#120c0d] border border-[#bc8f42]/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-[#5c141d] text-[#bc8f42] text-[10px] font-bold uppercase rounded-bl-xl font-mono border-l border-b border-[#bc8f42]/20">
              {recommendationResult.isTraditional ? "Symmetric Traditional Style" : "Contemporary Modern Style"}
            </div>

            <div className="space-y-4">
              <span className="text-xs text-[#bc8f42] font-semibold tracking-wider font-mono">YOUR LUXURY STYLING SCHEME</span>
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">
                {recommendationResult.bindiStyleRecommendation}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
              <div className="space-y-2 pb-2 border-b border-[#5c141d]/30 md:border-none md:pb-0">
                <div className="flex justify-between">
                  <span className="text-gray-400">Recommended Size:</span>
                  <span className="font-bold text-white uppercase font-mono">{recommendationResult.idealSizeCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Face Profile Match:</span>
                  <span className="font-bold text-[#bc8f42]">{faceShape} Face</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Suitable Makeup Partner:</span>
                  <span className="font-bold text-white">{makeupStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Perfect Outfit Harmony:</span>
                  <span className="font-bold text-white">{outfit}</span>
                </div>
              </div>
            </div>

            {/* Generated description modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#5c141d]/30">
              <div className="space-y-2">
                <span className="text-[10px] text-[#bc8f42] font-extrabold uppercase tracking-widest block font-serif">Color Matching Advice</span>
                <p className="text-[11px] text-[#ebdcb9]/85 leading-relaxed">{recommendationResult.colorMatchingAdvise}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#bc8f42] font-extrabold uppercase tracking-widest block font-serif">Jewelry & Stone Design</span>
                <p className="text-[11px] text-[#ebdcb9]/85 leading-relaxed">{recommendationResult.stoneDesignJustification}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-[#bc8f42] font-extrabold uppercase tracking-widest block font-serif">Celebrity Inspiration</span>
                <p className="text-[11px] text-[#ebdcb9]/85 leading-relaxed font-semibold italic">{recommendationResult.celebrityInspiration}</p>
                <p className="text-[10px] text-gray-400">{recommendationResult.stylingTip}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-[#5c141d]/30 justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block p-1.5 rounded-full bg-[#bc8f42]/10 text-[#bc8f42]">
                  <Sparkles size={14} />
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Expert makeup complement tip: {recommendationResult.makeupComplementTip}</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Try different combination
              </button>
            </div>
          </div>

          {/* ACTUAL MATCHED BINDI PRODUCTS */}
          <div className="space-y-6">
            <div className="text-center md:text-left space-y-1">
              <h3 className="font-serif text-xl font-bold text-white">Recommended Kusum Bindis For Your Report</h3>
              <p className="text-xs text-gray-400">Direct matches found in our luxury hand-made collections corresponding to shape and style.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedProducts.map((p) => (
                <div key={p.id} className="bg-[#120c0d] border border-[#5c141d]/35 hover:border-[#bc8f42]/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div className="relative h-44 bg-[#0b0708] overflow-hidden">
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-[#5c141d]/90 border border-[#bc8f42]/40 rounded-full px-2.5 py-0.5 text-[9px] font-mono text-[#bc8f42]">
                      {p.category} COLLECTION
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#bc8f42] transition">{p.name}</h4>
                      <p className="text-[10px] text-[#ebdcb9]/75 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-[#5c141d]/20 pt-3">
                      <span className="font-bold text-[#ebdcb9]">₹ {p.price}</span>
                      <span className="text-[10px] text-[#bc8f42] font-semibold">{p.size} Size</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-center">
                      <button
                        onClick={() => onSelectProduct(p.id)}
                        className="py-1.5 px-3 bg-[#1c1214] border border-[#5c141d]/55 rounded-lg hover:bg-[#281c1f] text-white transition cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setRecommendedBindiId(p.id);
                          setCurrentTab('tryon');
                        }}
                        className="py-1.5 px-3 bg-[#5c141d] rounded-lg text-white hover:bg-[#811e2a] transition duration-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Camera size={12} /> Try-On
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
