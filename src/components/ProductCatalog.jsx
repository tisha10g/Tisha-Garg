import React, { useState } from 'react';
import { Star, SlidersHorizontal, ShieldCheck, Heart, ShoppingBag, Eye, X, CheckCircle, Gift, Truck } from 'lucide-react';
export default function ProductCatalog({
  lang,
  products,
  onCreateOrder,
  onRefreshData,
  wishlist,
  onToggleWishlist,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  selectedDetailId,
  setSelectedDetailId
}) {
  // Filter states
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFaceCompat, setActiveFaceCompat] = useState('All');
  const [activeSize, setActiveSize] = useState('All');
  const [priceSort, setPriceSort] = useState('none');

  // Checkout flows
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutMethod, setCheckoutMethod] = useState('COD');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleteCode, setOrderCompleteCode] = useState(null);

  // New review submission state inside detailmodal
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  // Filtering calculations
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesShape = activeFaceCompat === 'All' || p.recommendedFaceShapes.includes(activeFaceCompat);
    const matchesSize = activeSize === 'All' || p.size === activeSize || p.size === 'Combo';
    return matchesCategory && matchesShape && matchesSize;
  });

  if (priceSort === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Selected Product Detail lookup
  const selectedProduct = products.find(p => p.id === selectedDetailId);
  const relatedProducts = products.filter(p => p.id !== selectedDetailId).slice(0, 3);

  // Checkout submission handling
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!checkoutName || !checkoutEmail) return;

    setIsOrdering(true);
    const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const orderItemsPayload = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: checkoutName,
          customerEmail: checkoutEmail,
          items: orderItemsPayload,
          total: totalAmount,
          paymentMethod: checkoutMethod
        })
      });
      const data = await response.json();
      if (data.success && data.order) {
        setOrderCompleteCode(data.order.id);
        onClearCart();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrdering(false);
    }
  };

  // Live Review Adding
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewText || !selectedProduct) return;
    
    selectedProduct.reviews.unshift({
      author: newReviewAuthor,
      rating: newReviewRating,
      text: newReviewText,
      date: new Date().toISOString().split('T')[0]
    });

    // Recalculate average rating
    const totalStars = selectedProduct.reviews.reduce((sum, r) => sum + r.rating, 0);
    selectedProduct.rating = Number((totalStars / selectedProduct.reviews.length).toFixed(1));

    setNewReviewAuthor('');
    setNewReviewText('');
    setNewReviewRating(5);
  };

  return (
    <div id="shop_collections_screen" className="space-y-10 py-6 pb-12 animate-in fade-in duration-500">
      
      {/* 2-Column Split: Cart Drawer / Products Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN A: PRODUCTS DISPLAY & FILTERING (9 COLS) */}
        <div className="lg:col-span-9 space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#5c141d]/30 pb-4 gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {lang === 'en' ? 'Signature Bindi Catalog' : 'राजपूताना बिंदी संग्रह'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'en' ? "Filter Kusum's classic gemstones matching your bespoke lifestyle dimensions." : "अपनी सौंदर्य आवश्यकताओं के अनुसार सर्वोत्तम श्रेणी निर्मित बिंदियां चुनें।"}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#120c0d] px-3 py-1.5 rounded-lg border border-[#5c141d]/30">
              <SlidersHorizontal size={14} className="text-[#bc8f42]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#ebdcb9]">Filters Enabled</span>
            </div>
          </div>

          {/* Filtering Widgets */}
          <div className="bg-[#120c0d] border border-[#5c141d]/20 rounded-2xl p-4 md:p-6 space-y-4 text-xs">
            {/* Row 1: Categories */}
            <div className="space-y-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Bindi Category:</span>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Bridal', 'Traditional', 'Designer', 'Stone', 'Velvet', 'Minimalist'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full cursor-pointer transition ${
                      activeCategory === cat 
                        ? 'bg-[#5c141d] text-white border border-[#bc8f42]/40 font-semibold' 
                        : 'bg-[#0b0708] border border-[#5c141d]/20 text-[#ebdcb9]/70 hover:border-[#bc8f42]/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {/* Face Compatibility filter */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Face shape matched:</span>
                <select
                  value={activeFaceCompat}
                  onChange={(e) => setActiveFaceCompat(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/30 rounded-lg p-2 text-xs text-[#ebdcb9]"
                >
                  <option value="All">All Shapes Compatibilities</option>
                  <option value="Round">Round shapes</option>
                  <option value="Oval">Oval profiles</option>
                  <option value="Heart">Heart curves</option>
                  <option value="Square">Square sharp angles</option>
                  <option value="Diamond">Diamond cheeks</option>
                </select>
              </div>

              {/* Bindi Size filter */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Bindi Size specification:</span>
                <select
                  value={activeSize}
                  onChange={(e) => setActiveSize(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/30 rounded-lg p-2 text-xs text-[#ebdcb9]"
                >
                  <option value="All">All Available Sizes (S/M/L)</option>
                  <option value="Small">Small accent stones</option>
                  <option value="Medium">Medium ornaments</option>
                  <option value="Large">Large bridal statement dots</option>
                  <option value="Combo">Combo multiplex packs</option>
                </select>
              </div>

              {/* Price arrangement */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Sort by price:</span>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/30 rounded-lg p-2 text-xs text-[#ebdcb9]"
                >
                  <option value="none">Standard sorting</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid list of bindis */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isSaved = wishlist.includes(p.id);
                return (
                  <div key={p.id} className="bg-[#120c0d] border border-[#5c141d]/30 hover:border-[#bc8f42]/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 group">
                    <div className="relative h-48 bg-[#080506] overflow-hidden">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => onToggleWishlist(p.id)}
                        className="absolute top-3 right-3 p-2 bg-[#0b0708]/80 text-white rounded-full hover:text-[#c24050] transition cursor-pointer"
                        title="Add to Wishlist"
                      >
                        <Heart size={14} className={isSaved ? "fill-[#c24050] text-[#c24050]" : ""} />
                      </button>
                      <span className="absolute top-3 left-3 bg-[#5c141d] border border-[#bc8f42]/30 text-white font-mono text-[9px] py-0.5 px-2.5 rounded-full uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 
                            onClick={() => setSelectedDetailId(p.id)}
                            className="font-serif font-extrabold text-sm text-white hover:text-[#bc8f42] cursor-pointer transition line-clamp-1"
                          >
                            {p.name}
                          </h3>
                        </div>
                        <p className="text-[10px] text-[#ebdcb9]/75 line-clamp-2 leading-relaxed">{p.description}</p>
                      </div>

                      {/* Info details row */}
                      <div className="flex items-center justify-between text-[10px] border-t border-[#5c141d]/20 pt-3">
                        <span className="font-extrabold text-white text-xs">₹ {p.price}</span>
                        <div className="flex items-center text-amber-400">
                          <Star size={11} className="fill-amber-400 mr-0.5" />
                          <span>{p.rating} ({p.reviews.length})</span>
                        </div>
                      </div>

                      {/* Buying CTA */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                        <button
                          onClick={() => setSelectedDetailId(p.id)}
                          className="py-1.5 px-3 bg-[#1c1214] border border-[#5c141d]/45 hover:bg-[#281c1f] text-[#ebdcb9] rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Eye size={12} /> View Look
                        </button>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="py-1.5 px-3 bg-[#5c141d] hover:bg-[#811e2a] text-[#ebdcb9] rounded-lg transition text-center cursor-pointer flex items-center justify-center gap-1 border border-[#bc8f42]/20"
                        >
                          <ShoppingBag size={12} /> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 font-serif border border-[#5c141d]/20 rounded-2xl bg-[#120c0d]">
              No direct matching bindis found inside selected parameters. Clear your filters to load the master tray.
            </div>
          )}

        </div>

        {/* COLUMN B: THE CART DRAWER (3 COLS) */}
        <div className="lg:col-span-3 bg-[#120c0d] border border-[#bc8f42]/20 rounded-3xl p-5 space-y-6 shadow-2xl relative">
          <div className="flex items-center justify-between border-b border-[#5c141d]/30 pb-3">
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={16} className="text-[#bc8f42]" />
              <span className="font-serif font-bold text-sm text-white">{lang === 'en' ? 'Shopping Tray' : 'बिंदी की थैली'}</span>
            </div>
            <span className="text-[10px] bg-[#5c141d] px-2 py-0.5 text-white font-mono rounded">
              {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
            </span>
          </div>

          {cart.length > 0 ? (
            <div className="space-y-4">
              {/* Product items lists */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 justify-between items-start border-b border-[#5c141d]/20 pb-2 text-xs">
                    <div className="h-10 w-10 bg-[#0b0708] rounded-md overflow-hidden shrink-0">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 space-y-0.5 min-w-0">
                      <span className="block font-bold text-white truncate max-w-[120px]">{item.product.name}</span>
                      <span className="text-[10px] text-[#bc8f42] block">₹ {item.product.price} × {item.quantity}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="text-gray-500 hover:text-[#c24050] transition cursor-pointer text-[10px] font-mono"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-1.5 border-t border-[#5c141d]/20 pt-4 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Tray Total:</span>
                  <span className="text-white">₹ {cart.reduce((ac, it) => ac + (it.product.price * it.quantity), 0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee (COD):</span>
                  <span className="text-[#bc8f42] font-semibold font-mono">FREE DELIVERY</span>
                </div>
                <div className="flex justify-between font-bold border-t border-[#5c141d]/30 pt-2 text-sm text-white">
                  <span>Grand total:</span>
                  <span>₹ {cart.reduce((ac, it) => ac + (it.product.price * it.quantity), 0)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-2.5 bg-gradient-to-r from-[#811e2a] to-[#5c141d] text-[#ebdcb9] text-xs font-bold rounded-xl cursor-pointer hover:bg-[#811e2a] duration-300 shadow-md flex items-center justify-center gap-1"
              >
                SECURE CHECKOUT NOW
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-500 space-y-2">
              <Gift size={20} className="mx-auto text-[#bc8f42]/40" />
              <p>Your shopping tray is currently empty. Shop your favorites now!</p>
            </div>
          )}

          <div className="pt-2 text-center text-[10px] text-gray-400 border-t border-[#5c141d]/20 space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Truck size={10} className="text-[#bc8f42]" /> <span>Free Express Delivery Across India</span>
            </p>
          </div>
        </div>

      </div>

      {/* DETAIL OVERLAY SLIDE DIALOG */}
      {selectedProduct && (
        <div id="product_detail_dialog" className="fixed inset-0 z-50 bg-[#0b0708]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120c0d] border-2 border-[#bc8f42]/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 animate-in zoom-in-95 leading-normal space-y-6">
            
            <button
              onClick={() => setSelectedDetailId(null)}
              className="absolute top-4 right-4 p-2 bg-[#1c1214] text-gray-400 hover:text-white rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Product Body: Split column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Image Zoomer simulation */}
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-[#bc8f42]/20 group">
                  <img 
                    src={selectedProduct.imageUrl} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-125 cursor-zoom-in"
                    title="Hover to zoom"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[#000000]/70 py-1.5 text-center text-[10px] text-gray-300 font-mono tracking-widest uppercase">
                    🔭 Hover image to zoom gemstone detailed facets
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="h-16 w-16 bg-[#160f11] rounded-xl overflow-hidden border border-[#5c141d]/30 cursor-pointer">
                    <img src={selectedProduct.imageUrl} alt="alt thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="h-16 w-16 bg-[#1c1214] rounded-xl flex items-center justify-center text-[10px] text-[#bc8f42] font-semibold border border-dashed border-[#bc8f42]/30">
                    Handmade Core
                  </div>
                  <div className="h-16 w-16 bg-[#1c1214] rounded-xl flex items-center justify-center text-[10px] text-rose-300 font-semibold border border-dashed border-rose-300/35">
                    Safe Skin
                  </div>
                </div>
              </div>

              {/* Right Column: Spec charts */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#bc8f42] uppercase tracking-widest font-mono font-bold block">{selectedProduct.category} Collection SKU</span>
                  <h3 className="font-serif text-2xl font-extrabold text-white">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#bc8f42]">₹ {selectedProduct.price}</span>
                    <div className="flex items-center text-amber-500 text-xs">
                      <Star size={12} className="fill-amber-500 mr-0.5" />
                      <span>{selectedProduct.rating} / 5 Rating</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{selectedProduct.description}</p>

                {/* Spec metrics table */}
                <div className="bg-[#0b0708] border border-[#5c141d]/30 rounded-xl p-3 text-[11px] space-y-1 text-gray-400">
                  <div className="flex justify-between border-b border-[#5c141d]/10 pb-1">
                    <span>Dimension Sizes:</span>
                    <span className="text-white font-semibold">{selectedProduct.size}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#5c141d]/10 pb-1">
                    <span>Face Compatibilities:</span>
                    <span className="text-white font-semibold text-rose-300">{selectedProduct.recommendedFaceShapes.join(", ")}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#5c141d]/10 pb-1">
                    <span>Craft Shade Color:</span>
                    <span className="text-white font-semibold">{selectedProduct.color}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#5c141d]/10 pb-1">
                    <span>Gemstone Encrust:</span>
                    <span className="text-white font-semibold">{selectedProduct.stoneType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inventory Stock code:</span>
                    <span className={`font-semibold ${selectedProduct.stock > 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedProduct.stock} Left In Stock
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(selectedProduct);
                      setSelectedDetailId(null);
                    }}
                    className="flex-1 py-2 bg-[#5c141d] text-[#ebdcb9] font-bold text-xs rounded-xl hover:bg-[#811e2a] cursor-pointer transition text-center"
                  >
                    ADD TO MY CART
                  </button>
                  <button
                    onClick={() => {
                      onToggleWishlist(selectedProduct.id);
                    }}
                    className="p-2.5 bg-[#160f11] hover:bg-[#281c1f] rounded-xl border border-[#bc8f42]/30 text-white cursor-pointer"
                  >
                    <Heart size={16} className={wishlist.includes(selectedProduct.id) ? "fill-[#c24050] text-[#c24050]" : ""} />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Section: Write a Review Form and Review Lists & Recos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#5c141d]/40 space-y-3">
              {/* Product Review form */}
              <div className="space-y-4">
                <span className="font-serif text-sm font-semibold text-[#bc8f42] block">Write A Verified Customer Review</span>
                
                <form onSubmit={handleSubmitReview} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      required
                      className="bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none"
                    />
                    <div className="flex items-center gap-1 bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2">
                      <span className="text-gray-400">Stars:</span>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="bg-transparent text-amber-400 font-bold focus:outline-none"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ 5</option>
                        <option value="4">⭐⭐⭐⭐ 4</option>
                        <option value="3">⭐⭐⭐ 3</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    placeholder="Write your bindi comfort feedback..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#bc8f42] hover:bg-[#9c7130] text-black font-serif font-extrabold rounded-lg transition"
                  >
                    Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs">
                  {selectedProduct.reviews.map((rev, i) => (
                    <div key={i} className="bg-[#0b0708] p-3 rounded-lg border border-[#5c141d]/10 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#ebdcb9]">{rev.author}</span>
                        <div className="flex items-center text-amber-500 font-mono">
                          <Star size={10} className="fill-amber-500 mr-0.5" /> <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-[11px] leading-relaxed italic">“{rev.text}”</p>
                      <span className="text-[10px] text-[#bc8f42]/70 block">{rev.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related/Complementary Carousels */}
              <div className="space-y-3">
                <span className="font-serif text-sm font-semibold text-[#bc8f42] block">Complementary Fashion Accessories Match</span>
                <p className="text-[10px] text-gray-400">Our stylings suggest matching traditional ornaments with this specific gemstone layout:</p>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#0b0708] p-2 border border-[#5c141d]/20 rounded-xl text-center space-y-1">
                    <span className="text-lg">👑</span>
                    <span className="block text-[9px] font-bold text-white">Classic Maang Tikka</span>
                    <span className="text-[8px] text-gray-400">Matte Gold Fill</span>
                  </div>
                  <div className="bg-[#0b0708] p-2 border border-[#5c141d]/20 rounded-xl text-center space-y-1">
                    <span className="text-lg">💎</span>
                    <span className="block text-[9px] font-bold text-white">Shahi Jhumka Drops</span>
                    <span className="text-[8px] text-gray-400">Jaipur Emeralds</span>
                  </div>
                  <div className="bg-[#0b0708] p-2 border border-[#5c141d]/20 rounded-xl text-center space-y-1">
                    <span className="text-lg">💫</span>
                    <span className="block text-[9px] font-bold text-white">Kundan Nose Ring</span>
                    <span className="text-[8px] text-gray-400">Sacred Bride</span>
                  </div>
                </div>

                <div className="bg-[#5c141d]/10 p-3 rounded-xl border border-[#bc8f42]/15 text-[10px] text-gray-300">
                  ⚡ <strong>Combo Promotion:</strong> Buy this package with Shahi Jhumka earrings for a flat 15% discount code applied at checkout!
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CHECKOUT WIZARD SCREEN POPUP */}
      {showCheckout && (
        <div id="checkout_wizard_panel" className="fixed inset-0 z-50 bg-[#0b0708]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120c0d] border-2 border-[#bc8f42]/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 leading-normal">
            
            <button
              onClick={() => {
                setShowCheckout(false);
                setOrderCompleteCode(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {!orderCompleteCode ? (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="text-center space-y-1 pb-2 border-b border-[#5c141d]/30">
                  <span className="text-sm font-serif font-bold text-[#bc8f42]">Secure Razorpay & Card Checkout</span>
                  <p className="text-[10px] text-gray-400">Enter delivery address details to establish the package tracking code.</p>
                </div>

                {/* Cost recap */}
                <div className="bg-[#0b0708] p-3 rounded-xl border border-[#5c141d]/40 text-xs flex justify-between font-bold text-[#bc8f42]">
                  <span>Amount to Pay (COD Enabled):</span>
                  <span>₹ {cart.reduce((ac, it) => ac + (it.product.price * it.quantity), 0)}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Roy"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full bg-[#0b0708] border border-[#5c141d]/45 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@gmail.com"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full bg-[#0b0708] border border-[#5c141d]/45 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 font-mono uppercase">Mobile Number (For WhatsApp Updates)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98300 98300"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="w-full bg-[#0b0708] border border-[#5c141d]/45 rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Payment method toggle */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 font-mono uppercase block">Payment Gateway Channel</label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setCheckoutMethod('COD')}
                        className={`py-2 border rounded-lg text-center font-bold ${
                          checkoutMethod === 'COD' 
                            ? 'border-[#bc8f42] bg-[#5c141d]/30 text-white' 
                            : 'border-slate-800 text-gray-400'
                        }`}
                      >
                        Cash on Delivery (COD)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutMethod('Card')}
                        className={`py-2 border rounded-lg text-center font-bold flex items-center justify-center gap-1 ${
                          checkoutMethod === 'Card' 
                            ? 'border-[#bc8f42] bg-[#5c141d]/30 text-white' 
                            : 'border-slate-800 text-gray-400'
                        }`}
                      >
                        Secure Razorpay / Card
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isOrdering}
                  className="w-full py-3 bg-gradient-to-r from-[#bc8f42] to-[#cca75d] text-black font-serif font-extrabold rounded-xl transition shadow-lg cursor-pointer"
                >
                  {isOrdering ? "ESTABLISHING PAYMENT SYSTEM..." : "CONFIRM ORDER & SECURE ADHESIVES"}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 animate-in fade-in py-6">
                <CheckCircle size={44} className="text-emerald-400 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-white">Order Confirmed! Pranam!</h3>
                <p className="text-xs text-gray-300">
                  Your majestic Kusum bindis order <strong>{orderCompleteCode}</strong> has been registered successfully on our servers.
                </p>
                <div className="bg-[#0b0708] p-3 rounded-xl border border-[#5c141d]/20 text-[10px] text-gray-400 text-left space-y-1 font-mono">
                  <div>• Customer Segment: Festive VIP</div>
                  <div>• Shipment Status: Standard Processing</div>
                  <div>• Free tracking: Yes (Estimated 3 days arrival)</div>
                </div>
                <button
                  onClick={() => {
                    setShowCheckout(false);
                    setOrderCompleteCode(null);
                  }}
                  className="px-6 py-2 bg-[#5c141d] hover:bg-[#811e2a] text-[#ebdcb9] rounded-full text-xs font-bold transition"
                >
                  Return to Shopping
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
