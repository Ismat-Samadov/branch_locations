'use client';

import { useEffect, useState } from 'react';
import { Building2, TrendingUp, Search } from 'lucide-react';

interface Branch {
  bank_name: string;
  lat: number;
  long: number;
}

interface BankSelectorProps {
  selectedBank: string | null;
  onSelectBank: (bank: string | null) => void;
}

export default function BankSelector({ selectedBank, onSelectBank }: BankSelectorProps) {
  const [bankCounts, setBankCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/branches.json')
      .then((res) => res.json())
      .then((data: Branch[]) => {
        const counts: { [key: string]: number } = {};
        data.forEach((branch) => {
          counts[branch.bank_name] = (counts[branch.bank_name] || 0) + 1;
        });
        setBankCounts(counts);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="glass rounded-2xl shadow-xl p-8 border border-white/30">
        <div className="shimmer h-8 rounded-lg mb-4"></div>
        <div className="space-y-3">
          <div className="shimmer h-12 rounded-xl"></div>
          <div className="shimmer h-12 rounded-xl"></div>
          <div className="shimmer h-12 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Sort banks by branch count (descending)
  const sortedBanks = Object.entries(bankCounts).sort((a, b) => b[1] - a[1]);

  // Filter banks based on search
  const filteredBanks = sortedBanks.filter(([bank]) =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBranches = Object.values(bankCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="glass rounded-2xl shadow-xl p-6 border border-white/30 animate-fadeIn sticky top-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/30">
            <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Filter Banks
          </h3>
        </div>
        <p className="text-xs text-gray-500 font-medium">Select a bank to view branches</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search banks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
        />
      </div>

      {/* Bank List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {/* All Banks Option */}
        <button
          onClick={() => onSelectBank('all')}
          className={`group w-full text-left px-4 py-3.5 rounded-xl transition-all duration-300 ${
            selectedBank === 'all' || selectedBank === null
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-gray-700 border border-gray-200 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-4 h-4 ${
                selectedBank === 'all' || selectedBank === null ? 'text-white' : 'text-purple-500'
              }`} />
              <span className="font-bold">All Banks</span>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
              selectedBank === 'all' || selectedBank === null
                ? 'bg-white/20 text-white'
                : 'bg-purple-50 text-purple-700 group-hover:bg-purple-100'
            }`}>
              {totalBranches}
            </span>
          </div>
        </button>

        {/* Individual Banks */}
        {filteredBanks.map(([bank, count], index) => {
          const isSelected = selectedBank === bank;
          const isAzerTurkBank = bank === 'AzerTurk Bank';
          const rank = sortedBanks.findIndex(([b]) => b === bank) + 1;

          return (
            <button
              key={bank}
              onClick={() => onSelectBank(bank)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`group w-full text-left px-4 py-3 rounded-xl transition-all duration-300 animate-slideIn ${
                isSelected
                  ? isAzerTurkBank
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-100 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                  }`}>
                    #{rank}
                  </span>
                  <span className="text-sm font-semibold">{bank}</span>
                </div>
                {isAzerTurkBank && !isSelected && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                    Focus
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${
                  isSelected ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {count} branches
                </span>
                <span className={`text-xs font-semibold ${
                  isSelected ? 'text-white/90' : 'text-gray-600'
                }`}>
                  {((count / totalBranches) * 100).toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}

        {filteredBanks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No banks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
