export type VehicleType = 'electric' | 'petrol' | 'scooter' | 'coming_soon';

export interface Product {
  id: string;
  name: string;
  type: VehicleType;
  image: string;
  range?: string;         // e.g., "120 km"
  topSpeed: string;       // e.g., "85 km/h"
  battery?: string;       // e.g., "72V 40Ah LFP"
  engine?: string;        // e.g., "125cc Euro 5" or "3.0 kW Mid-drive"
  price: string;          // e.g., "PKR 245,000"
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  features: string[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface Dealer {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: { x: number; y: number }; // Percentage offsets for SVG map
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
