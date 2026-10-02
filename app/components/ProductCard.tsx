"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    categoryId: number;
    discount?: number;
}

export default function ProductCard({ id, name, price, originalPrice, image, category, categoryId, discount }: ProductCardProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isImageOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isImageOpen]);

    const handleAddAndGo = () => {
        addToCart({ id, name, price, originalPrice, image, category });
        router.push(`/products?scroll=category-sec-${categoryId}`);
    };

    const discountPct = discount ?? Math.round(((originalPrice - price) / originalPrice) * 100);

    return (
        <div className="group relative w-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-festive-gold/50 transition-all duration-500 flex flex-col">
            {/* Image Container */}
            <div 
                className="relative h-60 w-full overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => setIsImageOpen(true)}
            >
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Sale Badge */}
                {originalPrice > price && (
                    <div className="absolute top-4 left-4 z-10 bg-festive-red text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                        Save ₹{originalPrice - price}
                    </div>
                )}

                {/* Offer % */}
                {originalPrice > price && (
                    <div className="absolute top-4 right-4 z-10 bg-festive-gold text-festive-purple text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                        {discountPct}% OFF
                    </div>
                )}
                
                {/* Hover overlay for zoom icon */}
                <div className="absolute inset-0 pointer-events-none bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center z-0">
                    <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-festive-purple font-bold text-xs px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-none flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                        View Image
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-bold text-festive-red uppercase tracking-[0.2em] mb-2">{category}</span>
                <h3 className="text-festive-purple font-bold text-lg md:text-xl mb-2 line-clamp-2 min-h-[3.5rem]">
                    {name}
                </h3>

                <div className="flex items-center gap-3 mb-6 mt-auto">
                    <span className="text-3xl font-bold text-festive-purple">₹{price}</span>
                    {originalPrice > price && (
                        <span className="text-base text-gray-400 line-through font-semibold">₹{originalPrice}</span>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAddAndGo}
                    className="w-full py-4 rounded-xl bg-festive-purple border-2 border-festive-purple text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:bg-festive-red hover:border-festive-red hover:shadow-lg shadow-md active:scale-95 cursor-pointer"
                >
                    ➕ Add to Cart
                </button>
            </div>

            {/* Image Modal using Portal */}
            {mounted && isImageOpen && createPortal(
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-300"
                    onClick={() => setIsImageOpen(false)}
                >
                    <div 
                        className="relative w-full max-w-4xl h-[70vh] md:h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/10 hover:bg-festive-red text-gray-800 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                            onClick={() => setIsImageOpen(false)}
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none">
                            <h3 className="text-white font-bold text-xl md:text-3xl mb-1">{name}</h3>
                            <p className="text-gray-300 text-sm md:text-base font-medium">{category}</p>
                        </div>

                        {/* Large Image */}
                        <div className="relative w-full h-full p-8 md:p-12">
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
