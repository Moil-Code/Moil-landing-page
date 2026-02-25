"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteCookie } from "cookies-next";

const setGoogleTranslateCookie = (langCode: 'en' | 'es') => {
  const cookieValue = langCode === 'en' ? '/auto/en' : '/auto/es';

  deleteCookie('googtrans', { path: '/' });
  deleteCookie('googtrans', { path: '/', domain: window.location.hostname });

  const hostname = window.location.hostname;
  const domainParts = hostname.split('.');
  if (domainParts.length > 2) {
    const parentDomain = '.' + domainParts.slice(-2).join('.');
    deleteCookie('googtrans', { path: '/', domain: parentDomain });
  }

  document.cookie = `googtrans=${cookieValue}; path=/`;

  if (domainParts.length > 2) {
    const parentDomain = '.' + domainParts.slice(-2).join('.');
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${parentDomain}`;
  }
};

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizeModal({ isOpen, onClose }: CustomizeModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | null>(null);
  const [selectedPage, setSelectedPage] = useState<'candidate' | 'business' | null>(null);

  const handleContinue = () => {
    if (!selectedLanguage || !selectedPage) return;

    // Set language in localStorage and cookie
    localStorage.setItem('tlang', selectedLanguage);
    setGoogleTranslateCookie(selectedLanguage);
    
    // Set session flag to prevent modal from showing again
    sessionStorage.setItem('customizeModalShown', 'true');
    sessionStorage.setItem('pendingTranslate', selectedLanguage);

    // Navigate to selected page with language parameter
    const targetPath = selectedPage === 'candidate' ? '/' : '/business';
    const targetUrl = `${targetPath}?lg=${selectedLanguage}`;

    // If on home and selecting Advance Career (candidate), translate only.
    if (window.location.pathname === '/' && targetPath === '/') {
      const url = new URL(window.location.href);
      url.searchParams.set('lg', selectedLanguage);
      window.history.replaceState({}, "", url.toString());
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }

    // Force a full reload on route so Google Translate renders correctly.
    window.location.href = targetUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Sophisticated Header */}
            <div className="relative bg-[#5843BD] p-10 text-white overflow-hidden">
              {/* Abstract shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF6633]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Welcome to Moil</h2>
                <p className="text-white/80 text-lg font-light">Tailor your experience to get started.</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 space-y-10">
              
              {/* Language Selection */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold pl-1">Select Language</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedLanguage('en')}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      selectedLanguage === 'en'
                        ? 'border-[#5843BD] bg-[#5843BD]/5 shadow-lg shadow-[#5843BD]/10'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">🇺🇸</span>
                    <div className="text-left">
                      <p className={`font-semibold text-lg ${selectedLanguage === 'en' ? 'text-[#5843BD]' : 'text-gray-900'}`}>English</p>
                    </div>
                    {selectedLanguage === 'en' && (
                      <div className="absolute right-4 text-[#5843BD]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedLanguage('es')}
                    className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      selectedLanguage === 'es'
                        ? 'border-[#5843BD] bg-[#5843BD]/5 shadow-lg shadow-[#5843BD]/10'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">🇪🇸</span>
                    <div className="text-left">
                      <p className={`font-semibold text-lg ${selectedLanguage === 'es' ? 'text-[#5843BD]' : 'text-gray-900'}`}>Español</p>
                    </div>
                    {selectedLanguage === 'es' && (
                      <div className="absolute right-4 text-[#5843BD]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Page Selection */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold pl-1">I want to...</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedPage('candidate')}
                    className={`group relative p-5 rounded-2xl border transition-all duration-300 text-left ${
                      selectedPage === 'candidate'
                        ? 'border-[#FF6633] bg-[#FF6633]/5 shadow-lg shadow-[#FF6633]/10'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${selectedPage === 'candidate' ? 'bg-[#FF6633] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#FF6633]/10 group-hover:text-[#FF6633]'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <p className={`font-bold text-md mb-1 ${selectedPage === 'candidate' ? 'text-[#FF6633]' : 'text-gray-900'}`}>Advance Your Career</p>
                    <p className="text-sm text-gray-500 leading-relaxed">Strengthen your resume, practice interviews, and improve your job readiness with AI-powered tools.</p>
                  </button>

                  <button
                    onClick={() => setSelectedPage('business')}
                    className={`group relative p-5 rounded-2xl border transition-all duration-300 text-left ${
                      selectedPage === 'business'
                        ? 'border-[#5843BD] bg-[#5843BD]/5 shadow-lg shadow-[#5843BD]/10'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${selectedPage === 'business' ? 'bg-[#5843BD] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#5843BD]/10 group-hover:text-[#5843BD]'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <p className={`font-bold text-md mb-1 ${selectedPage === 'business' ? 'text-[#5843BD]' : 'text-gray-900'}`}>Build Your Business</p>
                    <p className="text-sm text-gray-500 leading-relaxed">Create a business profile and use the business tools Moil offers.</p>
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-2">
                <button
                  onClick={handleContinue}
                  disabled={!selectedLanguage || !selectedPage}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
                    selectedLanguage && selectedPage
                      ? 'bg-[#5843BD] text-white hover:bg-[#4a3ba0] hover:scale-[1.02] shadow-[#5843BD]/20'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
