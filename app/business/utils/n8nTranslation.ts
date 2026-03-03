/**
 * n8n Translation Utility for Business Landing Page
 * 
 * This utility provides integration with n8n workflows for dynamic translation.
 * Configure your n8n webhook URL in the environment variables.
 */

export type SupportedLanguage = 'en' | 'es';

export interface TranslationConfig {
  webhookUrl?: string;
  defaultLanguage: SupportedLanguage;
  fallbackToDefault: boolean;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: SupportedLanguage;
  context?: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  success: boolean;
  error?: string;
}

// Default configuration
const defaultConfig: TranslationConfig = {
  webhookUrl: process.env.NEXT_PUBLIC_N8N_TRANSLATION_WEBHOOK,
  defaultLanguage: 'en',
  fallbackToDefault: true,
};

/**
 * Translate text using n8n webhook
 */
export async function translateText(
  request: TranslationRequest,
  config: Partial<TranslationConfig> = {}
): Promise<TranslationResponse> {
  const finalConfig = { ...defaultConfig, ...config };

  if (!finalConfig.webhookUrl) {
    console.warn('n8n translation webhook URL not configured');
    return {
      translatedText: request.text,
      sourceLanguage: 'en',
      targetLanguage: request.targetLanguage,
      success: false,
      error: 'Webhook URL not configured',
    };
  }

  try {
    const response = await fetch(finalConfig.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: request.text,
        targetLanguage: request.targetLanguage,
        context: request.context || 'business_landing_page',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      translatedText: data.translatedText || request.text,
      sourceLanguage: data.sourceLanguage || 'en',
      targetLanguage: request.targetLanguage,
      success: true,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: request.text,
      sourceLanguage: 'en',
      targetLanguage: request.targetLanguage,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: SupportedLanguage,
  config: Partial<TranslationConfig> = {}
): Promise<TranslationResponse[]> {
  const finalConfig = { ...defaultConfig, ...config };

  if (!finalConfig.webhookUrl) {
    console.warn('n8n translation webhook URL not configured');
    return texts.map((text) => ({
      translatedText: text,
      sourceLanguage: 'en' as SupportedLanguage,
      targetLanguage,
      success: false,
      error: 'Webhook URL not configured',
    }));
  }

  try {
    const response = await fetch(finalConfig.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage,
        context: 'business_landing_page_batch',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Batch translation request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.translations || texts.map((text: string) => ({
      translatedText: text,
      sourceLanguage: 'en',
      targetLanguage,
      success: true,
    }));
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts.map((text) => ({
      translatedText: text,
      sourceLanguage: 'en' as SupportedLanguage,
      targetLanguage,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
  }
}

/**
 * Get current language from URL or localStorage
 */
export function getCurrentLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }

  // Check URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lg');
  if (urlLang === 'en' || urlLang === 'es') {
    return urlLang;
  }

  // Check localStorage
  const storedLang = localStorage.getItem('tlang');
  if (storedLang === 'en' || storedLang === 'es') {
    return storedLang;
  }

  return 'en';
}

/**
 * Set language and update URL/localStorage
 */
export function setLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Update localStorage
  localStorage.setItem('tlang', lang);

  // Update URL
  const url = new URL(window.location.href);
  url.searchParams.set('lg', lang);
  window.history.replaceState({}, '', url.toString());

  // Dispatch event for components to react
  window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
}

/**
 * Static translations for the business page
 * These are used when n8n webhook is not available
 */
export const staticTranslations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.hiring': 'Hiring',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.switchToCandidate': 'Switch to Candidate',
    'nav.getStarted': 'Get Started Free',
    'nav.login': 'Log In',

    // Hero
    'hero.eyebrow': 'Trusted by 500+ Businesses in Texas — AI-Powered from Day One',
    'hero.headline1': 'The AI',
    'hero.headline2': 'Co-Founder',
    'hero.headline3': 'Every Small Business',
    'hero.headline4': 'Deserves.',
    'hero.sub': 'One platform. 21 questions. Market research, business plan, 30-day content marketing, AI images + video, smart hiring, and a 24/7 business coach — all powered by AI that actually understands your business.',
    'hero.cta.primary': 'Start With Your AI Co-Founder',
    'hero.cta.secondary': 'See What It Does',

    // Testimonials
    'testimonials.tag': 'Real Businesses. Real Results.',
    'testimonials.headline': "500+ Businesses Can't Be Wrong.",

    // Footer
    'footer.tagline': 'The AI Co-Founder for small businesses. Market research, business planning, content marketing, AI visuals, smart hiring, and 24/7 coaching — one platform.',
    'footer.copyright': '© 2026 MOIL. ALL RIGHTS RESERVED. · TEXAS-BORN. AI-POWERED.',
  },
  es: {
    // Navigation
    'nav.features': 'Características',
    'nav.howItWorks': 'Cómo Funciona',
    'nav.hiring': 'Contratación',
    'nav.pricing': 'Precios',
    'nav.blog': 'Blog',
    'nav.switchToCandidate': 'Cambiar a Candidato',
    'nav.getStarted': 'Comenzar Gratis',
    'nav.login': 'Iniciar Sesión',

    // Hero
    'hero.eyebrow': 'Confiado por más de 500 negocios en Texas — Impulsado por IA desde el primer día',
    'hero.headline1': 'El',
    'hero.headline2': 'Co-Fundador IA',
    'hero.headline3': 'Que Todo Pequeño Negocio',
    'hero.headline4': 'Merece.',
    'hero.sub': 'Una plataforma. 21 preguntas. Investigación de mercado, plan de negocios, marketing de contenido de 30 días, imágenes + video con IA, contratación inteligente y un coach de negocios 24/7 — todo impulsado por IA que realmente entiende tu negocio.',
    'hero.cta.primary': 'Comienza con tu Co-Fundador IA',
    'hero.cta.secondary': 'Ver Qué Hace',

    // Testimonials
    'testimonials.tag': 'Negocios Reales. Resultados Reales.',
    'testimonials.headline': 'Más de 500 negocios no pueden estar equivocados.',

    // Footer
    'footer.tagline': 'El Co-Fundador IA para pequeños negocios. Investigación de mercado, planificación empresarial, marketing de contenido, visuales con IA, contratación inteligente y coaching 24/7 — una plataforma.',
    'footer.copyright': '© 2026 MOIL. TODOS LOS DERECHOS RESERVADOS. · NACIDO EN TEXAS. IMPULSADO POR IA.',
  },
};

/**
 * Get a static translation
 */
export function t(key: string, lang?: SupportedLanguage): string {
  const currentLang = lang || getCurrentLanguage();
  return staticTranslations[currentLang]?.[key] || staticTranslations.en[key] || key;
}
