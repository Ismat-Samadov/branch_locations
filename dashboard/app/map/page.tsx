'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import BankSelector from '@/components/BankSelector';

// Dynamically import the map to avoid SSR issues with Leaflet
const BranchMap = dynamic(() => import('@/components/BranchMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-4 animate-pulse">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p className="text-xl font-semibold text-gray-700">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [selectedBank, setSelectedBank] = useState<string | null>('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Interactive Branch Map
          </h1>
          <p className="text-xl text-white/90">
            Explore all bank branch locations across Azerbaijan
          </p>
        </div>
      </div>

      {/* Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bank Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BankSelector selectedBank={selectedBank} onSelectBank={setSelectedBank} />
            </div>
          </div>

          {/* Full-Screen Map */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedBank && selectedBank !== 'all' ? selectedBank : 'All Banks'}
                  </h2>
                  {selectedBank && selectedBank !== 'all' && (
                    <button
                      onClick={() => setSelectedBank('all')}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold"
                    >
                      Show All Banks
                    </button>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="h-[calc(100vh-300px)] min-h-[600px] bg-gray-100">
                <BranchMap selectedBank={selectedBank} />
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-6 glass rounded-2xl shadow-xl p-6 border border-white/30">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                Map Legend
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 border-2 border-white shadow-lg flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Bank of Baku</p>
                    <p className="text-xs text-gray-600">Primary focus</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border border-white shadow flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Other Banks</p>
                    <p className="text-xs text-gray-600">Competitors</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                  <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Interactive</p>
                    <p className="text-xs text-gray-600">Click markers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
