'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('SW registered:', registration))
        .catch((error) => console.log('SW registration failed:', error));
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-75 blur-lg animate-pulse"></div>

        {/* Card */}
        <div className="relative glass rounded-2xl shadow-2xl p-6 border border-white/30 max-w-sm">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 animate-bounce">
                <Smartphone className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Install Our App!
              </h3>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                Access the dashboard instantly from your home screen. Works offline!
              </p>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Lightning fast access</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Download className="w-4 h-4 text-green-500" />
                  <span>Works offline</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  <span>Just like a native app</span>
                </div>
              </div>

              <button
                onClick={handleInstall}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" strokeWidth={2.5} />
                  <span>Install Now</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
