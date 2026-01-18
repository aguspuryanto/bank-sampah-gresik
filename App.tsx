
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { WasteCategory, Transaction, UserProfile, WasteBank } from './types';
import { WASTE_PRICES, GRESIK_WASTE_BANKS } from './constants';
import { getGeminiResponse } from './services/geminiService';
import { 
  Plus, 
  TrendingUp, 
  MapPin, 
  ChevronRight, 
  Send, 
  Bot, 
  Clock, 
  DollarSign, 
  Scale,
  ExternalLink,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfile>({
    name: 'Warga Gresik',
    balance: 450000,
    totalWaste: 124.5,
    rank: 'Pahlawan Lingkungan'
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', date: '2023-10-24', category: WasteCategory.PLASTIC, weight: 5.2, value: 18200, status: 'completed' },
    { id: '2', date: '2023-10-20', category: WasteCategory.PAPER, weight: 10, value: 25000, status: 'completed' },
    { id: '3', date: '2023-10-15', category: WasteCategory.METAL, weight: 1.5, value: 9000, status: 'completed' },
  ]);

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

  const renderHome = () => (
    <div className="space-y-6 animate-fadeIn">
      <section className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-medium mb-1">Total Tabungan</p>
          <h2 className="text-4xl font-bold mb-6">Rp {user.balance.toLocaleString('id-ID')}</h2>
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

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
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
                  <p className="text-xs text-slate-400">{tx.weight} Kg</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-600" />
            Tips Hari Ini
          </h3>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-amber-800 text-sm italic">
              "Pisahkan sampah plastik dan cuci bersih sebelum disetorkan. Sampah bersih memiliki nilai jual 20% lebih tinggi di Bank Sampah Gresik!"
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">#ZeroWasteGresik</span>
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">#DaurUlang</span>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4">4 Cara Menghasilkan Uang</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Pemilahan Efisien', desc: 'Pisahkan organik, plastik, kertas.' },
            { title: 'Datangi Bank Sampah', desc: 'Jual ke pengepul lokal terdekat.' },
            { title: 'Tukar Barang', desc: 'Poin bisa ditukar sembako/uang.' },
            { title: 'Produk Kreatif', desc: 'Ubah sampah jadi kerajinan mahal.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold mb-3">{idx + 1}</div>
              <h4 className="font-bold text-emerald-800 mb-1">{item.title}</h4>
              <p className="text-xs text-emerald-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Catatan Transaksi</h2>
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nilai (Rp)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-bold">{tx.value.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      {tx.status === 'completed' ? 'Selesai' : 'Diproses'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold">Lokasi Bank Sampah Gresik</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {GRESIK_WASTE_BANKS.map(bank => (
          <div key={bank.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-all">
            <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-700 mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">{bank.name}</h3>
            <p className="text-sm text-slate-500 flex-1 leading-relaxed mb-4">{bank.address}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-emerald-50 text-emerald-700 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                Rute <ArrowUpRight size={14} />
              </button>
              <button className="px-3 bg-slate-50 text-slate-400 py-2 rounded-xl border border-slate-100">
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
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
      case 'locations': return renderLocations();
      case 'ai': return renderAI();
      case 'market': return renderMarket();
      default: return renderHome();
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
