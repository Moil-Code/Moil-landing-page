'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BusinessCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BusinessCustomizeModal({ isOpen, onClose }: BusinessCustomizeModalProps) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | null>(null);
  const [selectedPage, setSelectedPage] = useState<'candidate' | 'business' | null>('business');

  const handleContinue = () => {
    if (!selectedLanguage || !selectedPage) return;

    localStorage.setItem('tlang', selectedLanguage);
    document.cookie = `googtrans=${selectedLanguage === 'en' ? '/auto/en' : '/auto/es'}; path=/`;
    sessionStorage.setItem('customizeModalShown', 'true');

    const targetPath = selectedPage === 'candidate' ? '/' : '/business';
    router.push(`${targetPath}?lg=${selectedLanguage}`);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="customize-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        padding: '16px',
      }}
    >
      <div
        className="customize-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'var(--surface)',
          borderRadius: '24px',
          maxWidth: '640px',
          width: '100%',
          overflow: 'hidden',
          border: '1px solid var(--border2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            padding: '8px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, var(--purple) 0%, var(--purple-light) 100%)',
          padding: '48px 32px 32px',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            transform: 'translate(50%, -50%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '150px',
            height: '150px',
            background: 'var(--orange)',
            opacity: 0.15,
            borderRadius: '50%',
            filter: 'blur(40px)',
            transform: 'translate(-50%, 50%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 700,
              color: 'white',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}>
              Welcome to Moil
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 300,
            }}>
              Customize your experience to get started.
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Language Selection */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--text3)',
              marginBottom: '16px',
            }}>
              Select Language
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setSelectedLanguage('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: selectedLanguage === 'en' ? '2px solid var(--purple)' : '1px solid var(--border)',
                  background: selectedLanguage === 'en' ? 'var(--purple-dim)' : 'var(--surface2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="28" height="20" viewBox="0 0 28 20" style={{ borderRadius: '4px', flexShrink: 0 }}>
                  <rect width="28" height="20" fill="#B22234" />
                  <rect y="1.54" width="28" height="1.54" fill="white" />
                  <rect y="4.62" width="28" height="1.54" fill="white" />
                  <rect y="7.69" width="28" height="1.54" fill="white" />
                  <rect y="10.77" width="28" height="1.54" fill="white" />
                  <rect y="13.85" width="28" height="1.54" fill="white" />
                  <rect y="16.92" width="28" height="1.54" fill="white" />
                  <rect width="11.2" height="10.77" fill="#3C3B6E" />
                </svg>
                <span style={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: selectedLanguage === 'en' ? 'var(--purple)' : 'var(--text)',
                }}>
                  English
                </span>
                {selectedLanguage === 'en' && (
                  <svg style={{ marginLeft: 'auto', color: 'var(--purple)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setSelectedLanguage('es')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: selectedLanguage === 'es' ? '2px solid var(--purple)' : '1px solid var(--border)',
                  background: selectedLanguage === 'es' ? 'var(--purple-dim)' : 'var(--surface2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="28" height="20" viewBox="0 0 28 20" style={{ borderRadius: '4px', flexShrink: 0 }}>
                  <rect width="28" height="20" fill="#AA151B" />
                  <rect y="5" width="28" height="10" fill="#F1BF00" />
                </svg>
                <span style={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: selectedLanguage === 'es' ? 'var(--purple)' : 'var(--text)',
                }}>
                  Español
                </span>
                {selectedLanguage === 'es' && (
                  <svg style={{ marginLeft: 'auto', color: 'var(--purple)' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Page Selection */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--text3)',
              marginBottom: '16px',
            }}>
              I want to...
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setSelectedPage('candidate')}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: selectedPage === 'candidate' ? '2px solid var(--orange)' : '1px solid var(--border)',
                  background: selectedPage === 'candidate' ? 'var(--orange-dim)' : 'var(--surface2)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: selectedPage === 'candidate' ? 'var(--orange)' : 'var(--surface3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  color: selectedPage === 'candidate' ? 'white' : 'var(--text3)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <p style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: selectedPage === 'candidate' ? 'var(--orange)' : 'var(--text)',
                  marginBottom: '4px',
                }}>
                  Advance Your Career
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.4 }}>
                  Strengthen your resume, practice interviews, and improve your job readiness with AI-powered tools.
                </p>
              </button>
              <button
                onClick={() => setSelectedPage('business')}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: selectedPage === 'business' ? '2px solid var(--purple)' : '1px solid var(--border)',
                  background: selectedPage === 'business' ? 'var(--purple-dim)' : 'var(--surface2)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: selectedPage === 'business' ? 'var(--purple)' : 'var(--surface3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  color: selectedPage === 'business' ? 'white' : 'var(--text3)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                    <path d="M1 21h22" />
                    <path d="M9 7h1" />
                    <path d="M9 11h1" />
                    <path d="M14 7h1" />
                    <path d="M14 11h1" />
                    <path d="M9 15h6v6H9z" />
                  </svg>
                </div>
                <p style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: selectedPage === 'business' ? 'var(--purple)' : 'var(--text)',
                  marginBottom: '4px',
                }}>
                  Build Your Business
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text3)', lineHeight: 1.4 }}>
                  Create a business profile and use the business tools Moil offers.
                </p>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedLanguage || !selectedPage}
            style={{
              width: '100%',
              padding: '16px 24px',
              borderRadius: '14px',
              border: 'none',
              background: selectedLanguage && selectedPage
                ? 'linear-gradient(135deg, var(--purple) 0%, var(--purple-light) 100%)'
                : 'var(--surface3)',
              color: selectedLanguage && selectedPage ? 'white' : 'var(--text3)',
              fontWeight: 700,
              fontSize: '16px',
              cursor: selectedLanguage && selectedPage ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: selectedLanguage && selectedPage
                ? '0 10px 30px -10px rgba(124, 58, 237, 0.5)'
                : 'none',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
