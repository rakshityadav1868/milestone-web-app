import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <div className="stat-card">
      <div className={`inline-flex p-3 rounded-lg ${bgColor} mb-3`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-sm text-gray-600">
        {title}
      </p>
    </div>
  );
};

export default StatsCard;
