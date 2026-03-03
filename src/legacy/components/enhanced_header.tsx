"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface EnhancedHeaderProps {
  onLanguageClick?: () => void;
}

export default function EnhancedHeader({ onLanguageClick }: EnhancedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            Moil
          </Link>

          <nav className="nav-menu">
            <Link href="#services" className="nav-link">
              Services
            </Link>
            <Link href="#how-it-works" className="nav-link">
              How It Works
            </Link>
            <Link href="#pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="#about" className="nav-link">
              About
            </Link>
            <Link href="#contact" className="nav-link">
              Contact
            </Link>
          </nav>

          <div className="header-actions">
            <button 
              onClick={onLanguageClick}
              className="language-toggle"
            >
              EN
            </button>
            <button className="header-cta">
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-600 transition-all"></span>
            <span className="w-6 h-0.5 bg-gray-600 transition-all"></span>
            <span className="w-6 h-0.5 bg-gray-600 transition-all"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4 pt-4">
              <Link href="#services" className="nav-link">
                Services
              </Link>
              <Link href="#how-it-works" className="nav-link">
                How It Works
              </Link>
              <Link href="#pricing" className="nav-link">
                Pricing
              </Link>
              <Link href="#about" className="nav-link">
                About
              </Link>
              <Link href="#contact" className="nav-link">
                Contact
              </Link>
              <button className="header-cta mt-4 w-full">
                Get Started Free
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
