"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    'hero.title.line1': 'Launch Your Business',
    'hero.title.line2': 'In Record Time',
    'hero.subtitle': 'Get your business plan, website, and marketing materials ready in just 3-5 days. Everything you need to start strong.',
    'hero.feature1': 'AI-Powered',
    'hero.feature2': 'Fast Growth',
    'hero.feature3': 'Quick Launch',
    'hero.guarantee': 'Cancel anytime',
    'hero.cta': 'Start Your Business Now',
    'language.toggle': 'ES',
    
    // Features section
    'features.section.title': 'Everything You Need to Launch Successfully',
    'features.section.subtitle': 'Our comprehensive business launch package includes everything from strategy to execution.',
    'features.section.cta': 'Get Started Today',
    'features.section.note': 'No hidden fees. Cancel anytime.',
    
    'features.feature1.title': 'Professional Website',
    'features.feature1.desc': 'Custom-designed website that converts visitors into customers',
    'features.feature1.benefit1': 'Mobile-responsive design',
    'features.feature1.benefit2': 'SEO optimized',
    'features.feature1.benefit3': 'Fast loading speed',
    'features.feature1.benefit4': 'Contact forms included',
    'features.feature1.outcome': 'Ready in 3 days',
    
    'features.feature2.title': 'Business Plan',
    'features.feature2.desc': 'Comprehensive business plan tailored to your industry',
    'features.feature2.benefit1': 'Market analysis',
    'features.feature2.benefit2': 'Financial projections',
    'features.feature2.benefit3': 'Marketing strategy',
    'features.feature2.benefit4': 'Investor-ready format',
    'features.feature2.outcome': 'Professional quality',
    
    'features.feature3.title': 'Marketing Materials',
    'features.feature3.desc': 'Complete marketing package to promote your business',
    'features.feature3.benefit1': 'Logo design',
    'features.feature3.benefit2': 'Business cards',
    'features.feature3.benefit3': 'Social media templates',
    'features.feature3.benefit4': 'Email templates',
    'features.feature3.outcome': 'Brand ready',
    
    // FAQ section
    'faq.title': 'Quick Help',
    'faq.typing': 'Typing...',
    'faq.whatsapp': 'Chat on WhatsApp',
    'faq.input.placeholder': 'Ask a question...',
    'faq.question1': 'How long does it take?',
    'faq.answer1': 'We deliver your complete business package in 3-5 business days.',
    'faq.question2': 'What\'s included?',
    'faq.answer2': 'You get a professional website, business plan, and marketing materials.',
    'faq.question3': 'Can I make changes?',
    'faq.answer3': 'Yes! We offer unlimited revisions until you\'re 100% satisfied.',
    'faq.question4': 'What if I\'m not satisfied?',
    'faq.answer4': 'You can cancel anytime from your account settings; cancellation stops future renewals and you keep access through the end of your paid period.',
    'faq.question5': 'Do you provide support?',
    'faq.answer5': 'Yes, we provide ongoing support and maintenance for your business.'
  },
  es: {
    'hero.title.line1': 'Lanza Tu Negocio',
    'hero.title.line2': 'En Tiempo Récord',
    'hero.subtitle': 'Ten tu plan de negocio, sitio web y materiales de marketing listos en solo 3-5 días. Todo lo que necesitas para empezar fuerte.',
    'hero.feature1': 'IA Avanzada',
    'hero.feature2': 'Crecimiento Rápido',
    'hero.feature3': 'Lanzamiento Rápido',
    'hero.guarantee': 'Cancela cuando quieras',
    'hero.cta': 'Inicia Tu Negocio Ahora',
    'language.toggle': 'EN',
    
    // Features section
    'features.section.title': 'Todo Lo Que Necesitas Para Lanzar Con Éxito',
    'features.section.subtitle': 'Nuestro paquete completo de lanzamiento de negocio incluye todo desde estrategia hasta ejecución.',
    'features.section.cta': 'Comenzar Hoy',
    'features.section.note': 'Sin tarifas ocultas. Cancela en cualquier momento.',
    
    'features.feature1.title': 'Sitio Web Profesional',
    'features.feature1.desc': 'Sitio web diseñado a medida que convierte visitantes en clientes',
    'features.feature1.benefit1': 'Diseño responsivo móvil',
    'features.feature1.benefit2': 'Optimizado para SEO',
    'features.feature1.benefit3': 'Velocidad de carga rápida',
    'features.feature1.benefit4': 'Formularios de contacto incluidos',
    'features.feature1.outcome': 'Listo en 3 días',
    
    'features.feature2.title': 'Plan de Negocio',
    'features.feature2.desc': 'Plan de negocio integral adaptado a tu industria',
    'features.feature2.benefit1': 'Análisis de mercado',
    'features.feature2.benefit2': 'Proyecciones financieras',
    'features.feature2.benefit3': 'Estrategia de marketing',
    'features.feature2.benefit4': 'Formato listo para inversores',
    'features.feature2.outcome': 'Calidad profesional',
    
    'features.feature3.title': 'Materiales de Marketing',
    'features.feature3.desc': 'Paquete completo de marketing para promocionar tu negocio',
    'features.feature3.benefit1': 'Diseño de logo',
    'features.feature3.benefit2': 'Tarjetas de presentación',
    'features.feature3.benefit3': 'Plantillas de redes sociales',
    'features.feature3.benefit4': 'Plantillas de email',
    'features.feature3.outcome': 'Marca lista',
    
    // FAQ section
    'faq.title': 'Ayuda Rápida',
    'faq.typing': 'Escribiendo...',
    'faq.whatsapp': 'Chat en WhatsApp',
    'faq.input.placeholder': 'Haz una pregunta...',
    'faq.question1': '¿Cuánto tiempo toma?',
    'faq.answer1': 'Entregamos tu paquete completo de negocio en 3-5 días hábiles.',
    'faq.question2': '¿Qué está incluido?',
    'faq.answer2': 'Obtienes un sitio web profesional, plan de negocio y materiales de marketing.',
    'faq.question3': '¿Puedo hacer cambios?',
    'faq.answer3': '¡Sí! Ofrecemos revisiones ilimitadas hasta que estés 100% satisfecho.',
    'faq.question4': '¿Qué pasa si no estoy satisfecho?',
    'faq.answer4': 'Puedes cancelar cuando quieras desde la configuración de tu cuenta; la cancelación detiene las renovaciones futuras y conservas el acceso hasta el final de tu período pagado.',
    'faq.question5': '¿Proporcionan soporte?',
    'faq.answer5': 'Sí, proporcionamos soporte continuo y mantenimiento para tu negocio.'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
