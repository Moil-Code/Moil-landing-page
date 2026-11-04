import { JSX } from 'react';
import {
  BarChart3,
  ClipboardList,
  Calendar,
  Target,
  MessageSquare,
  Palette,
  Globe,
  Mic,
  Edit3,
  Rocket,
  Star,
  Bot,
  FileText,
  Play,
  Lock,
  ArrowRight,
} from 'lucide-react';

/**
 * Shared lucide icon lookup used across the business section components.
 * Extracted from BusinessPageContent so every section can import it directly.
 */
export const IconMap: Record<string, JSX.Element> = {
  chart: <BarChart3 size={24} />,
  clipboard: <ClipboardList size={24} />,
  calendar: <Calendar size={24} />,
  target: <Target size={24} />,
  message: <MessageSquare size={24} />,
  palette: <Palette size={24} />,
  globe: <Globe size={24} />,
  mic: <Mic size={24} />,
  edit: <Edit3 size={24} />,
  rocket: <Rocket size={24} />,
  star: <Star size={24} fill="currentColor" />,
  bot: <Bot size={24} />,
  document: <FileText size={24} />,
  play: <Play size={24} fill="currentColor" />,
  lock: <Lock size={16} />,
  arrowRight: <ArrowRight size={16} />,
};

// These render as 44x44 avatars, so ask Cloudinary for 88px (2x DPR) instead of
// the raw uploads — Liliana's original is an 822 KB JPEG for a 44px circle.
export const testimonialImages = [
  'https://res.cloudinary.com/drlcisipo/image/upload/f_auto,q_auto,w_88/v1721818529/Website%20images/Luis_Vives_pleeyc.jpg',
  'https://res.cloudinary.com/drlcisipo/image/upload/f_auto,q_auto,w_88/v1721818532/Website%20images/Liliana_Cervantes_g2gb0v.jpg',
  'https://res.cloudinary.com/drlcisipo/image/upload/f_auto,q_auto,w_88/v1721818530/Website%20images/Miguel_Bustos_aktvri.jpg',
];
