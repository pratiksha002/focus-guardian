import React from 'react';
import { Card } from '../ui/Card';

const getStatusColor = (status) => {
  switch (status) {
    case 'focused': return 'green';
    case 'drowsy': return 'yellow';
    case 'distracted': return 'red';
    default: return 'gray';
  }
};

export const ActivityLog = ({ history }) => {
  return (
    <Card>
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No activity yet</p>
        ) : (
          history.slice().reverse().map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full bg-${getStatusColor(item.status)}-500`} />
                <span className="text-white capitalize">{item.status}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{item.score}%</div>
                <div className="text-xs text-gray-400">{item.timestamp}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};