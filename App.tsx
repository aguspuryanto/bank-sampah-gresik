
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { WasteCategory, Transaction, UserProfile, WasteBank, RedemptionRecord } from './types';
import { WASTE_PRICES, WASTE_POINTS, GRESIK_WASTE_BANKS, REDEMPTION_ITEMS, EDUCATIONAL_GUIDES } from './constants';
import { getGeminiResponse } from './services/geminiService';
import L from 'leaflet';
import { 
  Plus, 
  TrendingUp, 
  MapPin, 
  Send, 
  Bot, 
  Clock, 
  Scale,
  ExternalLink,
  ArrowUpRight,
  MessageSquare,
  Gift,
  CheckCircle2,
  Trash2,
  BookOpen,
  Scissors,
  Lightbulb,
  AlertCircle,
  DollarSign,
  Leaf,
  BarChart3,
  Navigation,
  Info,
  History
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfile>({
    name: 'Warga Gresik',
    balance: 450000,
    points: 1250,
    totalWaste: 124.5,
    rank: 'Pahlawan Lingkungan'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2023-10-24', category: WasteCategory.PLASTIC, weight: 5.2, value: 18200, points: 52, status: 'completed' },
    { id: '2', date: '2023-10-20', category: WasteCategory.PAPER, weight: 10, value: 25000, points: 50, status: 'completed' },
    { id: '3', date: '2023-10-15', category: WasteCategory.METAL, weight: 1.5, value: 9000, points: 22, status: 'completed' },
  ]);

  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionRecord[]>([
    { id: 'rh1', date: '2023-10-22', itemName: 'Beras 1kg', pointsCost: 150, category: 'Sembako' },
    { id: 'rh2', date: '2023-10-18', itemName: 'Saldo Tunai Rp 10.000', pointsCost: 100, category: 'Cash' },
  ]);

  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Generate mock trend data for the last 30 days
  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const baseWeight = Math.sin(i / 2) * 2 + 5;
      const weight = Math.max(0, baseWeight + (Math.random() * 4 - 2));
      data.push({
        day: date.getDate(),
        month: date.toLocaleString('id-ID', { month: 'short' }),
        weight: parseFloat(weight.toFixed(1))
      });
    }
    return data;
  }, []);

  const [aiHistory, setAiHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAiLoading) return;
    const userMsg = inputMessage;
    setInputMessage('');
    setAiHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);
    const response = await getGeminiResponse(aiHistory, userMsg);
    setAiHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsAiLoading(false);
  };

  const redeemPoints = (item: typeof REDEMPTION_ITEMS[0]) => {
    if (user.points < item.pointsCost) {
      alert("Poin tidak cukup!");
      return;
    }
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newRedemption: RedemptionRecord = {
      id: `rh-${Date.now()}`,
      date: dateStr,
      itemName: item.name,
      pointsCost: item.pointsCost,
      category: item.category
    };

    setRedemptionHistory(prev => [newRedemption, ...prev]);
    setUser(prev => ({
      ...prev,
      points: prev.points - item.pointsCost,
      balance: item.category === 'Cash' ? prev.balance + 10000 : prev.balance
    }));
    
    alert(`Sukses menukarkan ${item.name}! Silakan cek riwayat penukaran.`);
  };

  // Map Initialization logic
  useEffect(() => {
    if (activeTab === 'locations' && !mapRef.current) {
      const gresikCenter: [number, number] = [-7.161, 112.657];
      const map = L.map('map-container').setView(gresikCenter, 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom icon for Waste Bank
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform hover:scale-125 duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      GRESIK_WASTE_BANKS.forEach(bank => {
        const marker = L.marker([bank.coords.lat, bank.coords.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 min-w-[150px]">
              <h3 class="font-bold text-slate-800 text-sm mb-1">${bank.name}</h3>
              <p class="text-[10px] text-slate-500 mb-2 leading-relaxed">${bank.address}</p>
              <button class="w-full bg-emerald-600 text-white text-[10px] py-1.5 rounded-lg font-bold uppercase tracking-wider">Setor Ke Sini</button>
            </div>
          `);

        // Added explicit click handler to center map on marker click
        marker.on('click', (e) => {
          map.flyTo(e.latlng, 16);
        });

        markersRef.current[bank.id] = marker;
      });

      mapRef.current = map;
    }

    return () => {
      if (activeTab !== 'locations' && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
  }, [activeTab]);

  const focusOnBank = (bank: WasteBank) => {
    if (mapRef.current) {
      mapRef.current.flyTo([bank.coords.lat, bank.coords.lng], 16);
      markersRef.current[bank.id]?.openPopup();
    }
    // Scroll map into view on mobile
    if (window.innerWidth < 768) {
      document.getElementById('map-container')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderWasteTrendChart = () => {
    const maxWeight = Math.max(...trendData.map(d => d.weight)) || 1;
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-600" />
              Tren Setoran Sampah
            </h3>
            <p className="text-xs text-slate-400">Total berat (Kg) dalam 30 hari terakhir</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600">
              {trendData.reduce((acc, curr) => acc + curr.weight, 0).toFixed(1)}
            </span>
            <span className="text-xs font-bold text-slate-400 ml-1">Kg Total</span>
          </div>
        </div>
        <div className="relative h-48 w-full flex items-end gap-[2px] md:gap-1">
          {trendData.map((d, i) => (
            <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                {d.day} {d.month}: {d.weight} Kg
              </div>
              <div 
                className="w-full bg-emerald-100 group-hover:bg-emerald-500 rounded-t-sm transition-all duration-300 ease-out relative"
                style={{ height: `${(d.weight / maxWeight) * 100}%` }}
              >
                {i % 7 === 0 && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {d.day} {d.month}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>30 Hari Lalu</span>
          <span>Hari Ini</span>
        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-6 animate-fadeIn pb-10">
      <section className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Total Tabungan</p>
              <h2 className="text-4xl font-bold">Rp {user.balance.toLocaleString('id-ID')}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 text-right">
              <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Poin B-Gres</p>
              <p className="text-2xl font-black">{user.points} pts</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Total Setor</p>
              <div className="flex items-center gap-2">
                <Scale size={16} />
                <span className="text-lg font-semibold">{user.totalWaste} Kg</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Peringkat</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span className="text-lg font-semibold">{user.rank}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full -mr-10 -mt-10 opacity-30"></div>
      </section>
      {renderWasteTrendChart()}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Clock size={20} className="text-emerald-600" />
              Aktivitas Terakhir
            </h3>
            <button onClick={() => setActiveTab('transactions')} className="text-emerald-600 text-sm font-medium hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 3).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Plus size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{tx.category}</p>
                    <p className="text-xs text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">+ Rp {tx.value.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-orange-600 font-bold">+{tx.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-orange-600">
            <Gift size={20} />
            Tukar Poin
          </h3>
          <div className="space-y-3">
            {REDEMPTION_ITEMS.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <CheckCircle2 className="text-emerald-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-500">{item.pointsCost} Poin</p>
                  </div>
                </div>
                <button 
                  onClick={() => redeemPoints(item)}
                  className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  Tukar
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-emerald-600 text-xs font-bold hover:underline">Lihat Semua Katalog Hadiah</button>
        </section>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Mari Belajar Memilah,<br/><span className="text-emerald-600">Jaga Gresik Tetap Asri</span></h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Pengelolaan sampah dimulai dari rumah. Dengan memisahkan sampah sesuai jenisnya, Anda membantu ekosistem daur ulang bekerja lebih cepat.
          </p>
        </div>
        <BookOpen className="absolute -right-8 -bottom-8 text-slate-50 w-64 h-64 -rotate-12" />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trash2 className="text-emerald-600" />
          Panduan Visual Pemilahan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EDUCATIONAL_GUIDES.map((guide, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:border-emerald-200 transition-colors">
              <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-white
                ${guide.color === 'blue' ? 'bg-blue-500' : ''}
                ${guide.color === 'amber' ? 'bg-amber-500' : ''}
                ${guide.color === 'slate' ? 'bg-slate-500' : ''}
                ${guide.color === 'emerald' ? 'bg-emerald-500' : ''}
              `}>
                <Scale size={24} />
              </div>
              <h4 className="font-bold text-lg mb-3">{guide.category}</h4>
              <ul className="space-y-2 mb-6 flex-1">
                {guide.tips.map((tip, tIdx) => (
                  <li key={tIdx} className="text-xs text-slate-500 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 flex items-center gap-1">
                  <Scissors size={10} /> Ide Kreatif
                </p>
                <p className="text-xs font-medium text-slate-700">{guide.craftIdea}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-12 animate-fadeIn pb-10">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <History className="text-emerald-600" size={28} />
            Setoran Sampah
          </h2>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-emerald-700 shadow-md transition-all active:scale-95">
            <Plus size={18} /> Setor Baru
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Berat</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Poin</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nilai (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{tx.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">{tx.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{tx.weight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-bold">+{tx.points} pts</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">{tx.value.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Gift className="text-orange-600" size={28} />
          Riwayat Penukaran Poin
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Hadiah</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Poin Digunakan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {redemptionHistory.length > 0 ? (
                  redemptionHistory.map((rh) => (
                    <tr key={rh.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{rh.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{rh.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rh.category === 'Cash' ? 'bg-blue-50 text-blue-700' :
                          rh.category === 'Sembako' ? 'bg-amber-50 text-amber-700' :
                          'bg-purple-50 text-purple-700'
                        }`}>
                          {rh.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-bold">-{rh.pointsCost} pts</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={14} /> Berhasil
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      Belum ada riwayat penukaran poin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-fadeIn pb-24 md:pb-0 overflow-hidden">
      {/* Left Column: List of Banks */}
      <div className="w-full md:w-2/5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="sticky top-0 bg-slate-50/90 backdrop-blur pb-4 z-10">
          <h2 className="text-2xl font-bold text-slate-800">Bank Sampah di Gresik</h2>
          <p className="text-sm text-slate-500">Terdapat 7 lokasi resmi yang melayani setoran.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {GRESIK_WASTE_BANKS.map(bank => (
            <div 
              key={bank.id} 
              onClick={() => focusOnBank(bank)}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-emerald-300 transition-all cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">{bank.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{bank.address}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1">
                      <Navigation size={12} /> Navigasi
                    </button>
                    <button className="px-3 bg-slate-50 text-slate-400 py-2 rounded-xl border border-slate-100 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                      <Info size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Interactive Map */}
      <div className="w-full md:w-3/5 h-[400px] md:h-full sticky top-0">
        <div 
          id="map-container" 
          className="w-full h-full bg-slate-200 shadow-2xl shadow-emerald-900/10 border-4 border-white"
        >
          {/* Leaflet map will be mounted here */}
        </div>
        
        {/* Floating Controls Overlay */}
        <div className="absolute top-4 right-4 z-[100] flex flex-col gap-2">
          <button 
            onClick={() => {
              if (mapRef.current) mapRef.current.setView([-7.161, 112.657], 13);
            }}
            className="bg-white p-3 rounded-2xl shadow-xl text-emerald-700 hover:bg-emerald-50 transition-colors border border-slate-100"
            title="Reset Center"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col animate-fadeIn">
      <div className="bg-white rounded-t-3xl p-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <Bot size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Asisten Pintar B-Gres</h2>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {aiHistory.length === 0 && (
          <div className="text-center py-12 px-6 max-w-sm mx-auto">
            <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-6">
              <MessageSquare size={36} />
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">Tanya apa saja seputar sampah!</h3>
            <p className="text-sm text-slate-500">
              Contoh: "Bagaimana cara mendaur ulang botol plastik?", "Di mana lokasi bank sampah terdekat di Manyar?"
            </p>
          </div>
        )}
        {aiHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-emerald-700 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-4 border-t border-slate-100 rounded-b-3xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ketik pesan anda..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={isAiLoading || !inputMessage.trim()}
            className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200 active:scale-90"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl mb-8">
        <h2 className="text-3xl font-bold mb-2">Galeri Kreasi Gresik</h2>
        <p className="text-emerald-50 opacity-90">Karya kreatif dari daur ulang sampah masyarakat Gresik.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { name: 'Tas Anyaman Plastik', price: 45000, img: 'https://picsum.photos/seed/bag/400/400' },
          { name: 'Pot Estetik Ban Bekas', price: 35000, img: 'https://picsum.photos/seed/pot/400/400' },
          { name: 'Hiasan Dinding Kertas', price: 25000, img: 'https://picsum.photos/seed/wall/400/400' },
          { name: 'Kotak Pensil Botol', price: 15000, img: 'https://picsum.photos/seed/pencil/400/400' },
          { name: 'Lampu Hias Plastik', price: 75000, img: 'https://picsum.photos/seed/lamp/400/400' },
          { name: 'Pupuk Kompos Organik', price: 10000, img: 'https://picsum.photos/seed/compost/400/400' }
        ].map((product, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
            <div className="relative aspect-square overflow-hidden">
              <img src={product.img} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 uppercase">Buatan Lokal</div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{product.name}</h4>
              <p className="text-emerald-600 font-bold mb-3">Rp {product.price.toLocaleString('id-ID')}</p>
              <button className="w-full bg-emerald-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors">Beli Sekarang</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'transactions': return renderTransactions();
      case 'edu': return renderEducation();
      case 'locations': return renderLocations();
      case 'ai': return renderAI();
      case 'market': return renderMarket();
      default: return renderHome();
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
