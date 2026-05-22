import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit, RefreshCw, Layers, CheckCircle2, DollarSign, Archive, RotateCcw } from 'lucide-react';
export default function AdminPanel({ lang, onRefreshData }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // New product form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Designer');
  const [newProductPrice, setNewProductPrice] = useState(199);
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductSize, setNewProductSize] = useState('Medium');
  const [newProductColor, setNewProductColor] = useState('Crimson Red');
  const [newProductStone, setNewProductStone] = useState('Standard Velvet');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductStock, setNewProductStock] = useState(50);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [resP, resO] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);
      const [pData, oData] = await Promise.all([
        resP.json(),
        resO.json()
      ]);
      setProducts(pData);
      setOrders(oData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Set default placeholder image based on category selection
  const handleCategoryChange = (cat) => {
    setNewProductCategory(cat);
    const mockImages = {
      Bridal: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=300',
      Stone: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300',
      Traditional: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=300',
      Minimalist: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=300'
    };
    setNewProductImage(mockImages[cat] || 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=300');
  };

  // Add Product REST callback
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductImage) return;

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          category: newProductCategory,
          price: Number(newProductPrice),
          imageUrl: newProductImage,
          size: newProductSize,
          color: newProductColor,
          stoneType: newProductStone,
          description: newProductDesc || 'Handcrafted premium quality Indian bindi with luxury finishes.',
          recommendedFaceShapes: ['Oval', 'Round', 'Heart'],
          stock: Number(newProductStock),
          tags: [newProductCategory, 'New-Arrival', 'Skinsafe']
        })
      });

      if (response.ok) {
        setNewProductName('');
        setNewProductDesc('');
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product REST callback
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to remove this bindi from stock? Devices will lose catalog synchronization.")) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchAdminData();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Process status update on orders (REST)
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin_control_view" className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-normal">
        <div className="bg-[#120c0d] border border-[#5c141d]/30 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-gray-400 block font-semibold">Total Stock SKUs</span>
            <span className="text-2xl font-serif font-extrabold text-[#bc8f42]">{products.length} Designs</span>
          </div>
          <Archive size={28} className="text-[#bc8f42]/40" />
        </div>

        <div className="bg-[#120c0d] border border-[#5c141d]/30 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-gray-400 block font-semibold">Transaction Orders</span>
            <span className="text-2xl font-serif font-extrabold text-white">{orders.length} Placed</span>
          </div>
          <Layers size={28} className="text-[#bc8f42]/40" />
        </div>

        <div className="bg-[#120c0d] border border-[#5c141d]/30 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-gray-400 block font-semibold">Processed Sales value</span>
            <span className="text-2xl font-serif font-extrabold text-white">₹ {orders.reduce((sum, o) => sum + o.total, 0)}</span>
          </div>
          <DollarSign size={28} className="text-[#bc8f42]/40" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN A: ADD PRODUCTS FORMS (4 COLS) */}
        <div className="lg:col-span-5 bg-[#120c0d] border border-[#5c141d]/35 p-5 md:p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-1.5 border-b border-[#5c141d]/30 pb-2">
            <Plus size={16} className="text-[#bc8f42]" />
            <span className="font-serif font-bold text-sm text-white">Add New Bindi Collection</span>
          </div>

          <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs leading-normal">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Bindi Name / Design Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Kusum Jaipur Star Kundan"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none text-white font-semibold"
                >
                  <option value="Bridal">Bridal Suite</option>
                  <option value="Designer">Designer Gems</option>
                  <option value="Stone">Stone/Crystal</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Velvet">Velvet Simple</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="50"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(Number(e.target.value))}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Size Code</label>
                <select
                  value={newProductSize}
                  onChange={(e) => setNewProductSize(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none"
                >
                  <option value="Small">Small size</option>
                  <option value="Medium">Medium size</option>
                  <option value="Large">Large size</option>
                  <option value="Combo">Combo multiplex</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Initial Stock</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(Number(e.target.value))}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Bindi Color Shading</label>
                <input
                  type="text"
                  placeholder="e.g. Sindoor Maroon"
                  value={newProductColor}
                  onChange={(e) => setNewProductColor(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Gemstones layout</label>
                <input
                  type="text"
                  placeholder="e.g. Swarovski crystals & wire"
                  value={newProductStone}
                  onChange={(e) => setNewProductStone(e.target.value)}
                  className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2">
                </input>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Model Image URL (Auto preview)</label>
              <input
                type="text"
                required
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
                className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none font-mono text-[10px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase">Description specs</label>
              <textarea
                placeholder="Details around craftsmanship and alignment limits..."
                value={newProductDesc}
                onChange={(e) => setNewProductDesc(e.target.value)}
                rows={3}
                className="w-full bg-[#0b0708] border border-[#5c141d]/40 rounded-lg p-2 focus:outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#bc8f42] hover:bg-[#9c7130] text-black font-serif font-extrabold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shadow-lg"
            >
              🚀 Launch Bindi Collection SKU
            </button>
          </form>
        </div>

        {/* COLUMN B: MASTER INDEX LISTING & ORDERS STATUS MODIFIER (7 COLS) */}
        <div className="lg:col-span-7 space-y-6 text-xs leading-normal">
          
          {/* Section B1: Current Stock SKUs */}
          <div className="bg-[#120c0d] border border-[#5c141d]/30 p-5 rounded-2xl space-y-3">
            <span className="font-serif font-bold text-sm text-white block">SKU Catalog & Inventory levels</span>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-[#0b0708] border border-[#5c141d]/15 rounded-lg">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={p.imageUrl} alt={p.name} className="h-8 w-8 rounded bg-[#160f11] object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate max-w-[180px]">{p.name}</span>
                      <span className="text-[9px] text-[#bc8f42] block font-mono">{p.category} | ₹ {p.price} | Stock: {p.stock}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 transition cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section B2: Orders Processing */}
          <div className="bg-[#120c0d] border border-[#5c141d]/30 p-5 rounded-2xl space-y-3">
            <span className="font-serif font-bold text-sm text-white block">E-commerce Orders & Shipments handler</span>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {orders.map((o) => (
                <div key={o.id} className="bg-[#0b0708] border border-[#5c141d]/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-[#5c141d]/15 pb-1">
                    <span className="font-mono font-bold text-white block">Order ID: {o.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                      o.status === 'Pending' ? 'bg-[#5c141d]/30 text-rose-300' :
                      o.status === 'Shipped' ? 'bg-[#bc8f42]/20 text-[#bc8f42]' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {o.status}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-300 leading-normal">
                    Deliver to: <strong>{o.customerName}</strong> ({o.customerEmail}) via {o.paymentMethod}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Total Bill: <strong>₹ {o.total}</strong></span>
                    {o.trackingNumber && <span>Tracking: <strong className="font-mono text-white">{o.trackingNumber}</strong></span>}
                  </div>

                  {/* Status update buttons */}
                  <div className="flex gap-1.5 pt-2 border-t border-[#5c141d]/10 justify-end">
                    {o.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'Processing')}
                        className="px-2.5 py-1 bg-gray-800 text-gray-300 rounded font-bold uppercase text-[9px] hover:text-white"
                      >
                        Accept Order
                      </button>
                    )}
                    {o.status === 'Processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'Shipped')}
                        className="px-2.5 py-1 bg-[#5c141d] text-[#bc8f42] rounded font-bold uppercase text-[9px]"
                      >
                        Dispatch / Ship
                      </button>
                    )}
                    {o.status === 'Shipped' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')}
                        className="px-2.5 py-1 bg-emerald-800 text-emerald-100 rounded font-bold uppercase text-[9px]"
                      >
                        Delivered
                      </button>
                    )}
                    {o.status !== 'Returned' && o.status === 'Delivered' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(o.id, 'Returned')}
                        className="px-2 py-1 bg-red-950 text-red-200 rounded font-bold uppercase text-[9px]"
                        title="Handle Refund"
                      >
                        Handle Return
                      </button>
                    )}
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
