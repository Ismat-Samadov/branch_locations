'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import Image from 'next/image';

interface Branch {
  bank_name: string;
  lat: number;
  long: number;
}

export default function AnalyticsPage() {
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
  const bankCounts: { [key: string]: number } = {};
  branches.forEach((branch) => {
    bankCounts[branch.bank_name] = (bankCounts[branch.bank_name] || 0) + 1;
  });
  const sortedBanks = Object.entries(bankCounts).sort((a, b) => b[1] - a[1]);
  const top5Banks = sortedBanks.slice(0, 5);

  const totalBranches = branches.length;
  const bobBranches = branches.filter((b) => b.bank_name === 'Bank of Baku').length;
  const bobRank = sortedBanks.findIndex(([bank]) => bank === 'Bank of Baku') + 1;
  const marketShare = totalBranches > 0 ? ((bobBranches / totalBranches) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4 animate-pulse">
            <BarChart3 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Analytics & Insights
          </h1>
          <p className="text-xl text-white/90">
            Detailed analysis of Azerbaijan's banking network
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top 5 Banks Ranking */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Top 5 Banks by Branch Count
            </h2>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/30">
            <div className="space-y-4">
              {top5Banks.map(([bank, count], index) => {
                const percentage = ((count / totalBranches) * 100).toFixed(1);
                const isBankOfBaku = bank === 'Bank of Baku';

                return (
                  <div key={bank} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                          index === 2 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                          isBankOfBaku ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                          'bg-gradient-to-br from-blue-500 to-cyan-500'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <p className={`font-bold text-lg ${isBankOfBaku ? 'text-red-600' : 'text-gray-900'}`}>
                            {bank}
                          </p>
                          <p className="text-sm text-gray-600">{count} branches • {percentage}% share</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {count}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBankOfBaku
                            ? 'bg-gradient-to-r from-red-500 to-pink-500'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bank of Baku Insights */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl shadow-lg">
              <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Bank of Baku Performance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 border border-white/30 bg-gradient-to-br from-red-50 to-pink-50">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Current Rank</p>
                <p className="text-5xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  #{bobRank}
                </p>
                <p className="text-sm text-gray-600">Out of {sortedBanks.length} banks</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Branches</p>
                <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                  {bobBranches}
                </p>
                <p className="text-sm text-gray-600">Physical locations</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Market Share</p>
                <p className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {marketShare}%
                </p>
                <p className="text-sm text-gray-600">Of total market</p>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Opportunities */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Growth Opportunities
            </h2>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Potential Expansion</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">To reach 5% market share</p>
                    <p className="text-2xl font-extrabold text-blue-600">
                      +{Math.ceil((totalBranches * 0.05) - bobBranches)} branches needed
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-1">To reach 10% market share</p>
                    <p className="text-2xl font-extrabold text-purple-600">
                      +{Math.ceil((totalBranches * 0.10) - bobBranches)} branches needed
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-sm text-gray-600 mb-1">To reach Top 5 position</p>
                    <p className="text-2xl font-extrabold text-green-600">
                      +{Math.max(0, top5Banks[4][1] - bobBranches + 1)} branches needed
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Market Insights</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-sm text-gray-600 mb-1">Market Leader</p>
                    <p className="text-lg font-bold text-orange-600">{sortedBanks[0][0]}</p>
                    <p className="text-sm text-gray-600">{sortedBanks[0][1]} branches • {((sortedBanks[0][1] / totalBranches) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                    <p className="text-sm text-gray-600 mb-1">Average per Bank</p>
                    <p className="text-lg font-bold text-pink-600">{Math.round(totalBranches / sortedBanks.length)} branches</p>
                    <p className="text-sm text-gray-600">Across {sortedBanks.length} banks</p>
                  </div>
                  <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                    <p className="text-sm text-gray-600 mb-1">Top 3 Market Control</p>
                    <p className="text-lg font-bold text-cyan-600">
                      {((sortedBanks.slice(0, 3).reduce((sum, [, count]) => sum + count, 0) / totalBranches) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">Of total market</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section - Link to Python generated charts */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Detailed Analysis Charts
            </h2>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/30">
            <p className="text-gray-600 text-center mb-6">
              Comprehensive analysis charts with market share, regional distribution, competitive landscape, and strategic insights are available in the <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">/charts</code> directory.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                <p className="font-bold text-blue-600 mb-1">Chart 1-5</p>
                <p className="text-sm text-gray-600">Market Share & Distribution</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
                <p className="font-bold text-purple-600 mb-1">Chart 6-10</p>
                <p className="text-sm text-gray-600">Competitive Analysis</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                <p className="font-bold text-green-600 mb-1">Chart 11-15</p>
                <p className="text-sm text-gray-600">Strategic Opportunities</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
