"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartPackingCharges,
    cartTotal,
    cartOriginalTotal,
    cartDiscountableOriginalTotal,
    cartSavings,
    isCartOpen,
    setCartOpen,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [cartStep, setCartStep] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);
  const [errors, setErrors] = useState({ name: false, phone: false, email: false, city: false, address: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minOrderValue, setMinOrderValue] = useState(0);

  const getImageUrl = (url: string) => {
    if (!url) return "/assets/images/placeholder.png";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6001";
    if (url.includes('localhost:5001')) {
      return url.replace(/http:\/\/localhost:5001/g, apiUrl);
    }
    if (url.startsWith('http')) return url;
    return `${apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    if (isCartOpen) {
      const fetchMinOrderValue = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          const res = await fetch(`${apiUrl}/api/settings/min-order-value/get`);
          if (res.ok) {
            const data = await res.json();
            setMinOrderValue(Number(data.value) || 0);
          }
        } catch (e) {}
      };
      fetchMinOrderValue();
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleConfirmOrder = async () => {
    const newErrors = {
      name: !customerName.trim(),
      phone: !customerPhone.trim(),
      email: customerEmail.trim() !== "" ? !customerEmail.includes('@') : false,
      city: !customerCity.trim(),
      address: !customerAddress.trim(),
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_city: customerCity,
        customer_address: customerAddress,
        total_amount: cartTotal,
        total_savings: cartSavings,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity
        }))
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      console.log("Order Placed Successfully!");
      if (responseData.emailSent) {
        console.log("%c✅ SUCCESS: Email was sent to the Admin successfully!", "color: #10b981; font-weight: bold; font-size: 14px;");
      } else {
        console.log("%c⚠️ NOTE: Order saved, but Email was NOT sent (Check backend .env credentials)", "color: #f59e0b; font-weight: bold; font-size: 14px;");
      }

      setConfirmedOrderId(responseData.orderId);
      setErrors({ name: false, phone: false, email: false, city: false, address: false });
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was a problem submitting your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-['Outfit']">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={() => setCartOpen(false)}
      ></div>

      {/* Centered Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-gray-100 rounded-3xl text-slate-800 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden animate-fadeIn">
        
        {/* Submitting Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col justify-center items-center gap-4">
            <div className="w-12 h-12 border-4 border-festive-red border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-800 text-lg animate-pulse tracking-wide">Placing Your Order...</p>
          </div>
        )}

        {/* Subtle Ambient Glow inside modal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-festive-gold/5 blur-[80px] pointer-events-none rounded-full"></div>

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between relative z-10 bg-gray-50/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl drop-shadow-sm">🛒</span>
            <h2 className="text-lg sm:text-xl font-semibold uppercase tracking-widest text-festive-purple flex items-center flex-wrap gap-2 sm:gap-3">
              <span>Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-festive-red to-orange-500">Cart</span></span>
              <span className="text-[10px] sm:text-xs bg-festive-gold/15 text-festive-purple border border-festive-gold/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm leading-none flex items-center mt-0.5 sm:mt-0">
                {cartCount} {cartCount === 1 ? "ITEM" : "ITEMS"}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                title="Clear all cart items"
                className="w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full font-semibold uppercase tracking-widest text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center sm:gap-1.5 cursor-pointer shadow-sm flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-slate-400 hover:text-festive-red hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shadow-sm flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6 space-y-5 relative z-10">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
              <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <span className="text-6xl animate-pulse drop-shadow-sm">✨</span>
              </div>
              <div>
                <h3 className="text-slate-800 font-semibold uppercase tracking-widest text-lg mb-2">
                  Your cart is empty
                </h3>
                <p className="text-base text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
                  Browse our premium fireworks catalog to add your favorite sparklers and sky shots!
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="px-10 py-3.5 rounded-full bg-gradient-to-r from-festive-gold to-yellow-400 text-festive-purple font-semibold text-base uppercase tracking-widest hover:scale-105 transition-all shadow-[0_8px_20px_rgba(255,215,0,0.4)] mt-4"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {cartStep === 1 ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="bg-festive-purple text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Review Products
                  </h4>
                  <span className="text-xs text-slate-500 font-bold bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">Step 1 of 2</span>
                </div>
                {cartItems.map((item) => {
                  const discountPercent = item.originalPrice > 0 ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 sm:gap-5 p-4 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-festive-gold/30 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-contain drop-shadow-sm"
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        {/* Title and Price */}
                        <div>
                          <h4 className="text-sm sm:text-base font-semibold text-slate-800 tracking-wide leading-tight line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                            {item.category}
                          </span>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-lg font-bold text-slate-900">
                              ₹{item.price}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-xs text-slate-500 line-through">
                                ₹{item.originalPrice}
                              </span>
                            )}
                            {discountPercent > 0 && (
                              <span className="text-[10px] sm:text-xs font-bold text-emerald-600">
                                {discountPercent}% Off
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls: Qty and Remove */}
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center bg-white border border-gray-300 rounded overflow-hidden shadow-sm h-8">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 sm:px-3 text-lg font-semibold text-slate-600 hover:bg-gray-50 active:bg-gray-100 transition-colors h-full flex items-center justify-center"
                            >
                              −
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity} 
                              onChange={(e) => {
                                const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                                if (!isNaN(val) && val >= 0) updateQuantity(item.id, val);
                              }}
                              className="w-10 sm:w-12 h-full text-sm font-semibold text-center border-x border-gray-300 text-slate-900 bg-gray-50 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 sm:px-3 text-lg font-semibold text-slate-600 hover:bg-gray-50 active:bg-gray-100 transition-colors h-full flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>

                          <div className="h-4 w-px bg-gray-300"></div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-all flex items-center justify-center active:scale-95"
                            title="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] sm:w-5 sm:h-5">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 p-5 sm:p-6 rounded-xl border border-gray-200 animate-fadeIn shadow-inner mt-2">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="bg-festive-purple text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                    Delivery Details
                  </h4>
                  <span className="text-xs text-slate-500 font-bold bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">Step 2 of 2</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => { setCustomerName(e.target.value); if(errors.name) setErrors({...errors, name: false}); }}
                      placeholder="e.g. John Doe"
                      className={`w-full bg-white border ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-festive-gold focus:ring-festive-gold/20'} rounded-lg px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 font-medium shadow-sm`}
                    />
                    {errors.name && <span className="text-red-500 text-sm font-bold mt-1 block animate-fadeIn">* Full Name is required</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => { setCustomerPhone(e.target.value); if(errors.phone) setErrors({...errors, phone: false}); }}
                      placeholder="e.g. 9894116131"
                      className={`w-full bg-white border ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-festive-gold focus:ring-festive-gold/20'} rounded-lg px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 font-medium shadow-sm`}
                    />
                    {errors.phone && <span className="text-red-500 text-sm font-bold mt-1 block animate-fadeIn">* Contact Number is required</span>}
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => { setCustomerEmail(e.target.value); if(errors.email) setErrors({...errors, email: false}); }}
                      placeholder="e.g. name@example.com"
                      className={`w-full bg-white border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-festive-gold focus:ring-festive-gold/20'} rounded-lg px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 font-medium shadow-sm`}
                    />
                    {errors.email && <span className="text-red-500 text-sm font-bold mt-1 block animate-fadeIn">* Please enter a valid email address</span>}
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Full Delivery Address
                    </label>
                    <textarea
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => { setCustomerAddress(e.target.value); if(errors.address) setErrors({...errors, address: false}); }}
                      placeholder="e.g. Street Name, Area, Pincode"
                      className={`w-full bg-white border ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-festive-gold focus:ring-festive-gold/20'} rounded-lg px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 font-medium resize-none shadow-sm`}
                    />
                    {errors.address && <span className="text-red-500 text-sm font-bold mt-1 block animate-fadeIn">* Address is required</span>}
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Delivery City/Town
                    </label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => { setCustomerCity(e.target.value); if(errors.city) setErrors({...errors, city: false}); }}
                      placeholder="e.g. Sivakasi"
                      className={`w-full bg-white border ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-festive-gold focus:ring-festive-gold/20'} rounded-lg px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 font-medium shadow-sm`}
                    />
                    {errors.city && <span className="text-red-500 text-sm font-bold mt-1 block animate-fadeIn">* City/Town is required</span>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky Summary & Action Footer */}
      {cartItems.length > 0 && (
        <div className="px-5 sm:px-8 py-5 bg-white border-t border-slate-100 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <span className="text-slate-500 font-medium">Total MRP</span>
              <span className="text-right text-slate-400 line-through decoration-slate-300">₹{cartOriginalTotal.toLocaleString('en-IN')}</span>
              
              <span className="text-emerald-600 font-semibold">Discount ({cartDiscountableOriginalTotal > 0 ? Math.round((cartSavings / cartDiscountableOriginalTotal) * 100) : 0}% OFF)</span>
              <span className="text-right text-emerald-600 font-bold">-₹{cartSavings.toLocaleString('en-IN')}</span>
              
              <span className="text-slate-700 font-medium mt-1 pt-1 border-t border-slate-100">Amount After Discount</span>
              <span className="text-right text-slate-800 font-semibold mt-1 pt-1 border-t border-slate-100">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              
              <span className="text-amber-600 font-medium">Packing Charges (3%)</span>
              <span className="text-right text-amber-600 font-bold">+₹{cartPackingCharges.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex items-end justify-between mt-2 pt-3 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-extrabold text-festive-purple tracking-tight leading-none">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-3 mt-2 lg:mt-0">
            {cartStep === 1 ? (
              <>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 active:scale-95"
                >
                  <span className="text-lg">＋</span> Add More
                </button>
                
                {minOrderValue > 0 && cartTotal < minOrderValue ? (
                  <div className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl bg-amber-50 text-amber-800 font-bold text-xs sm:text-sm border border-amber-200 flex flex-col items-center justify-center text-center leading-tight shadow-sm">
                    <span className="opacity-80">Min Order: ₹{minOrderValue.toLocaleString('en-IN')}</span>
                    <span className="text-amber-600 uppercase tracking-wide">Add ₹{(minOrderValue - cartTotal).toLocaleString('en-IN')} more</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setCartStep(2)}
                    className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-festive-purple to-[#2d0a4c] hover:from-[#2d0a4c] hover:to-festive-purple text-white font-bold text-sm uppercase tracking-widest transition-all shadow-[0_8px_20px_rgba(61,17,102,0.25)] hover:shadow-[0_12px_25px_rgba(61,17,102,0.4)] hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Proceed <span className="text-lg">→</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setCartStep(1)}
                  className="w-full sm:flex-1 h-12 sm:h-14 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                >
                  <span className="text-lg">←</span> Back
                </button>
                
                <button
                  onClick={handleConfirmOrder}
                  className="w-full sm:flex-[2] h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm uppercase tracking-widest transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:scale-95 border border-transparent cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✨</span> Confirm Order
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 font-['Outfit']">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"></div>
            <div className="relative bg-white border border-gray-100 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-fadeIn transform scale-100">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 shadow-sm">
                <span className="text-5xl">✅</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 uppercase tracking-widest mb-3">Order Confirmed</h3>
              <p className="text-slate-600 leading-relaxed font-medium mb-8 text-base sm:text-base">
                Your order no is <span className="font-bold text-festive-purple">{confirmedOrderId ? String(confirmedOrderId).padStart(4, '0') : ''}</span>. Thank you for placing your order! Our team will contact you shortly to confirm the details.
              </p>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  clearCart();
                  setCartOpen(false);
                }}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_8px_20px_rgba(16,185,129,0.25)]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
