"use client";

import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount?: number;
  image: string;
  categoryId: number;
  category: string;
  is_active?: number | boolean;
  sort_order?: number;
}

interface ProductCatalogProps {
  priceListUrl?: string;
}

export default function ProductCatalog({ priceListUrl = "" }: ProductCatalogProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
        const [catsRes, prodsRes] = await Promise.all([
          fetch(`${apiUrl}/api/categories`),
          fetch(`${apiUrl}/api/products`)
        ]);

        if (catsRes.ok && prodsRes.ok) {
          const catsData = await catsRes.json();
          const prodsData = await prodsRes.json();
          
          const removeTamil = (name: string) => name ? name.replace(/\s*\([^)]*[\u0b80-\u0bff]+[^)]*\)/g, "").trim() : name;
          
          setCategories(catsData.map((c: any) => ({ ...c, name: removeTamil(c.name) })));
          setProducts(prodsData.map((p: any) => ({ ...p, name: removeTamil(p.name) })));
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const cleanStr = (str: string) => str ? str.replace(/\s*\([^)]*[\u0B80-\u0BFF]+[^)]*\)/g, '').trim() : '';
  
  const rawFilters = categories.map(c => c.name);
  const uniqueCleanFilters = Array.from(new Set(rawFilters.map(cleanStr)));
  const filters = ["All", ...uniqueCleanFilters];

  const activeProducts = products
    .filter(p => p.is_active === 1 || p.is_active === true || p.is_active === undefined)
    .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));

  const filteredProducts = useMemo(() => {
    let prods = activeFilter === "All"
      ? activeProducts
      : activeProducts.filter(p => cleanStr(p.category) === activeFilter);
      
    if (searchQuery) {
      prods = prods.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return prods;
  }, [activeProducts, activeFilter, searchQuery]);

  const getCartQty = (productId: number) => {
    const item = cartItems.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  const getImageUrl = (url: string) => {
    if (!url) return "/assets/images/placeholder.png";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
    if (url.includes('localhost:5001')) {
      return url.replace(/http:\/\/localhost:5001/g, apiUrl);
    }
    if (url.startsWith('http')) return url;
    return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Group products by category
  const groupedFilteredProducts = useMemo(() => {
    const groups: { category: string; products: Product[] }[] = [];
    
    // Group based on globally sorted filteredProducts
    filteredProducts.forEach(prod => {
      const cat = cleanStr(prod.category);
      const existingGroup = groups.find(g => g.category === cat);
      if (existingGroup) {
        existingGroup.products.push(prod);
      } else {
        groups.push({ category: cat, products: [prod] });
      }
    });
    
    return groups;
  }, [filteredProducts]);

  if (loading) {
    return (
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 animate-pulse">
          <div className="text-center mb-16">
            <div className="w-32 h-4 bg-gray-200 mx-auto rounded mb-3"></div>
            <div className="w-96 h-12 bg-gray-200 mx-auto rounded mb-4"></div>
            <div className="w-24 h-1.5 bg-gray-200 mx-auto rounded-full"></div>
          </div>
          <div className="flex overflow-x-auto pb-4 md:pb-0 justify-start md:justify-center gap-3 md:gap-5 mb-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
            ))}
          </div>
          {/* Skeleton table rows */}
          <div className="space-y-4">
            <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricelist" className="bg-white py-24 relative overflow-hidden scroll-mt-24">
      {/* Decorative Side Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-10 bg-festive-red rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 bg-festive-purple rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-festive-red text-sm font-semibold tracking-[0.3em] uppercase mb-3 block">Our Products</span>
          <h2 className="text-3xl md:text-5xl font-semibold text-festive-purple mb-4 tracking-tight">
            Explore Our <span className="text-festive-red">Crackers</span>
          </h2>
          <div className="w-24 h-1.5 bg-festive-gold mx-auto rounded-full mb-6"></div>
          {priceListUrl && (
            <div className="flex justify-center mt-2 animate-bounce">
              <a
                href={priceListUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-festive-gold text-festive-purple font-semibold text-base uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              >
                📥 Download Full Price List (PDF)
              </a>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-12 md:mb-16 space-y-6">
          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-festive-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search crackers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 text-base bg-white border-2 border-festive-purple/10 rounded-full text-slate-800 placeholder-gray-400 focus:outline-none focus:border-festive-purple focus:ring-4 focus:ring-festive-purple/10 transition-all font-semibold shadow-sm hover:border-festive-gold/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-festive-red transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Mobile Dropdown View */}
          <div className="md:hidden px-2">
             <div className="relative">
                <select 
                   value={activeFilter}
                   onChange={(e) => setActiveFilter(e.target.value)}
                   className="w-full appearance-none bg-white border-2 border-festive-purple/20 text-festive-purple font-semibold uppercase tracking-widest text-sm rounded-2xl px-6 py-4 shadow-lg shadow-festive-purple/5 focus:outline-none focus:border-festive-purple focus:ring-4 focus:ring-festive-purple/10 transition-all"
                >
                   {filters.map((filter) => (
                     <option key={filter} value={filter}>{filter}</option>
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
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-300 border-2 cursor-pointer ${
                  activeFilter === filter
                    ? "bg-festive-purple text-white border-festive-purple shadow-[0_10px_20px_-10px_rgba(45,13,84,0.6)] scale-105"
                    : "bg-white text-festive-purple border-festive-purple/10 hover:border-festive-gold hover:shadow-md"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ Flat Table View ═══ */}
        {groupedFilteredProducts.length > 0 ? (
          <div className="space-y-10">
            {groupedFilteredProducts.map((group) => (
              <div key={group.category} className="scroll-mt-32">
                {/* Category Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#1a0826] via-[#3d1166] to-[#1a0826] py-4 px-6 rounded-t-xl border-b-[3px] border-festive-gold shadow-[0_4px_20px_-5px_rgba(61,17,102,0.5)] flex items-center justify-center group">
                  <div className="absolute inset-0 opacity-20 bg-[url('/assets/images/pattern.png')] bg-repeat mix-blend-overlay pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="text-base md:text-lg opacity-80 group-hover:animate-ping">✨</span>
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-festive-gold to-yellow-400 font-semibold text-base md:text-xl uppercase tracking-[0.2em] drop-shadow-lg text-center">
                      {group.category}
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
                        
                        <div 
                          className="w-full h-[90px] sm:h-[130px] md:h-[180px] bg-white flex items-center justify-center p-1.5 sm:p-3 md:p-4 cursor-pointer relative shrink-0"
                          onClick={() => setSelectedImage(prod)}
                        >
                          <img 
                            src={getImageUrl(prod.image)} 
                            alt={prod.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                          />
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
                                onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.price, originalPrice: prod.originalPrice, image: prod.image, category: prod.category })} 
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
              ))}
            </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-gray-100 max-w-xl mx-auto">
            <span className="text-6xl animate-bounce inline-block drop-shadow-md mb-4">🎆</span>
            <p className="text-lg font-semibold text-slate-500 uppercase tracking-widest">
              {searchQuery ? "No matching products found" : "Wait for it... more sparkles coming soon!"}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 px-6 py-3 rounded-full bg-festive-gold text-festive-purple font-semibold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_4px_12px_rgba(255,215,0,0.3)]"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

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
                    <p className="text-gray-300 text-sm font-medium">{selectedImage.category}</p>
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
    </section>
  );
}

