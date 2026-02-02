'use client';

import { Building2, MapPin, BarChart3, Code, Database, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            About This Project
          </h1>
          <p className="text-xl text-white/90">
            Understanding Azerbaijan's banking landscape through data
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Overview */}
        <section className="mb-12">
          <div className="glass rounded-2xl p-8 border border-white/30">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Project Overview
            </h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                The <strong className="text-purple-600">Azerbaijan Bank Branch Network Dashboard</strong> is a comprehensive data visualization and analysis platform that provides insights into the banking infrastructure across Azerbaijan.
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                This project analyzes <strong className="text-blue-600">585 bank branches</strong> across <strong className="text-green-600">20 banking institutions</strong>, with a special focus on <strong className="text-red-600">AzerTurk Bank</strong> and its competitive positioning in the market.
              </p>

              <p className="text-gray-700 leading-relaxed">
                The dashboard combines interactive mapping, statistical analysis, and strategic insights to help understand branch distribution, market concentration, and growth opportunities in Azerbaijan's banking sector.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 border border-white/30 hover-lift">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-4 inline-block">
                <MapPin className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600">
                Explore all 585 bank branches on an interactive Leaflet map with filtering by bank, custom markers, and geographic visualization.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 hover-lift">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4 inline-block">
                <BarChart3 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Detailed analysis of market share, competitive landscape, branch distribution, and strategic growth opportunities.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 hover-lift">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4 inline-block">
                <Building2 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bank Focus</h3>
              <p className="text-gray-600">
                Special emphasis on AzerTurk Bank's network, ranking, market position, and expansion potential across Azerbaijan.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Technology Stack
          </h2>

          <div className="glass rounded-2xl p-8 border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Frontend */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow">
                    <Code className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Frontend</h3>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Next.js 16</strong> - React framework with App Router</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>React 19</strong> - UI component library</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>TypeScript</strong> - Type-safe development</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Tailwind CSS v4</strong> - Utility-first styling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>React Leaflet</strong> - Interactive maps</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Lucide React</strong> - Modern icon library</span>
                  </li>
                </ul>
              </div>

              {/* Backend & Data */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow">
                    <Database className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Data & Analysis</h3>
                </div>

                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Python</strong> - Data scraping and analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Pandas</strong> - Data manipulation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>Matplotlib</strong> - Chart generation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>BeautifulSoup</strong> - Web scraping</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700"><strong>GeoPandas</strong> - Geographic data analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PWA Features */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Progressive Web App
            </h2>
          </div>

          <div className="glass rounded-2xl p-8 border border-white/30">
            <p className="text-gray-700 mb-6">
              This dashboard is a fully-featured <strong>Progressive Web App (PWA)</strong> that can be installed on any device and works offline.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-blue-600 mb-1">📱 Installable</p>
                <p className="text-sm text-gray-600">Works like a native app on mobile and desktop</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <p className="font-bold text-purple-600 mb-1">⚡ Fast</p>
                <p className="text-sm text-gray-600">Optimized performance with service worker caching</p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="font-bold text-green-600 mb-1">📥 Offline</p>
                <p className="text-sm text-gray-600">Access data even without internet connection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            Data Sources
          </h2>

          <div className="glass rounded-2xl p-8 border border-white/30">
            <p className="text-gray-700 mb-4">
              Branch location data was collected through automated web scraping from official bank websites across all 20 banks operating in Azerbaijan.
            </p>

            <p className="text-gray-700">
              Data includes geographic coordinates (latitude/longitude), bank names, and branch counts. All data is aggregated and analyzed to provide market insights while respecting data privacy and terms of service.
            </p>
          </div>
        </section>

        {/* Project Stats */}
        <section>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Project Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-2xl p-6 border border-white/30 text-center">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                585
              </p>
              <p className="text-sm text-gray-600 font-semibold">Total Branches</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 text-center">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                20
              </p>
              <p className="text-sm text-gray-600 font-semibold">Banks Analyzed</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 text-center">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                15
              </p>
              <p className="text-sm text-gray-600 font-semibold">Analysis Charts</p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/30 text-center">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                4
              </p>
              <p className="text-sm text-gray-600 font-semibold">Dashboard Pages</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
