
import React from 'react';
import { Home, History, MapPin, MessageSquare, ShoppingBag, Leaf, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'transactions', label: 'Setor', icon: History },
    { id: 'edu', label: 'Edukasi', icon: BookOpen },
    { id: 'ai', label: 'Tanya AI', icon: MessageSquare },
    { id: 'locations', label: 'Lokasi', icon: MapPin },
    { id: 'market', label: 'Produk', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-emerald-700 text-white p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white p-2 rounded-lg">
            <Leaf className="text-emerald-700 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">B-Gres</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white text-emerald-700 shadow-md font-semibold' : 'hover:bg-emerald-600/50'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden bg-emerald-700 text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          <span className="font-bold text-xl">B-Gres</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold">U</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-1 min-w-[64px] transition-colors ${
              activeTab === tab.id ? 'text-emerald-700 font-medium' : 'text-slate-400'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
