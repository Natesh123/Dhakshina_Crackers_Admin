"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactFloatingButtons from "../components/ContactFloatingButtons";
import { useCart } from "../context/CartContext";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  categoryId: number;
  discount: number;
  categoryName: string;
  is_active?: number | boolean;
  sort_order?: number;
}

function ProductsPageInner() {
  const { cartItems, addToCart, updateQuantity, removeFromCart, setCartOpen } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceListUrl, setPriceListUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const hasScrolledRef = useRef(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsRes, prodsRes, plRes] = await Promise.all([
          fetch(`${apiUrl}/api/categories`),
          fetch(`${apiUrl}/api/products`),
          fetch(`${apiUrl}/api/settings/price-list`).catch(() => null),
        ]);

        if (catsRes.ok && prodsRes.ok) {
          const catsData = await catsRes.json();
          const prodsData = await prodsRes.json();
          
          const removeTamil = (name: string) => name ? name.replace(/\s*\([^)]*[\u0b80-\u0bff]+[^)]*\)/g, "").trim() : name;
          
          setCategories(catsData.map((c: any) => ({ ...c, name: removeTamil(c.name) })));
          setProducts(prodsData.map((p: any) => ({ ...p, name: removeTamil(p.name) })));
        }

        if (plRes && plRes.ok) {
          const plData = await plRes.json();
          let fetchedUrl = plData.url || "";
          if (fetchedUrl.includes('localhost:5000') || fetchedUrl.includes('localhost:5001')) {
            try {
              const path = new URL(fetchedUrl).pathname;
              fetchedUrl = `${apiUrl}${path}`;
            } catch (e) {}
          }
          if (typeof window !== 'undefined' && window.location.protocol === 'https:' && fetchedUrl.startsWith('http://')) {
              fetchedUrl = fetchedUrl.replace('http://', 'https://');
          }
          setPriceListUrl(fetchedUrl);
        }
      } catch (e) {
        console.error("Error loading products catalogue:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [apiUrl]);

  // Auto-scroll to category when arriving from home page via ?scroll=category-sec-{id}
  const searchParams = useSearchParams();
  useEffect(() => {
    if (loading) return;                    // wait until products are in DOM
    if (hasScrolledRef.current) return;     // only scroll once per navigation
    const scrollTarget = searchParams.get("scroll");
    if (!scrollTarget) return;

    hasScrolledRef.current = true;

    // Retry up to 8 times (every 250ms = 2s total) until element is painted
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 8) {
        attempts++;
        setTimeout(tryScroll, 250);
      }
    };
    setTimeout(tryScroll, 300);
  }, [loading, searchParams]);

  const getCartQty = (productId: number) => {
    const item = cartItems.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  const handleScrollToCategory = (catId: number) => {
    const el = document.getElementById(`category-sec-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/assets/images/placeholder.png";
    if (url.includes('localhost:5001') && apiUrl !== "http://localhost:5001") {
      return url.replace(/http:\/\/localhost:5001/g, apiUrl);
    }
    if (url.startsWith('http')) return url;
    return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Filter products by search query, active filter, and sort by sort_order
  const filteredProducts = React.useMemo(() => {
    let prods = products.filter(p => p.is_active === 1 || p.is_active === true || p.is_active === undefined);
    
    if (activeFilter !== "All") {
      prods = prods.filter(p => {
        const catName = p.categoryName || (p as any).category || '';
        return catName === activeFilter;
      });
    }

    if (searchQuery) {
      prods = prods.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return prods.sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
  }, [products, searchQuery, activeFilter]);

  const cleanStr = (str: string) => str ? str.replace(/\s*\([^)]*[\u0B80-\u0BFF]+[^)]*\)/g, '').trim() : '';

  // Deduplicate categories based on cleaned name
  const uniqueCategories = React.useMemo(() => {
    const seen = new Set<string>();
    return categories.filter(cat => {
      const cleanName = cleanStr(cat.name);
      if (seen.has(cleanName)) return false;
      seen.add(cleanName);
      return true;
    });
  }, [categories]);

  // Group filtered products by category sequentially
  const groupedProducts = React.useMemo(() => {
    const groups: { id: number | string; name: string; products: Product[] }[] = [];
    
    filteredProducts.forEach(prod => {
      // In app/products/page.tsx, category might be called categoryName
      const catName = prod.categoryName || (prod as any).category || '';
      const catId = prod.categoryId || catName;
      
      const existingGroup = groups.find(g => g.name === catName);
      if (existingGroup) {
        existingGroup.products.push(prod);
      } else {
        groups.push({ id: catId, name: catName, products: [prod] });
      }
    });
    
    return groups;
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-800 flex flex-col font-['Outfit'] selection:bg-festive-gold/30 selection:text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <Navbar priceListUrl={priceListUrl} />

      <main className="flex-grow pt-[120px] pb-20">
        {/* Premium Light Hero Section */}
        <section className="relative h-[380px] md:h-[460px] flex items-center justify-center bg-gradient-to-br from-amber-50/80 via-white to-red-50/80 overflow-hidden border-b border-gray-200 shadow-sm">
          {/* Subtle Decorative Elements */}
          <div className="absolute inset-0 bg-[url('/assets/images/pattern.png')] bg-repeat opacity-[0.03] pointer-events-none mix-blend-multiply"></div>
          <div className="absolute -top-[100px] -left-[100px] w-96 h-96 bg-festive-gold/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-[100px] -right-[100px] w-96 h-96 bg-festive-red/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center space-y-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white border border-festive-gold/30 text-festive-purple text-xs font-semibold uppercase tracking-[0.2em] shadow-lg shadow-festive-gold/10">
              ✨ Sivakasi Direct Wholesale Shop ✨
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-tight text-festive-purple leading-tight drop-shadow-sm">
              Premium Crackers <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-festive-red to-orange-500 drop-shadow-md">Price List</span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed px-2">
              Purchase premium quality crackers directly from Sivakasi at factory wholesale rates. Simply select your items, adjust order quantities, and click checkout to securely submit your order.
            </p>
            {products.length > 0 && Math.max(...products.map(p => p.discount || 0)) > 0 && (
              <div className="inline-block px-5 py-2.5 bg-festive-red/5 border border-festive-red/20 rounded-xl text-xs md:text-sm font-semibold text-festive-red uppercase tracking-widest leading-normal shadow-sm">
                🎇 FESTIVE BUMPER OFFER: UP TO {Math.max(...products.map(p => p.discount || 0))}% DISCOUNT ON ALL ITEMS! 🎇
              </div>
            )}
          </div>
        </section>

        {/* Sticky Controls Panel (Frosted Glassmorphic Bar) */}
        <section className="sticky top-16 md:top-[72px] z-30 py-4 px-4 bg-[#fdfbf7]/80 backdrop-blur-md">
          <div className="w-full max-w-[95%] mx-auto bg-white/95 border border-gray-200 backdrop-blur-2xl rounded-2xl md:rounded-full py-3.5 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            {/* Search Input Container */}
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-festive-gold text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search crackers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl md:rounded-full text-slate-800 placeholder-gray-400 focus:outline-none focus:border-festive-gold focus:ring-2 focus:ring-festive-gold/20 transition-all font-semibold shadow-inner group-hover:border-gray-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-festive-red text-sm cursor-pointer transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Catalog Table Container */}
        <section className="w-full max-w-[95%] mx-auto px-4 lg:px-6 mt-6">
          {/* Filters */}
          {uniqueCategories.length > 0 && (
            <div className="mb-12 md:mb-16">
              {/* Mobile Dropdown View */}
              <div className="md:hidden px-2">
                 <div className="relative">
                    <select 
                       value={activeFilter}
                       onChange={(e) => setActiveFilter(e.target.value)}
                       className="w-full appearance-none bg-white border-2 border-festive-purple/20 text-festive-purple font-semibold uppercase tracking-widest text-sm rounded-2xl px-6 py-4 shadow-lg shadow-festive-purple/5 focus:outline-none focus:border-festive-purple focus:ring-4 focus:ring-festive-purple/10 transition-all"
                    >
                       <option value="All">All Categories</option>
                       {uniqueCategories.map((cat) => (
                         <option key={cat.id} value={cat.name}>{cat.name}</option>
                       ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-festive-purple">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                 </div>
              </div>

              {/* Desktop Buttons View */}
              <div className="hidden md:flex flex-wrap justify-center gap-4 px-4">
                <button
                  onClick={() => setActiveFilter("All")}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-2 cursor-pointer ${
                    activeFilter === "All"
                      ? "bg-festive-purple text-white border-festive-purple shadow-[0_10px_20px_-10px_rgba(45,13,84,0.6)] scale-105"
                      : "bg-white text-festive-purple border-festive-purple/10 hover:border-festive-gold hover:shadow-md"
                  }`}
                >
                  ALL
                </button>
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.name)}
                    className={`px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-2 cursor-pointer ${
                      activeFilter === cat.name
                        ? "bg-festive-purple text-white border-festive-purple shadow-[0_10px_20px_-10px_rgba(45,13,84,0.6)] scale-105"
                        : "bg-white text-festive-purple border-festive-purple/10 hover:border-festive-gold hover:shadow-md"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 gap-4">
              <div className="w-9 h-9 border-4 border-festive-gold border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-semibold uppercase tracking-widest text-festive-gold animate-pulse">
                Loading products database...
              </span>
            </div>
          ) : groupedProducts.length === 0 ? (
            <div className="text-center py-28 space-y-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-xl mx-auto">
              <span className="text-6xl animate-bounce inline-block drop-shadow-md">🎆</span>
              <p className="text-base font-semibold uppercase tracking-widest text-slate-400">
                No matching crackers found
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-festive-gold to-yellow-400 text-festive-purple text-sm font-semibold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_8px_20px_rgba(255,215,0,0.4)]"
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {groupedProducts.map((group) => {
                return (
                <div
                  key={group.id}
                  id={`category-sec-${group.id}`}
                  className="scroll-mt-48 md:scroll-mt-40"
                >
                  {/* Category Header */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-[#1a0826] via-[#3d1166] to-[#1a0826] py-4 px-6 rounded-t-xl border-b-[3px] border-festive-gold shadow-[0_4px_20px_-5px_rgba(61,17,102,0.5)] flex items-center justify-center group">
                    <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/pattern.png')] bg-repeat mix-blend-overlay pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <span className="text-base md:text-lg opacity-80 group-hover:animate-ping">✨</span>
                      <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-festive-gold to-yellow-400 font-semibold text-base md:text-xl uppercase tracking-[0.2em] drop-shadow-lg text-center">
                        {group.name}
                      </h2>
                      <span className="text-base md:text-lg opacity-80 group-hover:animate-ping">✨</span>
                    </div>
                  </div>

                  {/* ═══ Product Grid ═══ */}
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-gray-50/50 border border-gray-200 border-t-0 rounded-b-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                    {group.products.map((prod) => {
                      const qty = getCartQty(prod.id);
                      const prodDiscount = prod.discount || Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);

                      return (
                        <div key={prod.id} className="flex flex-col h-full bg-white border border-gray-200 rounded-lg md:rounded-2xl overflow-hidden hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-300 relative group">
                          {/* Discount Badge */}
                          {prod.originalPrice > prod.price && (
                            <div className="absolute top-1 right-1 md:top-2 md:right-2 z-10 bg-[#ff6b00] text-white font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-[3px] md:rounded-md text-[8px] md:text-[11px] shadow-sm">
                              {prodDiscount}% off
                            </div>
                          )}
                          
                          {/* Image Section */}
                          <div 
                            className="w-full h-[90px] sm:h-[130px] md:h-[180px] bg-white flex items-center justify-center p-1.5 sm:p-3 md:p-4 cursor-pointer relative shrink-0"
                            onClick={() => setSelectedImage(prod)}
                          >
                            <img src={getImageUrl(prod.image)} alt={prod.name} loading="lazy" decoding="async" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-t-lg md:rounded-t-2xl"></div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 pt-0 md:pt-1">
                            <h4 className="font-medium text-slate-800 text-[10px] sm:text-[12px] md:text-[14px] leading-tight line-clamp-2 mb-1.5 md:mb-2 min-h-[1.75rem] md:min-h-[2.5rem]">
                              {prod.name}
                            </h4>
                            
                            <div className="flex flex-wrap items-baseline gap-1 md:gap-1.5 mb-2 md:mb-4">
                              <span className="text-[12px] sm:text-[14px] md:text-[17px] font-bold text-gray-900 tracking-tight leading-none">₹{prod.price.toLocaleString('en-IN')}</span>
                              {prod.originalPrice > prod.price && (
                                <span className="text-[9px] sm:text-[11px] md:text-[13px] text-gray-500 line-through font-medium leading-none">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                              )}
                            </div>

                            <div className="mt-auto">
                              {qty > 0 ? (
                                <div className="flex items-center border border-red-500 rounded-md md:rounded-xl overflow-hidden bg-white h-7 sm:h-8 md:h-9 w-full">
                                  <button onClick={() => updateQuantity(prod.id, qty - 1)} className="flex-1 h-full text-red-500 hover:bg-red-50 font-semibold text-sm md:text-xl flex items-center justify-center transition-colors">−</button>
                                  <input 
                                    type="number" 
                                    value={qty} 
                                    onChange={(e) => {
                                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                      if (!isNaN(val) && val >= 0) updateQuantity(prod.id, val);
                                    }}
                                    className="w-6 sm:w-8 md:w-10 h-full font-semibold text-slate-900 text-[11px] sm:text-[12px] md:text-[14px] text-center border-x border-red-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-white"
                                  />
                                  <button onClick={() => updateQuantity(prod.id, qty + 1)} className="flex-1 h-full text-red-500 hover:bg-red-50 font-semibold text-sm md:text-xl flex items-center justify-center transition-colors">+</button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.price, originalPrice: prod.originalPrice, image: prod.image, category: group.name })} 
                                  className="w-full h-7 sm:h-8 md:h-9 rounded-md md:rounded-xl bg-white border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-[11px] sm:text-[12px] md:text-[14px] flex items-center justify-center gap-1 transition-colors active:scale-95 duration-200 shrink-0"
                                >
                                  <span className="text-sm md:text-xl leading-none font-normal mb-[1px] md:mb-[2px]">+</span> <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
              onClick={() => setSelectedImage(null)}
          >
              <div 
                  className="relative w-full max-w-2xl h-[70vh] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                  onClick={(e) => e.stopPropagation()}
              >
                  <button 
                      className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-festive-red text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                      onClick={() => setSelectedImage(null)}
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                      <h3 className="text-white font-bold text-xl mb-1">{selectedImage.name}</h3>
                      <p className="text-gray-300 text-sm font-medium">{selectedImage.categoryName || (selectedImage as any).category}</p>
                  </div>
                  <div className="relative w-full h-full p-8">
                      <img
                          src={getImageUrl(selectedImage.image)}
                          alt={selectedImage.name}
                          className="w-full h-full object-contain"
                      />
                  </div>
              </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Contact floating widgets */}
      <ContactFloatingButtons />
    </div>
  );
}
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdfbf7]" />}>
      <ProductsPageInner />
    </Suspense>
  );
}
