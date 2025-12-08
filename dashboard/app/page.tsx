'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import StatsCard from '@/components/StatsCard';
import BankSelector from '@/components/BankSelector';
import { Building2, MapPin, TrendingUp, Users, Target, Layers } from 'lucide-react';

// Dynamically import the map to avoid SSR issues with Leaflet
const BranchMap = dynamic(() => import('@/components/BranchMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-xl font-semibold text-gray-600">Loading map...</div>
    </div>
  ),
});

interface Branch {
  bank_name: string;
  lat: number;
  long: number;
}

export default function Home() {
  const [selectedBank, setSelectedBank] = useState<string | null>('all');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/branches.json')
      .then((res) => res.json())
      .then((data) => {
        setBranches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading branches:', err);
        setLoading(false);
      });
  }, []);

  // Calculate statistics
  const totalBranches = branches.length;
  const totalBanks = new Set(branches.map((b) => b.bank_name)).size;
  const bobBranches = branches.filter((b) => b.bank_name === 'Bank of Baku').length;
  const marketShare = totalBranches > 0 ? ((bobBranches / totalBranches) * 100).toFixed(1) : '0';

  // Get bank ranking
  const bankCounts: { [key: string]: number } = {};
  branches.forEach((branch) => {
    bankCounts[branch.bank_name] = (bankCounts[branch.bank_name] || 0) + 1;
  });
  const sortedBanks = Object.entries(bankCounts).sort((a, b) => b[1] - a[1]);
  const bobRank = sortedBanks.findIndex(([bank]) => bank === 'Bank of Baku') + 1;

  // Calculate selected bank stats
  const selectedBranchCount = selectedBank && selectedBank !== 'all'
    ? branches.filter((b) => b.bank_name === selectedBank).length
    : totalBranches;

  const selectedBankShare = selectedBank && selectedBank !== 'all'
    ? ((selectedBranchCount / totalBranches) * 100).toFixed(1)
    : '100';

  return (
    <div className="min-h-screen">
      {/* Header with gradient background */}
      <header className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                  <MapPin className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                  Azerbaijan Bank Network
                </h1>
              </div>
              <p className="text-lg text-white/90 font-medium max-w-2xl">
                Interactive map & analytics dashboard for {totalBranches} bank branches across {totalBanks} banks
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="glass px-6 py-4 rounded-2xl border-2 border-white/40 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
                    <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Focus Bank</p>
                    <p className="text-lg font-bold text-white">Bank of Baku</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <span className="text-xs font-semibold text-white/90">Rank #{bobRank}</span>
                <span className="text-white/60">•</span>
                <span className="text-xs font-semibold text-white/90">{bobBranches} branches</span>
                <span className="text-white/60">•</span>
                <span className="text-xs font-semibold text-white/90">{marketShare}% share</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 48h1440V0s-280 48-720 48S0 0 0 0v48z" fill="currentColor" className="text-gray-50"/>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Branches"
            value={totalBranches}
            subtitle={`Across ${totalBanks} banks`}
            icon={MapPin}
            color="blue"
          />
          <StatsCard
            title="Bank of Baku Branches"
            value={bobBranches}
            subtitle={`Rank #${bobRank} in market`}
            icon={Building2}
            color="red"
          />
          <StatsCard
            title="Market Share"
            value={`${marketShare}%`}
            subtitle="Bank of Baku coverage"
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Coverage"
            value={totalBanks}
            subtitle="Banks operating in Azerbaijan"
            icon={Layers}
            color="purple"
          />
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Bank Selector */}
          <div className="lg:col-span-1">
            <BankSelector selectedBank={selectedBank} onSelectBank={setSelectedBank} />

            {/* Selected Bank Info */}
            {selectedBank && selectedBank !== 'all' && (
              <div className="mt-6 glass rounded-2xl shadow-xl p-6 border border-white/30 animate-fadeIn">
                <div className="mb-4">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Selected Bank
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Bank Name</p>
                    <p className="text-lg font-bold text-gray-900">{selectedBank}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white rounded-xl border border-gray-200 hover-lift">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {selectedBranchCount}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold mt-1">Branches</div>
                    </div>

                    <div className="text-center p-3 bg-white rounded-xl border border-gray-200 hover-lift">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {selectedBankShare}%
                      </div>
                      <div className="text-xs text-gray-600 font-semibold mt-1">Market</div>
                    </div>

                    <div className="text-center p-3 bg-white rounded-xl border border-gray-200 hover-lift">
                      <div className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        #{sortedBanks.findIndex(([bank]) => bank === selectedBank) + 1}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold mt-1">Rank</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl shadow-2xl border border-white/30 overflow-hidden animate-fadeIn">
              {/* Map Header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wLTEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

                <div className="relative px-6 py-5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                        <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-white drop-shadow-lg">
                          {selectedBank && selectedBank !== 'all' ? selectedBank : 'All Banks'}
                        </h2>
                        <p className="text-sm text-white/80 font-medium">Branch Locations Map</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">Total Showing</p>
                        <p className="text-2xl font-extrabold text-white">
                          {selectedBranchCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="h-[600px] bg-gray-100">
                <BranchMap selectedBank={selectedBank} />
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 glass rounded-2xl shadow-xl p-6 border border-white/30 animate-fadeIn">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                  <Target className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Map Legend
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100 hover-lift">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 border-2 border-white shadow-lg flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Bank of Baku</p>
                    <p className="text-xs text-gray-600">Primary focus</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover-lift">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border border-white shadow flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Other Banks</p>
                    <p className="text-xs text-gray-600">Competitors</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover-lift">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Interactive</p>
                    <p className="text-xs text-gray-600">Click markers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 glass rounded-2xl shadow-xl p-8 border border-white/30 animate-fadeIn">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                About This Dashboard
              </h4>
              <p className="text-base text-gray-700 leading-relaxed">
                This interactive dashboard visualizes the distribution of <span className="font-bold text-blue-600">{totalBranches} bank branches</span> across <span className="font-bold text-purple-600">{totalBanks} banks</span> operating in Azerbaijan. The map highlights Bank of Baku's network of <span className="font-bold text-red-600">{bobBranches} branches</span> (ranked <span className="font-bold text-orange-600">#{bobRank}</span> with <span className="font-bold text-green-600">{marketShare}% market share</span>). Use the bank selector to filter and explore individual bank networks, or view all branches together to analyze competitive density and market coverage across the country.
              </p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {totalBanks}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-1">Total Banks</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {totalBranches}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-1">Branches</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    #{bobRank}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-1">BoB Rank</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {marketShare}%
                  </div>
                  <div className="text-xs text-gray-600 font-semibold mt-1">Market Share</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg shadow-lg">
                <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Azerbaijan Bank Network Dashboard
              </h3>
            </div>
            <p className="text-sm text-gray-400 font-medium mb-2">
              Interactive Banking Analytics & Geographic Intelligence
            </p>
            <p className="text-xs text-gray-500">
              © 2025 Azerbaijan Bank Branch Network Dashboard | Data updated: December 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
