import { Sparkles, ArrowRight, Camera, Star, Heart, Bookmark, MessageSquare } from 'lucide-react';

interface HomeHeroProps {
  lang: 'en' | 'hi';
  setCurrentTab: (tab: string) => void;
  onSelectProduct: (productId: string) => void;
}

export default function HomeHero({ lang, setCurrentTab, onSelectProduct }: HomeHeroProps) {
  const occasions = [
    { id: 'Wedding', name: lang === 'en' ? 'Grand Wedding' : 'शादी समारोह', desc: lang === 'en' ? 'Royal heavy stones' : 'शाही भारी पत्थर बिंदी', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300' },
    { id: 'Festival', name: lang === 'en' ? 'Festive Joy' : 'त्यौहार विशेष', desc: lang === 'en' ? 'traditional colours' : 'पारंपरिक सुंदर रंग', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300' },
    { id: 'Party', name: lang === 'en' ? 'Bold Party' : 'पार्टी और आधुनिक', desc: lang === 'en' ? 'Swarovski highlights' : 'चमकदार क्रिस्टल बिंदु', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300' },
    { id: 'Casual', name: lang === 'en' ? 'Chic Casual' : 'दैनिक उपयोग', desc: lang === 'en' ? 'Soft multi-velvets' : 'मखमली साधारण बिंदी', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300' }
  ];

  const trendingBindis = [
    { id: 'b1', name: 'Royal Bridal Kundan Bindi', price: '₹ 599', rating: 4.9, img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300' },
    { id: 'b2', name: 'Delicate Teardrop Pearl Bindi', price: '₹ 349', rating: 4.8, img: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=300' },
    { id: 'b5', name: 'Midnight Star Swarovski Bindi', price: '₹ 299', rating: 4.9, img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300' }
  ];

  const reviews = [
    { name: 'Kareena K.', text: lang === 'en' ? '“The virtual try-on predicted my round face shape perfectly! The Shahi gold bindi felt like jewelry on my forehead.”' : '“वर्चुअल ट्राई-ऑन ने मेरे चेहरे के आकार की सटीक पहचान की! शाही बिंदी सोने के गहने जैसी लगती है।”', rating: 5, date: 'May 2026' },
    { name: 'Deepika S.', text: lang === 'en' ? '“Unmatched stone quality. Usually adhesive gives me red itching but Kusum bindis are highly medical-grade, safe and pure royal-looking.”' : '“अद्वितीय पत्थरों की गुणवत्ता। कुसुम बिंदियां त्वचा के लिए पूरी तरह से सुरक्षित हैं।”', rating: 5, date: 'April 2026' }
  ];

  const instagramPosts = [
    { url: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=200', likes: '1.2k' },
    { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200', likes: '2.5k' },
    { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200', likes: '942' },
    { url: 'https://images.unsplash.com/photo-1588444839799-eb0c99e19d1e?auto=format&fit=crop&q=80&w=200', likes: '3.1k' }
  ];

  return (
    <div id="home_view" className="space-y-16 pb-12 animate-in fade-in duration-500">
      
      {/* 1. Hero Block */}
      <section id="hero_section" className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center bg-gradient-to-br from-[#200a0e] via-[#0b0708] to-[#120507] border border-[#5c141d]/30 px-6 md:px-12 py-12">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#5c141d]/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#bc8f42]/5 blur-[80px] pointer-events-none" />
        
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5c141d]/40 rounded-full border border-[#bc8f42]/30 text-xs text-[#bc8f42] font-semibold">
            <Sparkles size={14} className="animate-spin" />
            <span>{lang === 'en' ? 'YOUR PERSONAL AI FASHION BINDI ASSISTANT' : 'आपका व्यक्तिगत एआई फैशन बिंदी सहायक'}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {lang === 'en' ? 'Beauty Begins With' : 'सौंदर्य की शुरुआत होती है'}{' '}
            <span className="bg-gradient-to-r from-[#bc8f42] via-[#ebdcb9] to-[#cca75d] bg-clip-text text-transparent">
              Kusum Fancy Bindi
            </span>
          </h1>

          <p className="text-[#ebdcb9]/80 text-sm md:text-base leading-relaxed max-w-xl">
            {lang === 'en'
              ? 'Discover the perfect bindi scientifically matched to your face shape, costume shade, organic makeup layout and physical occasion. Experience our instant AR Virtual Try-On tool now.'
              : 'अपने चेहरे के आकार, पोशाक के रंग, और उत्तम मेकअप लेआउट के अनुकूल सर्वोत्तम बिंदी की खोज करें। हमारे त्वरित एआर वर्चुअल ट्राई-ऑन का अनुभव करें।'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentTab('ai-recommend')}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#811e2a] to-[#5c141d] hover:to-[#811e2a] text-[#ebdcb9] font-semibold text-xs md:text-sm tracking-uppercase flex items-center gap-2 cursor-pointer border border-[#bc8f42]/30 shadow-lg hover:shadow-maroon-500/20 transition-all duration-300"
            >
              <span>{lang === 'en' ? 'Get AI recommendation' : 'AI सिफारिश प्राप्त करें'}</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => setCurrentTab('tryon')}
              className="px-6 py-3 rounded-full bg-[#160f11] hover:bg-[#281c1f] text-[#bc8f42] font-semibold text-xs md:text-sm flex items-center gap-2 cursor-pointer border border-[#bc8f42]/40 transition duration-300"
            >
              <Camera size={16} />
              <span>{lang === 'en' ? 'AR Virtual Try-On' : 'आभासी ट्राई-ऑन'}</span>
            </button>
          </div>
        </div>

        {/* Feature side overlay */}
        <div className="hidden lg:flex absolute right-16 top-1/2 -translate-y-1/2 w-80 h-96 overflow-hidden rounded-2xl border-2 border-[#bc8f42]/30 bg-[#0b0708]/80 shadow-2xl p-4 flex-col justify-between">
          <div className="text-center font-serif text-xs text-[#bc8f42] tracking-widest uppercase border-b border-[#5c141d]/30 pb-2">
            AI Spotlight Try-On
          </div>
          <div className="relative h-48 w-full bg-[#1c1214] rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200" 
              alt="Model avatar" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            {/* Pulsating target / Bindi circle */}
            <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2">
              <span className="block h-4 w-4 rounded-full bg-[#c24050] ring-4 ring-[#bc8f42] animate-pulse" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#5c141d] text-[#ebdcb9] text-[8px] px-2 py-0.5 rounded border border-[#bc8f42]/20 font-mono whitespace-nowrap">
                KUSUM BRIDAL KUNDAN
              </div>
            </div>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-white text-xs font-bold font-serif">{lang === 'en' ? 'Kusum Shahi Collection' : 'कुसुम शाही संग्रह'}</h4>
            <p className="text-[10px] text-gray-400">Suitable profile: Round & Oval shape</p>
            <button 
              onClick={() => setCurrentTab('tryon')} 
              className="text-xs text-[#bc8f42] underline hover:text-[#ebdcb9] transition cursor-pointer"
            >
              Try on this look
            </button>
          </div>
        </div>
      </section>

      {/* 2. Shop Categories by Occasion */}
      <section id="shop_by_occasion" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-white">
              {lang === 'en' ? 'Luxury Collections' : 'शाही बिंदी संग्रह'}
            </h2>
            <p className="text-xs text-gray-400">
              {lang === 'en' ? 'Exquisite designs curated specifically for prominent event segments.' : 'प्रमुख पारिवारिक अवसरों के अनुरूप तैयार की गई मनमोहक बिंदु कला।'}
            </p>
          </div>
          <button 
            onClick={() => setCurrentTab('shop')} 
            className="text-xs text-[#bc8f42] hover:text-[#ebdcb9] flex items-center gap-1 cursor-pointer transition underline"
          >
            {lang === 'en' ? 'View all products' : 'सभी उत्पाद देखें'} <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {occasions.map((o) => (
            <div
              key={o.id}
              onClick={() => setCurrentTab('shop')}
              className="group relative h-48 rounded-2xl overflow-hidden border border-[#5c141d]/30 hover:border-[#bc8f42]/50 transition duration-300 cursor-pointer"
            >
              <img 
                src={o.img} 
                alt={o.name} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a0a] via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="font-serif text-white font-bold text-sm leading-tight">{o.name}</span>
                <span className="text-[10px] text-[#bc8f42]">{o.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured / Trending Bindis */}
      <section id="trending_curation" className="space-y-6 bg-gradient-to-r from-[#160f11]/60 to-[#0b0708] p-6 md:p-10 rounded-3xl border border-[#5c141d]/20">
        <div className="max-w-xl space-y-2">
          <span className="text-xs text-[#bc8f42] font-semibold tracking-wider font-mono uppercase">WEEKLY HOT SELLERS</span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
            {lang === 'en' ? 'Trending Masterpieces' : 'इस सप्ताह के सर्वश्रेष्ठ डिज़ाइन'}
          </h2>
          <p className="text-xs text-gray-400">
            {lang === 'en' ? 'Handselected customer favorites which have topped conversion ratings.' : 'ग्राहकों द्वारा अत्यधिक पसंद किए गए लोकप्रिय डिज़ाइन।' }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {trendingBindis.map((tb) => (
            <div
              key={tb.id}
              onClick={() => onSelectProduct(tb.id)}
              className="bg-[#0b0708] hover:bg-[#160f11] border border-[#5c141d]/30 hover:border-[#bc8f42]/40 p-4 rounded-xl flex items-center gap-4 transition duration-300 cursor-pointer group"
            >
              <div className="h-16 w-16 bg-[#160f11] rounded-lg overflow-hidden shrink-0 border border-[#5c141d]/40">
                <img 
                  src={tb.img} 
                  alt={tb.name} 
                  className="w-full h-full object-cover group-hover:scale-110 duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#ebdcb9] font-serif group-hover:text-[#bc8f42] duration-300">{tb.name}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">{tb.price}</span>
                  <div className="flex items-center text-amber-400 text-[10px]">
                    <Star size={10} className="fill-amber-400 mr-0.5" />
                    <span>{tb.rating}</span>
                  </div>
                </div>
                <span className="text-[9px] text-[#bc8f42]/70 underline">Click to view details</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Luxury Bridal Collection Spotlight */}
      <section id="bridal_spotlight" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#1c1214]/50 p-6 md:p-12 rounded-3xl border-2 border-[#bc8f42]/25">
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden border border-[#5c141d]/40">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600" 
            alt="Royal Indian Bride with Kundan" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-red-900/90 text-white text-[10px] font-bold py-1 px-3 rounded-full border border-[#bc8f42]">
            PREMIUM ROYAL BRIDAL SPANNER
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs text-[#bc8f42] font-semibold tracking-wider font-mono">HERITAGE FASHION</span>
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-white leading-tight">
            The Eternal Royal Shahi <br />
            <span className="bg-gradient-to-r from-red-500 to-[#bc8f42] bg-clip-text text-transparent">Kundan & Gems Suite</span>
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            {lang === 'en' 
              ? 'Our signature Kundan range is crafted inside of sterilized royal boutique environments in Jaipur and Rajkot, using original micro-stones, pearls and high-durability hypo-allergenic skin adhesive. Elegant bindi designs that swing with your steps, catching the spotlight of your lifetime bride moments.'
              : 'हमारा विशेष कुंदन रेन्ज जयपुर और राजकोट में असली छोटे पत्थरों, मोतियों और त्वचा के अनुकूल गोंद के साथ बनाया जाता है। यह आपकी पोशाक और सुंदरता को शाही रूप प्रदान करता है।'}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentTab('shop')} 
              className="px-5 py-2.5 bg-[#5c141d] hover:bg-[#811e2a] border border-[#bc8f42]/40 rounded-full text-xs text-[#ebdcb9] font-bold transition cursor-pointer"
            >
              {lang === 'en' ? 'Explore Bridal Collections' : 'दुल्हन संग्रह देखें'}
            </button>
            <button 
              onClick={() => {
                onSelectProduct('b1');
              }}
              className="px-5 py-2.5 bg-[#160f11] hover:bg-[#281c1f] text-[#bc8f42] text-xs font-bold border border-[#bc8f42]/30 rounded-full transition cursor-pointer"
            >
              {lang === 'en' ? 'View Best Seller' : 'लोकप्रिय देखें'}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Customer Reviews Scrolling Feedback */}
      <section id="reviews_testimonial" className="space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h3 className="font-serif text-2xl font-bold text-white">{lang === 'en' ? 'Aura of Kusum Bindis' : 'कुसुम सौंदर्य की प्रशंसा'}</h3>
          <p className="text-xs text-gray-400">{lang === 'en' ? 'Here is how real VIP customers perceive our premium craftsmanship.' : 'हमारे वीआईपी ग्राहकों के कुछ वास्तविक विचार।'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r, idx) => (
            <div key={idx} className="bg-[#1c1214]/60 border border-[#5c141d]/30 p-6 rounded-2xl relative space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-serif text-white font-bold text-sm">{r.name}</span>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#ebdcb9]/90 italic leading-relaxed">{r.text}</p>
              <div className="text-[10px] text-[#bc8f42] font-semibold">{r.date}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Instagram & Social Feed Grid */}
      <section id="instagram_feed" className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#5c141d]/30 pb-3">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-white">#KusumFancyBindi on Instagram</h3>
            <p className="text-xs text-gray-400">Tag us online to win VIP reward points.</p>
          </div>
          <a href="#" className="text-xs text-[#bc8f42] hover:underline font-semibold font-mono">FOLLOW @KUSUM_BINDI</a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {instagramPosts.map((post, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden cursor-pointer h-40 border border-[#5c141d]/30">
              <img 
                src={post.url} 
                alt="Instagram look" 
                className="w-full h-full object-cover group-hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#0b0708]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 gap-3">
                <div className="flex items-center text-rose-500 text-xs font-bold gap-1">
                  <Heart size={14} className="fill-rose-500" /> {post.likes}
                </div>
                <div className="text-white text-xs font-bold">
                  <MessageSquare size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
