import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Bookmark, Share2, Info, ArrowLeftRight, Check, Sparkles, Smile, Maximize2, Minimize2, Trash2 } from 'lucide-react';
export default function VirtualTryOn({
  lang,
  products,
  currentRecommendedId,
  setRecommendedBindiId,
  onAddLead
}) {
  const [selectedBindi, setSelectedBindi] = useState(
    products.find(p => p.id === currentRecommendedId) || products[0]
  );

  // Model portraits
  const models = [
    { id: 'm1', name: lang === 'en' ? 'Model Aishwarya (Oval)' : 'मॉडल ऐश्वर्या (अंडाकार)', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400' },
    { id: 'm2', name: lang === 'en' ? 'Model Kareena (Round)' : 'मॉडल करीना (गोल)', url: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=400' },
    { id: 'm3', name: lang === 'en' ? 'Model Priyanka (Heart)' : 'मॉडल प्रियंका (हृदय)', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400' }
  ];

  const [activeModel, setActiveModel] = useState(models[0]);
  const [useCamera, setUseCamera] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  // DRAG and RESIZE bindi placement state
  const [bindiPos, setBindiPos] = useState({ x: 50, y: 35 }); // percentages
  const [bindiSize, setBindiSize] = useState(24); // px
  const [isDragging, setIsDragging] = useState(false);
  const [beforeAfter, setBeforeAfter] = useState<'both' | 'after'>('after'); // comparative toggle
  const [savedLooks, setSavedLooks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const containerRef = useRef(null);

  // Track if recommended id changed globally
  useEffect(() => {
    if (currentRecommendedId) {
      const found = products.find(p => p.id === currentRecommendedId);
      if (found) {
        setSelectedBindi(found);
      }
    }
  }, [currentRecommendedId, products]);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setUseCamera(true);
    } catch (err) {
      console.error(err);
      setCameraError(lang === 'en' 
        ? 'Could not access local camera. Ensure browser frame permissions are allowed.' 
        : 'कैमरे की अनुमति नहीं मिली। कृपया परमिशन की जाँच करें।');
      setUseCamera(false);
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setUseCamera(false);
  };

  // Clean-up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Handle Dragging / Mouse Coordinates
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Bounds check
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    setBindiPos({ x: boundedX, y: boundedY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile responsive try-on
  const handleTouchMove = (e) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    const boundedX = Math.max(5, Math.min(95, x));
    const boundedY = Math.max(5, Math.min(95, y));
    setBindiPos({ x: boundedX, y: boundedY });
  };

  // Save current look to CRM favorites and state
  const handleSaveLook = () => {
    if (!selectedBindi) return;
    const newLook = {
      id: 'looks_' + Date.now(),
      bindiName: selectedBindi.name,
      modelName: useCamera ? 'My Camera Face' : activeModel.name,
      date: new Date().toLocaleDateString()
    };
    setSavedLooks([newLook, ...savedLooks]);

    // Send save customer preference to CRM Leads automatically
    onAddLead({
      name: 'AR Sandbox User',
      email: 'ar.sandbox@kusumbindi.com',
      phone: '+91 98300 98300',
      source: 'Try-On User',
      notes: `Saved AR look: ${selectedBindi.name} positioned at x- ${Math.round(bindiPos.x)}%, y- ${Math.round(bindiPos.y)}% with scale ${bindiSize}px.`
    });
  };

  const handleRemoveLook = (id) => {
    setSavedLooks(savedLooks.filter(l => l.id !== id));
  };

  // Trigger Mock Share Dialog
  const handleShareLook = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(`https://kusumbindi.com/tryon?bindi=${selectedBindi?.id || 'b1'}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="virtual_tryon_screen" className="max-w-6xl mx-auto py-6 pb-12 space-y-10 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#bc8f42]/10 border border-[#bc8f42]/40 rounded-full text-xs text-[#bc8f42] font-semibold">
          <Smile size={12} />
          <span>{lang === 'en' ? 'AR COSMETIC SANDBOX' : 'एआर प्रसाधन साधन'}</span>
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {lang === 'en' ? 'AI Virtual Try-On Canvas' : 'आभासी बिंदी ट्राई-ऑन सैंडबॉक्स'}
        </h2>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          {lang === 'en'
            ? 'Adjust placement and sizes by dragging the crystal over the model or your live camera profile.'
            : 'मॉडल के चेहरे या अपने लाइव कैमरे पर बिंदी को ड्रैग करके सही आकार और जगह तय करें।'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: AR CANVAS VIEW (7 COLS) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#120c0d] border border-[#5c141d]/30 rounded-3xl p-4 md:p-6 shadow-2xl relative">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between mb-4 border-b border-[#5c141d]/20 pb-3 gap-2 text-xs">
            {/* Input Selection */}
            <div className="flex bg-[#0b0708] border border-[#5c141d]/40 rounded-full p-1">
              <button
                onClick={() => {
                  stopCamera();
                  setUseCamera(false);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition ${
                  !useCamera ? 'bg-[#5c141d] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'en' ? 'Model Face' : 'मॉडल का चेहरा'}
              </button>
              <button
                onClick={startCamera}
                className={`px-3 py-1 flex items-center gap-1.5 rounded-full text-[11px] font-semibold transition ${
                  useCamera ? 'bg-[#5c141d] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Camera size={12} />
                <span>{lang === 'en' ? 'Live Camera' : 'लाइव कैमरा'}</span>
              </button>
            </div>

            {/* Before After Toggle */}
            <div className="flex bg-[#0b0708] border border-[#5c141d]/20 rounded-full p-1">
              <button
                onClick={() => setBeforeAfter('after')}
                className={`px-2 py-0.5 rounded-full text-[9px] ${
                  beforeAfter === 'after' ? 'bg-[#bc8f42] text-black font-semibold' : 'text-gray-400'
                }`}
              >
                After
              </button>
              <button
                onClick={() => setBeforeAfter('both')}
                className={`px-2 py-0.5 rounded-full text-[9px] flex items-center gap-1 ${
                  beforeAfter === 'both' ? 'bg-[#bc8f42] text-black font-semibold' : 'text-gray-400'
                }`}
              >
                <ArrowLeftRight size={9} /> Compare
              </button>
            </div>

            {/* Bindi Size Adjust Slider */}
            <div className="flex items-center gap-2 bg-[#0b0708] px-3 py-1 rounded-xl border border-[#5c141d]/30">
              <span className="text-[10px] text-gray-400 font-serif">Bindi Size:</span>
              <input
                type="range"
                min="10"
                max="50"
                value={bindiSize}
                onChange={(e) => setBindiSize(Number(e.target.value))}
                className="w-20 accent-[#bc8f42] h-1 bg-[#1c1214] rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#bc8f42]">{bindiSize}px</span>
            </div>
          </div>

          {/* MAIN PHOTO DISPLAY AREA */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* The Try on Stage */}
            <div className="relative flex-1 bg-[#080506] rounded-2xl overflow-hidden aspect-[4/5] border border-[#bc8f42]/20 flex items-center justify-center">
              
              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchMove={handleTouchMove}
                className="relative w-full h-full cursor-crosshair select-none"
              >
                {/* 1. Either Video Camera Feed OR Static Model Card */}
                {useCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <img
                    src={activeModel.url}
                    alt={activeModel.name}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* 2. Drag & Resize Bindi Overlay element */}
                {selectedBindi && beforeAfter === 'after' && (
                  <div
                    onMouseDown={handleMouseDown}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-move transition-shadow ${
                      isDragging ? 'shadow-[0_0_15px_#bc8f42]' : 'hover:shadow-[0_0_8px_#bc8f42]'
                    }`}
                    style={{
                      left: `${bindiPos.x}%`,
                      top: `${bindiPos.y}%`,
                      width: `${bindiSize}px`,
                      height: `${bindiSize}px`,
                    }}
                  >
                    {/* Visual representation of current bindi */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                        src={selectedBindi.imageUrl} 
                        alt="Bindi stone"
                        className="w-full h-full rounded-full object-contain pointer-events-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]"
                        referrerPolicy="no-referrer"
                      />
                      {/* Interactive Drag Outline */}
                      {isDragging && (
                        <div className="absolute -inset-1 border border-dashed border-[#bc8f42] rounded-full" />
                      )}
                    </div>
                  </div>
                )}

                {/* COMPARATIVE SPLIT VIEW SIDE BY SIDE */}
                {selectedBindi && beforeAfter === 'both' && (
                  <div className="absolute inset-0 grid grid-cols-2">
                    <div className="relative border-r border-[#bc8f42]/40 h-full overflow-hidden bg-[#080506]">
                      {/* Before (Original Face shape) */}
                      {useCamera ? (
                        <video autoPlay playsInline muted className="w-[200%] max-w-none h-full object-cover scale-x-[-1]" />
                      ) : (
                        <img src={activeModel.url} alt="Model before" className="w-[200%] max-w-none h-full object-cover" referrerPolicy="no-referrer" />
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/60 border border-[#5c141d] rounded px-2 py-0.5 text-[8px] tracking-widest text-[#ebdcb9]">BEFORE</div>
                    </div>
                    
                    <div className="relative h-full overflow-hidden bg-[#0a0607]">
                      {/* After face with Bindi positioned */}
                      {useCamera ? (
                        <video autoPlay playsInline muted className="w-[200%] max-w-none ml-[-100%] h-full object-cover scale-x-[-1]" />
                      ) : (
                        <img src={activeModel.url} alt="Model after" className="w-[200%] max-w-none ml-[-100%] h-full object-cover" referrerPolicy="no-referrer" />
                      )}
                      {/* Render same bindi offset relative to this half */}
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-move"
                        style={{
                          left: `${50}%`,
                          top: `${bindiPos.y}%`,
                          width: `${bindiSize}px`,
                          height: `${bindiSize}px`,
                        }}
                      >
                        <img 
                          src={selectedBindi.imageUrl} 
                          alt="Bindi element"
                          className="w-full h-full rounded-full object-contain pointer-events-none drop-shadow-[0_2px_4px_black]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-[#5c141d]/75 border border-[#bc8f42] rounded px-2 py-0.5 text-[8px] tracking-widest text-white">AFTER</div>
                    </div>
                  </div>
                )}

                {/* Helper alignment line */}
                {isDragging && beforeAfter === 'after' && (
                  <div className="absolute inset-x-0 border-t border-dashed border-[#bc8f42]/30 pointer-events-none" style={{ top: `${bindiPos.y}%` }} />
                )}
              </div>
            </div>

            {/* Model Face selection selectors list (on static mode) */}
            {!useCamera && (
              <div className="md:w-48 flex md:flex-col justify-start gap-3 overflow-x-auto md:overflow-x-visible pb-2">
                <span className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-[#5c141d]/30 pb-1">
                  Choose Face shape:
                </span>
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveModel(m);
                      // Custom target layout positioning
                      if (m.id === 'm1') setBindiPos({ x: 49.3, y: 35.5 });
                      if (m.id === 'm2') setBindiPos({ x: 50.1, y: 33 });
                      if (m.id === 'm3') setBindiPos({ x: 49.8, y: 37 });
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition shrink-0 cursor-pointer ${
                      activeModel.id === m.id 
                        ? 'border-[#bc8f42] bg-[#1c1214] text-white' 
                        : 'border-[#5c141d]/20 bg-[#080506] text-[#ebdcb9]/60 hover:border-gray-500'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-[#160f11] shrink-0 border border-[#5c141d]/40">
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-semibold leading-tight">{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-[#5c141d]/20 gap-3">
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <Info size={12} className="text-[#bc8f42]" />
              <span>{lang === 'en' ? 'Click and Drag red stone over the face to customize alignment' : 'माथे पर बिंदी की जगह बदलने के लिए क्लिक करके ड्रैग करें'}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveLook}
                className="px-4 py-2 bg-[#160f11] hover:bg-[#281c1f] text-white rounded-lg border border-[#bc8f42]/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
              >
                <Bookmark size={14} className="text-[#bc8f42]" />
                <span>Save Look</span>
              </button>

              <button
                onClick={handleShareLook}
                className="px-4 py-2 bg-[#5c141d] hover:bg-[#811e2a] text-[#ebdcb9] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition border border-[#bc8f42]/30 shadow-md"
              >
                <Share2 size={14} />
                <span>Share Design</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RECOMMENDED BINDI GALLERY SELECTOR & STATS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Product Panel */}
          <div className="bg-[#120c0d] border border-[#bc8f42]/25 rounded-3xl p-5 space-y-4 shadow-xl">
            <span className="text-[10px] text-[#bc8f42] tracking-wider uppercase font-mono font-bold block">ACTIVE TRY-ON SELECTION</span>
            
            {selectedBindi ? (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-16 w-16 bg-[#0b0708] rounded-xl overflow-hidden border border-[#5c141d]/50 shrink-0">
                    <img src={selectedBindi.imageUrl} alt={selectedBindi.name} className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-serif font-bold text-sm text-white">{selectedBindi.name}</h3>
                    <span className="inline-block px-2 py-0.5 bg-[#5c141d] text-[8px] font-mono font-bold text-[#bc8f42] rounded-full border border-[#bc8f42]/20">
                      CRAFTED {selectedBindi.category.toUpperCase()}
                    </span>
                    <span className="block text-xs font-bold text-[#bc8f42] pt-1">₹ {selectedBindi.price}</span>
                  </div>
                </div>

                <div className="text-[11px] leading-relaxed text-gray-300">
                  {selectedBindi.description}
                </div>

                <div className="text-[11px] space-y-1.5 pt-2 border-t border-[#5c141d]/20 text-gray-400">
                  <div className="flex justify-between">
                    <span>Stone Structure:</span>
                    <span className="text-white font-semibold">{selectedBindi.stoneType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shade Profile:</span>
                    <span className="text-white font-semibold">{selectedBindi.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Face Compatibility:</span>
                    <span className="text-[#bc8f42] font-semibold">{selectedBindi.recommendedFaceShapes.join(", ")}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRecommendedBindiId(selectedBindi.id); // Triggers checkout hook
                    onAddLead({
                      name: 'AR Sandbox Buyer',
                      email: 'ar.checkout@kusumbindi.com',
                      phone: '+91 98300 98300',
                      source: 'Try-On User',
                      notes: `Selected product ${selectedBindi.name} for instant cart purchase via virtual Tryons.`
                    });
                    // Launch custom notification mimicking instant purchase
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#811e2a] to-[#5c141d] hover:to-[#811e2a] text-[#ebdcb9] tracking-wider text-xs font-serif font-extrabold rounded-xl border border-[#bc8f42]/40 shadow-lg cursor-pointer transition text-center block"
                >
                  ADD THIS LOOK TO CART
                </button>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Select a bindi design from the list below to load detailed dimensions.</span>
            )}
          </div>

          {/* Quick Swap Tray */}
          <div className="bg-[#120c0d] border border-[#5c141d]/30 rounded-3xl p-5 space-y-4">
            <span className="text-[10px] text-gray-400 tracking-widest uppercase font-mono block">QUICK SELECT SWAP TRAY</span>
            
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
              {products.map((p) => {
                const isSel = selectedBindi?.id === p.id;
                return (
                  <button
                    key={p.id}
                    title={p.name}
                    onClick={() => setSelectedBindi(p)}
                    className={`h-11 rounded-lg overflow-hidden border transition relative cursor-pointer ${
                      isSel ? 'border-[#bc8f42] ring-1 ring-[#bc8f42]' : 'border-[#5c141d]/40'
                    }`}
                  >
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {isSel && (
                      <div className="absolute inset-0 bg-[#bc8f42]/20 flex items-center justify-center">
                        <Check size={14} className="text-[#0b0708] bg-[#bc8f42] rounded-full p-0.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Looks list favorites (acts as CRM interaction tracker) */}
          {savedLooks.length > 0 && (
            <div className="bg-[#120c0d] border border-[#5c141d]/30 rounded-3xl p-5 space-y-3">
              <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase block">SAVED COMBINATIONS</span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                {savedLooks.map((look) => (
                  <div key={look.id} className="flex items-center justify-between border-b border-[#5c141d]/20 pb-2 last:border-none last:pb-0">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block truncate max-w-[150px]">{look.bindiName}</span>
                      <span className="text-[9px] text-[#bc8f42] block">{look.modelName} • {look.date}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveLook(look.id)}
                      className="p-1 text-gray-500 hover:text-[#c24050] transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div id="share_modal" className="fixed inset-0 z-50 bg-[#0b0708]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#160f11] border-2 border-[#bc8f42]/40 rounded-2xl p-6 max-w-sm w-full space-y-6 text-center shadow-2xl relative animate-in zoom-in-95 leading-normal">
            <span className="text-xl">🌟</span>
            <h3 className="font-serif text-lg font-bold text-white">Share Your Royal Look</h3>
            <p className="text-xs text-gray-300">Share your AR cosmetic layout on Instagram or WhatsApp with your styling partners.</p>
            
            <div className="bg-[#0b0708] border border-[#5c141d]/30 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
              <span className="truncate pr-4 text-gray-400">https://kusumbindi.com/tryon?bindi={selectedBindi?.id}</span>
              <button
                onClick={handleCopyLink}
                className="shrink-0 px-3 py-1 bg-[#5c141d] text-white rounded font-serif font-bold text-[10px] cursor-pointer hover:bg-[#811e2a]"
              >
                {copiedLink ? "COPIED" : "COPY LINK"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <a
                href="https://web.whatsapp.com/"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 bg-emerald-700 hover:bg-emerald-800 rounded-lg text-white flex items-center justify-center gap-1 cursor-pointer"
              >
                WhatsApp Look
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 rounded-lg text-white flex items-center justify-center gap-1 cursor-pointer"
              >
                Instagram Feed
              </a>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="text-[11px] text-[#bc8f42] underline block mx-auto cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
