'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, MapPin, Award, X } from 'lucide-react';

interface FunFactsProps {
  totalBranches: number;
  totalBanks: number;
  atbBranches: number;
  atbRank: number;
  marketShare: string;
}

export default function FunFacts({ totalBranches, totalBanks, atbBranches, atbRank, marketShare }: FunFactsProps) {
  const [showFact, setShowFact] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const facts = [
    {
      icon: MapPin,
      title: "Did you know?",
      text: `There are ${totalBranches} bank branches across Azerbaijan - that's about 1 branch for every 17,000 people!`,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Market Insight",
      text: `AzerTurk Bank holds ${marketShare}% market share with ${atbBranches} branches. There's room for 37 more branches to reach 10% share!`,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Competition",
      text: `The top 3 banks control over 50% of all branches. AzerTurk Bank is ranked #${atbRank} and growing!`,
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Lightbulb,
      title: "Fun Fact",
      text: `If you visited one bank branch per day, it would take you ${Math.ceil(totalBranches / 365)} years to visit them all!`,
      color: "from-green-500 to-emerald-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [facts.length]);

  if (!showFact) return null;

  const currentFact = facts[currentFactIndex];
  const Icon = currentFact.icon;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-md animate-fadeIn">
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${currentFact.color} rounded-2xl opacity-50 blur-lg`}></div>

        {/* Card */}
        <div className="relative glass rounded-2xl shadow-2xl p-5 border border-white/30">
          {/* Close button */}
          <button
            onClick={() => setShowFact(false)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 p-3 bg-gradient-to-br ${currentFact.color} rounded-xl shadow-lg`}>
              <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>

            <div className="flex-1 pr-6">
              <h4 className={`text-sm font-bold bg-gradient-to-r ${currentFact.color} bg-clip-text text-transparent mb-1`}>
                {currentFact.title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentFact.text}
              </p>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            {facts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFactIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentFactIndex
                    ? `w-8 bg-gradient-to-r ${currentFact.color}`
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
