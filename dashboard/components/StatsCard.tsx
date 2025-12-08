import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-400',
      textGradient: 'from-blue-600 to-cyan-600'
    },
    red: {
      gradient: 'from-red-500 to-pink-500',
      shadow: 'shadow-red-500/20',
      iconBg: 'bg-gradient-to-br from-red-400 to-pink-400',
      textGradient: 'from-red-600 to-pink-600'
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-green-500/20',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-400',
      textGradient: 'from-green-600 to-emerald-600'
    },
    yellow: {
      gradient: 'from-yellow-500 to-orange-500',
      shadow: 'shadow-yellow-500/20',
      iconBg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
      textGradient: 'from-yellow-600 to-orange-600'
    },
    purple: {
      gradient: 'from-purple-500 to-indigo-500',
      shadow: 'shadow-purple-500/20',
      iconBg: 'bg-gradient-to-br from-purple-400 to-indigo-400',
      textGradient: 'from-purple-600 to-indigo-600'
    },
  };

  const theme = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="group relative animate-fadeIn">
      {/* Gradient border effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${theme.gradient} rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-300`}></div>

      {/* Card content */}
      <div className="relative bg-white rounded-2xl shadow-xl hover-lift p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
            <p className={`text-4xl font-extrabold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-1`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-600 font-medium mt-2 flex items-center">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mr-2"></span>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${theme.iconBg} shadow-lg ${theme.shadow} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Decorative element */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    </div>
  );
}
