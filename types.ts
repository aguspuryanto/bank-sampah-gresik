
export enum WasteCategory {
  ORGANIC = 'Organik',
  PLASTIC = 'Plastik',
  PAPER = 'Kertas',
  METAL = 'Logam',
  GLASS = 'Kaca',
  OTHER = 'Lainnya'
}

export interface WasteBank {
  id: string;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

export interface Transaction {
  id: string;
  date: string;
  category: WasteCategory;
  weight: number; // in kg
  value: number; // in IDR
  status: 'pending' | 'completed';
}

export interface UserProfile {
  name: string;
  balance: number;
  totalWaste: number;
  rank: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
