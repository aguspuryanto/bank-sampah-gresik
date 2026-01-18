
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import { WasteCategory, Transaction, UserProfile, WasteBank, RedemptionRecord } from './types';
import { WASTE_PRICES, WASTE_POINTS, GRESIK_WASTE_BANKS, REDEMPTION_ITEMS, EDUCATIONAL_GUIDES, INITIAL_MEMBERS } from './constants';
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
  Gift,
  CheckCircle2,
  Trash2,
  BookOpen,
  Scissors,
  BarChart3,
  Navigation,
  Info,
  History,
  Users,
  Search,
  UserCheck,
  ChevronRight,
  User,
  ArrowRight
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [members, setMembers] = useState<UserProfile[]>(INITIAL_MEMBERS);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(INITIAL_MEMBERS[0].id);

  // Computed: Get the active profile
  const activeProfile = useMemo(() => 
    members.find(m => m.id === selectedMemberId) || members[0], 
  [members, selectedMemberId]);

  // Comprehensive mock data for all 10 members
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    return INITIAL_MEMBERS.flatMap(m => [
      { id: `t1-${m.id}`, memberId: m.id, date: '2023-10-24', category: WasteCategory.PLASTIC, weight: 5.2, value: 18200, points: 52, status: 'completed' },
      { id: `t2-${m.id}`, memberId: m.id, date: '2023-10-20', category: WasteCategory.PAPER, weight: 10, value: 25000, points: 50, status: 'completed' },
      { id: `t3-${m.id}`, memberId: m.id, date: '2023-10-15', category: WasteCategory.METAL, weight: 1.5, value: 9000, points: 22, status: 'completed' },
    ]);
  });

  const [allRedemptions, setAllRedemptions] = useState<RedemptionRecord[]>(() => {
    return INITIAL_MEMBERS.flatMap(m => [
      { id: `rh1-${m.id}`, memberId: m.id, date: '2023-10-22', itemName: 'Beras 1kg', pointsCost: 150, category: 'Sembako' },
      { id: `rh2-${m.id}`, memberId: m.id, date: '2023-10-18', itemName: 'Saldo Tunai Rp 10.000', pointsCost: 100, category: 'Cash' },
    ]);
  });

  // Filtered views based on current selection
  const currentTransactions = useMemo(() => 
    allTransactions.filter(t => t.memberId === selectedMemberId), 
  [allTransactions, selectedMemberId]);

  const currentRedemptions = useMemo(() => 
    allRedemptions.filter(r => r.memberId === selectedMemberId), 
  [allRedemptions, selectedMemberId]);

  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const trendData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const seed = selectedMemberId.charCodeAt(selectedMemberId.length - 1);
      const baseWeight = Math.sin((i + seed) / 2) * 2 + 5;
      const weight = Math.max(0, baseWeight + (Math.random() * 4 - 2));
      data.push({ day: date.getDate(), month: date.toLocaleString('id-ID', { month: 'short' }), weight: parseFloat(weight.toFixed(1)) });
    }
    return data;
  }, [selectedMemberId]);

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
    if (activeProfile.points < item.pointsCost) {
      alert("Poin tidak cukup!");
      return;
    }
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newRedemption: RedemptionRecord = { id: `rh-${Date.now()}`, memberId: selectedMemberId, date: dateStr, itemName: item.name, pointsCost: item.pointsCost, category: item.category };

    setAllRedemptions(prev => [newRedemption, ...prev]);
    setMembers(prev => prev.map(m => m.id === selectedMemberId ? {
      ...m,
      points: m.points - item.pointsCost,
      balance: item.category === 'Cash' ? m.balance + 10000 : m.balance
    } : m));
    
    alert(`Sukses menukarkan ${item.name} untuk ${activeProfile.name}!`);
  };

  useEffect(() => {
    if (activeTab === 'locations' && !mapRef.current) {
      const gresikCenter: [number, number] = [-7.161, 112.657];
      const map = L.map('map-container').setView(gresikCenter, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform hover:scale-125">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      GRESIK_WASTE_BANKS.forEach(bank => {
        const marker = L.marker([bank.coords.lat, bank.coords.lng], { icon: customIcon }).addTo(map).bindPopup(`
          <div class="p-2 min-w-[150px]">
            <h3 class="font-bold text-slate-800 text-sm mb-1">${bank.name}</h3>
            <p class="text-[10px] text-slate-500 mb-2">${bank.address}</p>
          </div>
        `);
        marker.on('click', (e) => map.flyTo(e.latlng, 16));
        markersRef.current[bank.id] = marker;
      });
      mapRef.current = map;
    }
    return () => { if (activeTab !== 'locations' && mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [activeTab]);

  const focusOnBank = (bank: WasteBank) => {
    if (mapRef.current) {
      mapRef.current.flyTo([bank.coords.lat, bank.coords.lng], 16);
      markersRef.current[bank.id]?.openPopup();
    }
    if (window.innerWidth < 768) document.getElementById('map-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderHome = () => (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
          {activeProfile.name[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Halo, {activeProfile.name}</h2>
          <p className="text-xs text-slate-500">Nasabah: {activeProfile.rank}</p>
        </div>
        <button onClick={() => setActiveTab('members')} className="ml-auto flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 border border-slate-100 shadow-sm hover:bg-slate-50">
          <UserCheck size={14} /> Ganti Nasabah
        </button>
      </div>

      <section className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Tabungan Nasabah</p>
              <h2 className="text-4xl font-bold">Rp {activeProfile.balance.toLocaleString('id-ID')}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2 text-right border border-white/20">
              <p className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Poin B-Gres</p>
              <p className="text-2xl font-black">{activeProfile.points} pts</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Total Setor</p>
              <div className="flex items-center gap-2">
                <Scale size={16} />
                <span className="text-lg font-semibold">{activeProfile.totalWaste} Kg</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-emerald-100 uppercase tracking-wider mb-1">Peringkat</p>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span className="text-lg font-semibold">{activeProfile.rank}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 rounded-full -mr-10 -mt-10 opacity-30"></div>
      </section>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-600" />
              Statistik Setoran: {activeProfile.name}
            </h3>
          </div>
        </div>
        <div className="relative h-48 w-full flex items-end gap-[2px] md:gap-1">
          {trendData.map((d, i) => (
            <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
              <div className="w-full bg-emerald-100 group-hover:bg-emerald-500 rounded-t-sm transition-all duration-300 ease-out relative" style={{ height: `${(d.weight / 15) * 100}%` }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Clock size={20} className="text-emerald-600" /> Aktivitas Terakhir</h3>
            <button onClick={() => setActiveTab('transactions')} className="text-emerald-600 text-sm font-medium">Lihat Semua</button>
          </div>
          <div className="space-y-4">
            {currentTransactions.slice(0, 3).map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700"><Plus size={18} /></div>
                  <div><p className="font-semibold text-slate-800 text-sm">{tx.category}</p><p className="text-[10px] text-slate-400">{tx.date}</p></div>
                </div>
                <div className="text-right"><p className="font-bold text-emerald-600 text-sm">+ Rp {tx.value.toLocaleString('id-ID')}</p></div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-orange-600"><Gift size={20} /> Tukar Poin</h3>
          <div className="space-y-3">
            {REDEMPTION_ITEMS.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm"><CheckCircle2 className="text-emerald-600" size={16} /></div>
                  <div><p className="text-sm font-bold text-slate-800">{item.name}</p><p className="text-[10px] text-slate-500">{item.pointsCost} Poin</p></div>
                </div>
                <button onClick={() => redeemPoints(item)} className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-xl">Tukar</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-8 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Nasabah</h2>
          <p className="text-sm text-slate-500">Pantau dan kelola aktivitas member Bank Sampah Gresik.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Cari nasabah..." className="w-full md:w-72 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
        </div>
      </div>

      {/* Main Member List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Profil Nasabah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sampah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Tunai</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Poin</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(member => (
                <tr key={member.id} className={`transition-colors ${selectedMemberId === member.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 shadow-sm ${selectedMemberId === member.id ? 'bg-emerald-600 text-white border-white' : 'bg-emerald-100 text-emerald-700 border-white'}`}>
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{member.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.rank}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                      <Scale size={14} className="text-emerald-500" /> {member.totalWaste} Kg
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-emerald-600 font-bold text-sm">Rp {member.balance.toLocaleString('id-ID')}</p>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-orange-600 font-bold text-sm">{member.points} pts</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 mx-auto ${
                        selectedMemberId === member.id 
                          ? 'bg-emerald-700 text-white shadow-lg' 
                          : 'bg-white text-emerald-700 border border-emerald-100 hover:bg-emerald-50'
                      }`}
                    >
                      {selectedMemberId === member.id ? <CheckCircle2 size={14} /> : null}
                      {selectedMemberId === member.id ? 'Terpilih' : 'Pilih'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED TRANSACTION SECTION FOR SELECTED MEMBER */}
      <div className="space-y-6 pt-4 animate-fadeIn" key={selectedMemberId}>
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700 shadow-sm">
              <History size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Detail Aktivitas: {activeProfile.name}</h3>
              <p className="text-sm text-slate-500">Riwayat lengkap setoran dan penukaran poin nasabah ini.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Buka Dashboard <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          {/* Sub-section: Waste Deposits Log */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <Scale size={18} className="text-emerald-600" />
              Log Setoran Sampah
            </h4>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Berat (Kg)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Poin</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nilai Rupiah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{tx.date}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                              {tx.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700">{tx.weight}</td>
                          <td className="px-6 py-4 text-sm font-bold text-orange-600">+{tx.points} pts</td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">Rp {tx.value.toLocaleString('id-ID')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic text-sm">Belum ada catatan setoran untuk nasabah ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sub-section: Redemption History Log */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <Gift size={18} className="text-orange-600" />
              Log Penukaran Hadiah
            </h4>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Hadiah</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Biaya Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentRedemptions.length > 0 ? (
                      currentRedemptions.map(rh => (
                        <tr key={rh.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{rh.date}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{rh.itemName}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                              rh.category === 'Cash' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              rh.category === 'Sembako' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-purple-50 text-purple-700 border-purple-100'
                            }`}>
                              {rh.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-red-500 text-center">-{rh.pointsCost} pts</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic text-sm">Belum ada riwayat penukaran untuk nasabah ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-12 animate-fadeIn pb-10">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <History className="text-emerald-600" size={28} />
              Setoran: {activeProfile.name}
            </h2>
            <p className="text-sm text-slate-500">Catatan lengkap pengiriman sampah untuk member ini.</p>
          </div>
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-emerald-700 shadow-md transition-all active:scale-95">
            <Plus size={18} /> Input Setoran Baru
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
                {currentTransactions.map((tx) => (
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
          Riwayat Penukaran: {activeProfile.name}
        </h2>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Hadiah</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Poin Digunakan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentRedemptions.length > 0 ? (
                  currentRedemptions.map((rh) => (
                    <tr key={rh.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{rh.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-bold">{rh.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-bold">-{rh.pointsCost} pts</td>
                      <td className="px-6 py-4 whitespace-nowrap text-emerald-600 font-bold text-xs flex items-center gap-1 pt-4">
                        <CheckCircle2 size={14} /> Selesai
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada riwayat penukaran poin.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'members': return renderMembers();
      case 'transactions': return renderTransactions();
      case 'edu': return (
        <div className="space-y-8 animate-fadeIn pb-10">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">Mari Belajar Memilah,<br/><span className="text-emerald-600">Jaga Gresik Tetap Asri</span></h2>
            <p className="text-slate-500 text-sm max-w-lg">Pengelolaan sampah dimulai dari rumah. Dengan memisahkan sampah sesuai jenisnya, Anda membantu ekosistem daur ulang bekerja lebih cepat.</p>
            <BookOpen className="absolute -right-8 -bottom-8 text-slate-50 w-64 h-64 -rotate-12" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {EDUCATIONAL_GUIDES.map((guide, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-white bg-emerald-500`}><Scale size={24} /></div>
                <h4 className="font-bold text-lg mb-3">{guide.category}</h4>
                <ul className="space-y-2 text-xs text-slate-500 mb-6">
                  {guide.tips.map((tip, tIdx) => <li key={tIdx} className="flex gap-2"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5" />{tip}</li>)}
                </ul>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ide Kreatif:</p>
                <p className="text-xs font-medium text-slate-700">{guide.craftIdea}</p>
              </div>
            ))}
          </div>
        </div>
      );
      case 'locations': return (
        <div className="h-full flex flex-col md:flex-row gap-6 animate-fadeIn pb-24 md:pb-0 overflow-hidden">
          <div className="w-full md:w-2/5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="sticky top-0 bg-slate-50/90 backdrop-blur pb-4 z-10">
              <h2 className="text-2xl font-bold text-slate-800">Lokasi Bank Sampah</h2>
              <p className="text-sm text-slate-500">7 titik resmi B-Gres di Kabupaten Gresik.</p>
            </div>
            <div className="flex flex-col gap-4">
              {GRESIK_WASTE_BANKS.map(bank => (
                <div key={bank.id} onClick={() => focusOnBank(bank)} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 w-10 h-10 rounded-2xl flex items-center justify-center text-emerald-700"><MapPin size={20} /></div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-1">{bank.name}</h3>
                      <p className="text-[10px] text-slate-500 leading-relaxed mb-4">{bank.address}</p>
                      <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2"><Navigation size={12} /> Navigasi</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-3/5 h-[400px] md:h-[calc(100vh-160px)] sticky top-0">
            <div id="map-container" className="w-full h-full bg-slate-200 shadow-2xl border-4 border-white rounded-3xl"></div>
          </div>
        </div>
      );
      case 'ai': return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col animate-fadeIn">
          <div className="bg-white rounded-t-3xl p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white shadow-lg"><Bot size={20} /></div>
            <div><h2 className="font-bold text-slate-800 text-sm">Asisten Pintar B-Gres</h2><p className="text-[10px] text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Aktif</p></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {aiHistory.length === 0 && (
              <div className="text-center py-12 px-6"><div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center text-emerald-700 mx-auto mb-4"><Bot size={32} /></div><h3 className="font-bold text-lg text-slate-800 mb-1">Ada yang bisa dibantu?</h3><p className="text-xs text-slate-500">Tanya seputar harga sampah hari ini atau lokasi terdekat.</p></div>
            )}
            {aiHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 border border-slate-100'}`}>{msg.text}</div>
              </div>
            ))}
            {isAiLoading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-1"><div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div><div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div></div></div>}
          </div>
          <div className="bg-white p-4 border-t border-slate-100 rounded-b-3xl">
            <div className="flex gap-2">
              <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya tentang sampah..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none" />
              <button onClick={handleSendMessage} disabled={isAiLoading || !inputMessage.trim()} className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg active:scale-90"><Send size={20} /></button>
            </div>
          </div>
        </div>
      );
      case 'market': return (
        <div className="space-y-6 animate-fadeIn pb-10">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-2 text-white">Galeri Kreasi Gresik</h2>
            <p className="text-emerald-50 text-sm">Produk unik hasil daur ulang nasabah bank sampah.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Tas Plastik Anyam', price: 45000, img: 'https://picsum.photos/seed/gresik1/400/400' },
              { name: 'Pot Estetik Ban', price: 35000, img: 'https://picsum.photos/seed/gresik2/400/400' },
              { name: 'Pupuk Kompos 1kg', price: 10000, img: 'https://picsum.photos/seed/gresik3/400/400' },
              { name: 'Lampu Hias Kertas', price: 75000, img: 'https://picsum.photos/seed/gresik4/400/400' }
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group">
                <div className="aspect-square bg-slate-100"><img src={p.img} alt={p.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform" /></div>
                <div className="p-4"><h4 className="font-bold text-slate-800 text-sm mb-1">{p.name}</h4><p className="text-emerald-600 font-bold text-sm mb-3">Rp {p.price.toLocaleString('id-ID')}</p><button className="w-full bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold">Beli</button></div>
              </div>
            ))}
          </div>
        </div>
      );
      default: return renderHome();
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userName={activeProfile.name}>
      <div className="h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
