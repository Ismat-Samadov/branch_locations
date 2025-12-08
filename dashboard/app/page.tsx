'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import FunFacts from '@/components/FunFacts';
import { Building2, MapPin, TrendingUp, Layers, ArrowRight, Map, BarChart3 } from 'lucide-react';

interface Branch {
  bank_name: string;
  lat: number;
  long: number;
}

export default function Home() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-4 animate-pulse">
            <Building2 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-fadeIn">
            Azerbaijan Bank Network
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fadeIn">
            Interactive dashboard analyzing <span className="font-bold">{totalBranches} branches</span> across{' '}
            <span className="font-bold">{totalBanks} banks</span> in Azerbaijan
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
            <Link
              href="/map"
              className="group flex items-center space-x-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Map className="w-5 h-5" strokeWidth={2.5} />
              <span>Explore Map</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>

            <Link
              href="/analytics"
              className="group flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5" strokeWidth={2.5} />
              <span>View Analytics</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Branches"
            value={totalBranches}
            subtitle={`Across ${totalBanks} banks`}
            icon={MapPin}
            color="blue"
            tooltip="Total number of bank branches across all banks operating in Azerbaijan"
          />
          <StatsCard
            title="Bank of Baku"
            value={bobBranches}
            subtitle={`Rank #${bobRank} in market`}
            icon={Building2}
            color="red"
            tooltip={`Bank of Baku has ${bobBranches} branches and is ranked #${bobRank} among ${totalBanks} banks`}
          />
          <StatsCard
            title="Market Share"
            value={`${marketShare}%`}
            subtitle="Bank of Baku coverage"
            icon={TrendingUp}
            color="green"
            tooltip={`Bank of Baku controls ${marketShare}% of all bank branches in Azerbaijan`}
          />
          <StatsCard
            title="Banks"
            value={totalBanks}
            subtitle="Operating in Azerbaijan"
            icon={Layers}
            color="purple"
            tooltip="Number of different banking institutions with physical branch presence in Azerbaijan"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map Card */}
          <Link
            href="/map"
            className="group glass rounded-2xl p-8 border border-white/30 hover-lift"
          >
            <div className="flex items-start space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Map className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Interactive Map
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore all {totalBranches} bank branches on an interactive map. Filter by bank, view locations, and analyze geographic distribution.
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Open Map</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics Card */}
          <Link
            href="/analytics"
            className="group glass rounded-2xl p-8 border border-white/30 hover-lift"
          >
            <div className="flex items-start space-x-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Analytics & Insights
                </h3>
                <p className="text-gray-600 mb-4">
                  View detailed charts and analysis of market share, branch distribution, competitive landscape, and growth opportunities.
                </p>
                <div className="flex items-center text-purple-600 font-semibold">
                  <span>View Analytics</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Bank of Baku Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass rounded-2xl p-8 border border-white/30 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg">
                <Building2 className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Bank of Baku</h3>
                <p className="text-gray-600">Primary focus of this analysis</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 text-center">
              <div className="px-6 py-3 bg-white rounded-xl shadow">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {bobBranches}
                </div>
                <div className="text-sm text-gray-600 font-semibold">Branches</div>
              </div>

              <div className="px-6 py-3 bg-white rounded-xl shadow">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  #{bobRank}
                </div>
                <div className="text-sm text-gray-600 font-semibold">Rank</div>
              </div>

              <div className="px-6 py-3 bg-white rounded-xl shadow">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {marketShare}%
                </div>
                <div className="text-sm text-gray-600 font-semibold">Market Share</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      {!loading && totalBranches > 0 && (
        <FunFacts
          totalBranches={totalBranches}
          totalBanks={totalBanks}
          bobBranches={bobBranches}
          bobRank={bobRank}
          marketShare={marketShare}
        />
      )}
    </main>
  );
}
