import React from 'react';
import InteractiveCard3D from './InteractiveCard3D';

const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  return (
    <InteractiveCard3D
      className="stat-card cursor-pointer"
      maxTilt={8}
      scaleOnHover={1.02}
      perspective={1000}
      shadowIntensity={0.2}
    >
      <div className={`inline-flex p-3 rounded-lg ${bgColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {value.toLocaleString()}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {title}
      </p>
    </InteractiveCard3D>
  );
};

export default StatsCard;
