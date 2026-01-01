import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export const StatCard = ({ title, value, icon: Icon, color, change }) => {
  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {change && (
          <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 dark:text-gray-300 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-black text-white">{value}</p>
    </Card>
  );
};