
import { WasteCategory, WasteBank } from './types';

export const WASTE_PRICES: Record<WasteCategory, number> = {
  [WasteCategory.ORGANIC]: 500,
  [WasteCategory.PLASTIC]: 3500,
  [WasteCategory.PAPER]: 2500,
  [WasteCategory.METAL]: 6000,
  [WasteCategory.GLASS]: 1500,
  [WasteCategory.OTHER]: 1000,
};

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
  }
];
