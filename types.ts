
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
  memberId: string;
  date: string;
  category: WasteCategory;
  weight: number; 
  value: number; 
  points: number;
  status: 'pending' | 'completed';
}

export interface RedemptionRecord {
  id: string;
  memberId: string;
  date: string;
  itemName: string;
  pointsCost: number;
  category: 'Cash' | 'Sembako' | 'Voucher';
}

export interface UserProfile {
  id: string;
  name: string;
  balance: number;
  points: number;
  totalWaste: number;
  rank: string;
  avatar?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RedemptionItem {
  id: string;
  name: string;
  pointsCost: number;
  category: 'Cash' | 'Sembako' | 'Voucher';
  icon: string;
}
