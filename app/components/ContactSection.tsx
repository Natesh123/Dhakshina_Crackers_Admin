"use client";
import React from 'react';

export default function ContactSection() {
    return (
        <section id="contact" className="py-20 md:py-28 bg-[#fafafa] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-festive-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-festive-gold/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

            <div className="container mx-auto px-5 md:px-8 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-festive-purple/5 border border-festive-purple/10 text-festive-purple font-semibold uppercase tracking-[0.2em] text-[10px] mb-4 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-festive-red rounded-full animate-pulse"></span>
                        Get in Touch
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                        Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-festive-purple via-festive-red to-orange-500">Conversation</span>
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Have questions about our premium crackers or bulk orders? Our team is ready to assist you immediately.
                    </p>
                </div>

                {/* Main Content Box */}
                <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row relative">
                    
                    {/* Decorative Blob */}
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-festive-purple/10 to-festive-red/10 rounded-full blur-3xl"></div>

                    {/* Left: Contact Info */}
                    <div className="w-full md:w-3/5 p-6 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center bg-white/50">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight">Reach Out To Us</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 relative z-10">
                            {/* Location */}
                            <div className="flex items-start gap-4 group sm:col-span-2">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-festive-purple group-hover:bg-gradient-to-br group-hover:from-festive-purple group-hover:to-purple-900 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 shrink-0 group-hover:shadow-[0_8px_16px_rgba(88,28,135,0.15)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-bold text-festive-purple uppercase tracking-[0.15em] mb-1">Business Info</p>
                                    <p className="text-base md:text-lg font-bold text-gray-900 leading-tight">Sri Dhakshina Crackers</p>
                                    <p className="text-sm font-semibold text-gray-600 mt-1">Online Crackers Dealer</p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">Sivakasi, Tamil Nadu, India</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-festive-purple group-hover:bg-gradient-to-br group-hover:from-festive-purple group-hover:to-purple-900 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 shrink-0 group-hover:shadow-[0_8px_16px_rgba(88,28,135,0.15)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-bold text-festive-purple uppercase tracking-[0.15em] mb-1">Call Us</p>
                                    <a href="tel:+919894116131" className="text-sm md:text-base font-bold text-gray-900 hover:text-festive-purple transition-colors">+91 98941 16131</a>
                                </div>
                            </div>
                            
                            {/* Email */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-festive-purple group-hover:bg-gradient-to-br group-hover:from-festive-purple group-hover:to-purple-900 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 shrink-0 group-hover:shadow-[0_8px_16px_rgba(88,28,135,0.15)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-bold text-festive-purple uppercase tracking-[0.15em] mb-1">Email Us</p>
                                    <a href="mailto:sridhakshinacrackers@gmail.com" className="text-sm font-bold text-gray-900 hover:text-festive-purple transition-colors break-all">sridhakshinacrackers<br/>@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    {/* Right: Quick Actions & Proprietor */}
                    <div className="w-full md:w-2/5 p-6 md:p-12 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-gray-100/80">
                        {/* Profile */}
                        <div className="flex flex-col items-start gap-4 mb-8 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-festive-purple via-purple-900 to-[#1a0826] flex items-center justify-center text-white font-bold text-2xl shadow-[0_8px_20px_rgba(88,28,135,0.25)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('/assets/images/pattern.png')] bg-repeat opacity-20 mix-blend-overlay"></div>
                                <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">S</span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-festive-purple uppercase tracking-[0.15em] block mb-1.5">Proprietor</span>
                                <p className="text-xl md:text-2xl font-bold text-gray-900 leading-none tracking-tight">S.Natesh kumar</p>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 uppercase tracking-widest mt-3 bg-green-100/80 px-2.5 py-1 rounded-md border border-green-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                                    Available Now
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 relative z-10">
                            <a href="https://wa.me/919894116131" target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white font-bold text-center text-xs uppercase tracking-[0.15em] hover:shadow-[0_10px_20px_rgba(37,211,102,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform"><path d="M11.99 2.01c-5.52 0-9.99 4.47-9.99 9.99 0 1.98.58 3.82 1.58 5.37l-1.57 4.6 4.77-1.22c1.51.91 3.28 1.44 5.17 1.44 5.52 0 9.99-4.47 9.99-9.99s-4.47-9.99-9.99-9.99zm0 18.27c-1.63 0-3.17-.42-4.51-1.16l-.32-.18-3.04.78 1.01-2.92-.2-.33c-.78-1.29-1.24-2.82-1.24-4.45 0-4.58 3.73-8.31 8.31-8.31s8.31 3.73 8.31 8.31-3.73 8.31-8.31 8.31zm4.56-6.19c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-1.5-.78-2.67-1.5-3.69-2.93-.11-.16.02-.24.14-.36.11-.11.25-.29.37-.44.08-.1.13-.17.21-.33.1-.21.05-.39-.02-.52-.16-.27-.57-1.38-.78-1.89-.21-.5-.42-.43-.57-.44H7.2c-.2 0-.52.08-.79.37s-1.04 1.02-1.04 2.48 1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49 2.21.96 2.92 1.04 3.96.88.94-.15 2.53-1.04 2.89-2.04.36-1.01.36-1.87.25-2.04-.11-.18-.4-.28-.65-.4z"/></svg>
                                <span className="relative z-10">Chat on WhatsApp</span>
                            </a>
                            <a href="tel:+919894116131" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold text-center text-xs uppercase tracking-[0.15em] hover:from-festive-purple hover:to-purple-900 hover:shadow-[0_10px_20px_rgba(88,28,135,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>
                                <span className="relative z-10">Call Now</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
