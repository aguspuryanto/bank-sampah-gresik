
import { WasteCategory, WasteBank, RedemptionItem } from './types';

export const WASTE_PRICES: Record<WasteCategory, number> = {
  [WasteCategory.ORGANIC]: 500,
  [WasteCategory.PLASTIC]: 3500,
  [WasteCategory.PAPER]: 2500,
  [WasteCategory.METAL]: 6000,
  [WasteCategory.GLASS]: 1500,
  [WasteCategory.OTHER]: 1000,
};

export const WASTE_POINTS: Record<WasteCategory, number> = {
  [WasteCategory.ORGANIC]: 2,
  [WasteCategory.PLASTIC]: 10,
  [WasteCategory.PAPER]: 5,
  [WasteCategory.METAL]: 15,
  [WasteCategory.GLASS]: 8,
  [WasteCategory.OTHER]: 3,
};

export const REDEMPTION_ITEMS: RedemptionItem[] = [
  { id: 'r1', name: 'Saldo Tunai Rp 10.000', pointsCost: 100, category: 'Cash', icon: 'DollarSign' },
  { id: 'r2', name: 'Beras 1kg', pointsCost: 150, category: 'Sembako', icon: 'Wheat' },
  { id: 'r3', name: 'Minyak Goreng 1L', pointsCost: 200, category: 'Sembako', icon: 'Droplets' },
  { id: 'r4', name: 'Gula Pasir 1kg', pointsCost: 120, category: 'Sembako', icon: 'Box' },
  { id: 'r5', name: 'Voucher PLN Rp 20.000', pointsCost: 250, category: 'Voucher', icon: 'Zap' },
];

export const EDUCATIONAL_GUIDES = [
  {
    category: WasteCategory.PLASTIC,
    color: 'blue',
    tips: ['Bilas sisa makanan', 'Lepas label jika bisa', 'Remas botol untuk hemat ruang'],
    craftIdea: 'Pot tanaman hias dari botol mineral bekas.'
  },
  {
    category: WasteCategory.PAPER,
    color: 'amber',
    tips: ['Hindari kertas berminyak', 'Pisahkan kardus dari kertas HVS', 'Simpan di tempat kering'],
    craftIdea: 'Keranjang anyaman dari lintingan koran bekas.'
  },
  {
    category: WasteCategory.METAL,
    color: 'slate',
    tips: ['Bersihkan kaleng susu', 'Pisahkan aluminium dari besi', 'Hati-hati tepi tajam'],
    craftIdea: 'Tempat pensil estetik dari kaleng sarden.'
  },
  {
    category: WasteCategory.ORGANIC,
    color: 'emerald',
    tips: ['Cacah sampah dapur', 'Jangan campur plastik', 'Gunakan wadah berventilasi'],
    craftIdea: 'Pupuk kompos cair (POC) untuk tanaman rumah.'
  }
];

export const GRESIK_WASTE_BANKS: WasteBank[] = [
  {
    id: '1',
    name: 'Bank Sampah Gresik',
    address: 'Jalan Raya, Jarangkuwung, Roomo, Manyar, Gresik Regency, East Java 61118',
    coords: { lat: -7.152, lng: 112.651 }
  },
  {
    id: '2',
    name: 'Bank Sampah "Ceria"',
    address: '36, Gg. IV No.12, Injen Barat, Tlogobendung, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61122',
    coords: { lat: -7.161, lng: 112.657 }
  },
  {
    id: '3',
    name: 'Bank Sampah Putri Mandiri',
    address: 'Jl. Awikoen Tama Selatan, Gending, Sidomoro, Kec. Kebomas, Kabupaten Gresik, Jawa Timur 61123',
    coords: { lat: -7.168, lng: 112.645 }
  },
  {
    id: '4',
    name: 'Bank Sampah GEMES - Fitriah',
    address: 'Jl Raya Dewi sekardadu 1a - 1b, Gunungsari, Ngargosari, Kec. Kebomas, Kabupaten Gresik, Jawa Timur 61124',
    coords: { lat: -7.172, lng: 112.639 }
  },
  {
    id: '5',
    name: 'Bank Sampah Perum Swan Regency',
    address: 'Bandut, Gempolkurung, Kec. Menganti, Kabupaten Gresik, Jawa Timur 61174',
    coords: { lat: -7.250, lng: 112.590 }
  },
  {
    id: '6',
    name: 'Bank Sampah Griyo Pojok',
    address: 'Jl. Gub. Suryo XI, Pojok, Tlogopojok, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61118',
    coords: { lat: -7.155, lng: 112.662 }
  },
  {
    id: '7',
    name: 'Bank Sampah Rezeki Berkah Tlogopojok',
    address: 'Jl. Gubernur Suryo No.335, RW.RT.03, Jarangkuwung, Tlogopojok, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61118',
    coords: { lat: -7.152, lng: 112.651 }
  }
];
