import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon, trend, trendValue, subtitle }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1">
          {trend === 'down' ? (
            <TrendingDown className="text-green-500" size={16} />
          ) : (
            <TrendingUp className="text-red-500" size={16} />
          )}
          <span className={`text-sm font-medium ${
            trend === 'down' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500">
            {trend === 'down' ? 'savings' : 'increase'}
          </span>
        </div>
      )}
      
      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

export default StatsCard;
