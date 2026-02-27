export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
};

export const navLinks: NavLink[] = [
  { label: 'How It Works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Compare', href: '#comparison' },
];

export type HeroDay = {
  type: 'edu' | 'promo' | 'eng' | 'bts' | 'ent';
  emoji: string;
  video?: boolean;
};

export const heroDayData: HeroDay[] = [
  { type: 'edu', emoji: '📊' },
  { type: 'promo', emoji: '⚡' },
  { type: 'eng', emoji: '💬' },
  { type: 'bts', emoji: '🔧' },
  { type: 'ent', emoji: '😄' },
  { type: 'edu', emoji: '📈' },
  { type: 'promo', emoji: '🎯', video: true },
  { type: 'eng', emoji: '🗣️' },
  { type: 'edu', emoji: '💡' },
  { type: 'promo', emoji: '🔥', video: true },
  { type: 'bts', emoji: '👀' },
  { type: 'eng', emoji: '❓' },
  { type: 'edu', emoji: '🏆' },
  { type: 'promo', emoji: '💰' },
  { type: 'ent', emoji: '🎉', video: true },
  { type: 'edu', emoji: '📱' },
  { type: 'eng', emoji: '🤝' },
  { type: 'promo', emoji: '⭐', video: true },
  { type: 'bts', emoji: '🛠️' },
  { type: 'edu', emoji: '📋' },
  { type: 'promo', emoji: '🚀', video: true },
  { type: 'eng', emoji: '💭' },
  { type: 'edu', emoji: '🔑' },
  { type: 'bts', emoji: '📸' },
  { type: 'promo', emoji: '🎁' },
  { type: 'eng', emoji: '✅' },
  { type: 'edu', emoji: '💪' },
  { type: 'promo', emoji: '🏅' },
  { type: 'bts', emoji: '🌟' },
  { type: 'promo', emoji: '🔔', video: true },
];

export type JourneyStep = {
  number: string;
  time: string;
  title: string;
  description: string;
  badge?: string;
  outputs: string[];
};

export const journeySteps: JourneyStep[] = [
  {
    number: '01',
    time: '5–10 MIN',
    title: '21 Strategic Questions',
    description:
      'Answer 21 questions by voice or text — in English or Spanish. Your AI co-founder learns everything: your model, your market, your goals, your gaps.',
    outputs: ['Business Model Analysis', 'Gap Identification', 'Strength Mapping', 'Bilingual EN/ES'],
  },
  {
    number: '02',
    time: 'AUTOMATED',
    title: '20–30 Pages of Real Market Research',
    description:
      'Deep analysis using your answers. TAM/SAM/SOM. Competitive landscape. Customer personas. Opportunity scoring. 8–10 authoritative sources. Real data. Not guesses.',
    outputs: ['TAM/SAM/SOM', 'Competitor Analysis', 'Customer Personas', 'Validation Report'],
  },
  {
    number: '03',
    time: 'ONE CLICK',
    title: 'Investor-Ready Business Plan',
    description:
      'Polished PDF ready for investors, banks, or partners. 5-year financial projections, go-to-market strategy, operational roadmap, funding requirements. Minutes, not months.',
    outputs: ['5-Year Projections', 'Revenue Models', 'Go-To-Market', 'Funding Analysis'],
  },
  {
    number: '04',
    time: '⭐ CONTENT360',
    badge: 'highlight',
    title: 'Your Complete 30-Day Marketing Engine',
    description:
      '30 days of researched topics, optimized hooks, full captions by content type, CTAs, hashtags, AI-generated images, and AI video for your highest-impact days — all done.',
    outputs: ['30-Day Calendar', 'AI Images', 'AI Video', 'Strategy Score'],
  },
  {
    number: '05',
    time: '2 MIN TO POST',
    title: 'Smart Hiring & Team Building',
    description:
      'Post once, reach 10+ platforms automatically. AI scores every candidate on skills, location, experience, and language fit. 95% accuracy. 11-day average time to hire.',
    outputs: ['10+ Platforms', '95% Accuracy', 'Bilingual Matching', 'Auto-Screening'],
  },
  {
    number: '06',
    time: '24/7',
    title: 'Ongoing AI Business Coach',
    description:
      'The more you use it, the better it knows your business. Cash flow guidance. Marketing refinements. Retention tactics. Scaling advice. An AI co-founder that never sleeps.',
    outputs: ['Growth Strategy', 'Cash Flow', 'Retention Tactics', 'Industry Alerts'],
  },
];

export type FeatureCard = {
  icon: string;
  title: string;
  description: string;
  tags?: { label: string; className: string }[];
  variant?: 'large';
};

