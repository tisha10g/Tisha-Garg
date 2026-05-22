import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeHero from './components/HomeHero';
import AIRecommendation from './components/AIRecommendation';
import VirtualTryOn from './components/VirtualTryOn';
import ProductCatalog from './components/ProductCatalog';
import CRMSystem from './components/CRMSystem';
import AdminPanel from './components/AdminPanel';
import AIChatbot from './components/AIChatbot';
import { Product } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home'); // home, shop, ai, tryon, crm, admin
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart & Wishlist hooks
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recommendedBindiId, setRecommendedBindiId] = useState<string | null>(null);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  // Global background fetch
  const retrieveProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products feed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveProducts();
  }, []);

  // Quick select details in shop
  const handleSelectProduct = (productId: any) => {
    setSelectedDetailId(productId);
    setCurrentTab('shop');
  };

  // Add lead on the go (API POST)
  const handleAddLead = async (leadPayload: { name: string; email: string; phone: string; source: 'Try-On User' | 'Newsletter' | 'Contact Form' | 'WhatsApp'; notes: string }) => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Cart Functions
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0708] text-white flex flex-col justify-between selection:bg-[#bc8f42] selection:text-black">
      
      {/* Dynamic Header */}
      <Navbar
        lang={lang}
        setLang={setLang}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
      />

      {/* Main Content Space */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 font-serif">
            <div className="relative w-12 h-12 border-4 border-[#5c141d]/30 border-t-[#bc8f42] rounded-full animate-spin" />
            <p className="font-serif text-sm text-[#bc8f42]">Establishing Royal Database connections...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeHero
                lang={lang}
                setCurrentTab={setCurrentTab}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {currentTab === 'shop' && (
              <ProductCatalog
                lang={lang}
                products={products}
                onCreateOrder={() => {}}
                onRefreshData={retrieveProducts}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onClearCart={handleClearCart}
                selectedDetailId={selectedDetailId}
                setSelectedDetailId={setSelectedDetailId}
              />
            )}

            {currentTab === 'ai-recommend' && (
              <AIRecommendation
                lang={lang}
                products={products}
                setCurrentTab={setCurrentTab}
                onSelectProduct={handleSelectProduct}
                setRecommendedBindiId={setRecommendedBindiId}
                onAddLead={handleAddLead}
              />
            )}

            {currentTab === 'tryon' && (
              <VirtualTryOn
                lang={lang}
                products={products}
                currentRecommendedId={recommendedBindiId}
                setRecommendedBindiId={setRecommendedBindiId}
                onAddLead={handleAddLead}
              />
            )}

            {currentTab === 'crm' && (
              <CRMSystem
                lang={lang}
              />
            )}

            {currentTab === 'admin' && (
              <AdminPanel
                lang={lang}
                onRefreshData={retrieveProducts}
              />
            )}
          </>
        )}
      </main>

      {/* Interactive AI chatbot styling assistant */}
      <AIChatbot lang={lang} />

      {/* Brand Footer */}
      <Footer lang={lang} setCurrentTab={setCurrentTab} />

    </div>
  );
}