export const featureCards: FeatureCard[] = [
  {
    icon: '📅',
    title: 'The 30-Day Calendar',
    description:
      "Every day has a researched topic, tested hook, full caption calibrated by content type, CTA, and optimized hashtags. Educational: 250–400 words. Promotional: 100–200. Engagement: 150–300.",
    tags: [
      { label: '30 Days', className: 'f-tag f-tag-o' },
      { label: '6 Content Types', className: 'f-tag f-tag-b' },
      { label: 'Platform Strategy', className: 'f-tag f-tag-g' },
      { label: 'Best Post Times', className: 'f-tag f-tag-a' },
    ],
  },
  {
    icon: '🎨',
    title: 'AI Visuals + Video',
    description:
      'Not stock photos. Hyper-literal, topic-specific images that show exactly what your post discusses. AI video auto-assigned to your highest-impact days. No camera. No designer. No excuses.',
    tags: [
      { label: '30 Custom Images', className: 'f-tag f-tag-o' },
      { label: '5+ Video Days', className: 'f-tag f-tag-b' },
      { label: 'Brand Aligned', className: 'f-tag f-tag-g' },
      { label: 'Reels Ready', className: 'f-tag f-tag-a' },
    ],
  },
  {
    icon: '🧬',
    title: 'Brand DNA',
    description:
      "Your brand colors, tone of voice, negative keywords — locked in. Content360 doesn't create generic content. It creates YOUR content, with your personality, your energy, your standards.",
    tags: [
      { label: 'Color System', className: 'f-tag f-tag-o' },
      { label: 'Tone Profile', className: 'f-tag f-tag-b' },
      { label: 'Voice Lock', className: 'f-tag f-tag-g' },
    ],
  },
  {
    icon: '🔄',
    title: 'Recursive Growth Engine',
    description:
      "Feed it last month's results. It reads your full history and won't repeat a single topic, angle, or hook. Your content compounds. Foundation → Expansion → Authority → Dominance.",
    tags: [
      { label: 'Zero Repetition', className: 'f-tag f-tag-o' },
      { label: 'Story Evolution', className: 'f-tag f-tag-a' },
      { label: 'Compounds Monthly', className: 'f-tag f-tag-g' },
    ],
  },
  {
    icon: '🌎',
    title: 'Bilingual Intelligence',
    description:
      'Every post, every caption, every strategy — in English and Spanish. One click to translate. Built for the America that actually exists. Reach 58% more bilingual customers than competitors.',
    tags: [
      { label: 'English', className: 'f-tag f-tag-o' },
      { label: 'Español', className: 'f-tag f-tag-b' },
      { label: 'One-Click Toggle', className: 'f-tag f-tag-g' },
      { label: '58% More Reach', className: 'f-tag f-tag-a' },
    ],
    variant: 'large',
  },
];

export const stats = [
  { target: 500, suffix: '+', label: 'Businesses Trusting Moil' },
  { target: 5000, suffix: '+', label: 'Jobs Posted Monthly' },
  { target: 94, suffix: '%', label: 'Interview Success Rate' },
  { target: 11, suffix: '', label: 'Days Avg Time to Hire' },
  { target: 91, suffix: '%', label: 'Employee Retention at 90 Days' },
  { prefix: '$', target: 15, suffix: '', label: 'Starting Price Per Month' },
];

export type PricingPlan = {
  tier: string;
  price: string;
  period: string;
  tagline: string;
  featured?: boolean;
  features: { icon: 'check' | 'star'; text: string }[];
  ctaLabel: string;
  ctaHref: string;
  ctaClass: 'price-cta-secondary' | 'price-cta-primary';
};

export const pricingPlans: PricingPlan[] = [
  {
    tier: 'Starter',
    price: '$15',
    period: '/month',
    tagline: "Perfect for small businesses that want full access to Moil's AI tools.",
    features: [
      { icon: 'check', text: 'AI Market Research Assistant' },
      { icon: 'check', text: 'AI Business Coach' },
      { icon: 'check', text: 'Up to 3 job postings/month' },
      { icon: 'check', text: '75 AI-generated images' },
      { icon: 'check', text: '75 AI image edits' },
      { icon: 'check', text: '5 min audio generation' },
      { icon: 'check', text: 'Full Moil AI toolbox' },
      { icon: 'check', text: 'Bilingual: English & Spanish' },
      { icon: 'check', text: 'Advanced analytics' },
    ],
    ctaLabel: 'Get Started →',
    ctaHref: 'https://moilapp.com/business',
    ctaClass: 'price-cta-secondary',
  },
  {
    tier: 'Professional',
    price: '$25',
    period: '/month',
    tagline: 'Ideal for growing businesses with regular hiring and content needs.',
    features: [
      { icon: 'check', text: '10 job postings/month' },
      { icon: 'check', text: '200 AI-generated images' },
      { icon: 'check', text: '200 AI image edits' },
      { icon: 'check', text: '15 min audio generation' },
      { icon: 'check', text: 'AI Business Coach & Research' },
      { icon: 'check', text: 'Premium analytics + tracking' },
      { icon: 'check', text: 'Priority email & phone support' },
    ],
    ctaLabel: 'Get Started →',
    ctaHref: 'https://moilapp.com/business',
    ctaClass: 'price-cta-secondary',
  },
  {
    tier: 'Market Pro',
    price: '$75',
    period: '/month',
    tagline: 'Unlimited access and maximum marketing power.',
    featured: true,
    features: [
      { icon: 'star', text: 'Unlimited job postings' },
      { icon: 'star', text: 'Unlimited AI images & edits' },
      { icon: 'star', text: '30 min audio generation' },
      { icon: 'star', text: '15 video credits/month' },
      { icon: 'star', text: 'Content360 Full Access' },
      { icon: 'star', text: 'Market Pro suite' },
      { icon: 'star', text: 'AI Coach & Market Research' },
      { icon: 'star', text: 'Dedicated account support' },
    ],
    ctaLabel: 'Upgrade to Market Pro →',
    ctaHref: 'https://moilapp.com/business',
    ctaClass: 'price-cta-primary',
  },
];

export type ComparisonRow = {
  feature: string;
  moil: string;
  consultant: string;
  aiTool: string;
  moilHighlight?: boolean;
};

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Market Research (20–30 pages)',
    moil: 'check',
    consultant: 'check ($5K+)',
    aiTool: 'x',
  },
  {
    feature: '30-Day Content Calendar',
    moil: 'check',
    consultant: 'x',
    aiTool: 'partial',
  },
  {
    feature: 'AI-Generated Images',
    moil: 'check',
    consultant: 'x',
    aiTool: 'x',
  },
  {
    feature: 'AI Video Generation',
    moil: 'check',
    consultant: 'x',
    aiTool: 'x',
  },
  {
    feature: 'Smart Hiring (10+ Platforms)',
    moil: 'check',
    consultant: 'x',
    aiTool: 'x',
  },
  {
    feature: 'Investor-Ready Business Plan',
    moil: 'check',
    consultant: 'check ($15K)',
    aiTool: 'x',
  },
  {
    feature: 'Bilingual (English & Spanish)',
    moil: 'check',
    consultant: 'partial',
    aiTool: 'x',
  },
  {
    feature: '24/7 AI Business Coach',
    moil: 'check',
    consultant: 'x',
    aiTool: 'partial',
  },
  {
    feature: 'Brand DNA System',
    moil: 'check',
    consultant: 'x',
    aiTool: 'x',
  },
  {
    feature: 'Monthly Price',
    moil: '$15–$75/mo',
    consultant: '$5,000+',
    aiTool: '$50–$200/mo',
    moilHighlight: true,
  },
];

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  avatar: string;
  gradient: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Luis Vives',
    role: 'Business Owner · Texas',
    text:
      'I\'ve used it to post a position, and I am impressed with how easy, intuitive, and effective Moil is. Within hours, we connected with multiple great candidates. I definitely recommend it.',
    avatar: 'L',
    gradient: 'linear-gradient(135deg,var(--orange-dim),var(--purple-dim))',
  },
  {
    name: 'Liliana Cervantes',
    role: 'SMB Owner · Texas',
    text:
      "Excellent platform whether to look for a job or look for workers. I recommend it 100%. The AI matching actually works — it finds people that fit exactly what we need.",
    avatar: 'L',
    gradient: 'linear-gradient(135deg,var(--purple-dim),var(--blue-dim))',
  },
  {
    name: 'Miguel Bustos',
    role: 'Service Business · Texas',
    text:
      '100% RECOMMENDABLE. This platform helps me find employees when I need extra help. Fast, accurate, and bilingual. The EN/ES feature is a complete game changer for my business.',
    avatar: 'M',
    gradient: 'linear-gradient(135deg,var(--orange-dim),var(--purple-dim))',
  },
];

export type TerminalLine = {
  key: string;
  value: string;
  status: string;
  statusClass?: 'running' | 'accent';
};

export const terminalLines: TerminalLine[] = [
  {
    key: 'BUSINESS:',
    value: 'Austin HVAC Pros · Target: Homeowners 30–55 · Market: Central Texas',
    status: '✓ LOADED',
  },
  {
    key: 'MARKET RESEARCH:',
    value: 'Scanning 8 live sources — HVAC trends, seasonal demand, competitor gaps...',
    status: '● RUNNING',
    statusClass: 'running',
  },
  {
    key: 'BRAND DNA:',
    value: 'Colors #1E40AF/#FF5C1A · Tone: Expert & Trustworthy · Voice: Direct',
    status: '✓ LOCKED',
  },
  {
    key: 'INSIGHTS:',
    value: '"AC tune-up demand up 34% in Feb · Bilingual content +58% reach · Video days top performers"',
    status: '✓ GROUNDED',
  },
  {
    key: 'CALENDAR:',
    value: 'Generating 30 days · 6 content types · 5 video days · Custom hooks + captions...',
    status: '● BUILDING',
    statusClass: 'running',
  },
  {
    key: 'AI VISUALS:',
    value: '30 custom images generated · Literal topic representation · Brand-aligned',
    status: '✓ RENDERED',
  },
  {
    key: 'STRATEGY SCORE:',
    value: 'Analyzing quality, variety, market alignment, brand consistency...',
    status: '⚡ SCORING',
    statusClass: 'accent',
  },
];
