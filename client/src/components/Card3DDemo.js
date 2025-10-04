import React from 'react';
import InteractiveCard3D from './InteractiveCard3D';
import { Star, Zap, Heart, Award } from 'lucide-react';

const Card3DDemo = () => {
  const demoCards = [
    {
      title: "Standard 3D Card",
      description: "Default settings with smooth mouse tracking",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      settings: { maxTilt: 15, scaleOnHover: 1.05, perspective: 1000 }
    },
    {
      title: "Subtle 3D Card",
      description: "Gentle tilt with minimal scale effect",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      settings: { maxTilt: 8, scaleOnHover: 1.02, perspective: 800 }
    },
    {
      title: "Dramatic 3D Card",
      description: "Strong tilt with enhanced shadow effects",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      settings: { maxTilt: 20, scaleOnHover: 1.08, perspective: 1200, shadowIntensity: 0.4 }
    },
    {
      title: "Performance 3D Card",
      description: "Optimized for smooth animations",
      icon: Award,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      settings: { maxTilt: 12, scaleOnHover: 1.04, perspective: 1000, resetDuration: 400 }
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Interactive 3D Cards Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Move your mouse over each card to see different 3D effects. Each card demonstrates 
          various tilt, scale, and shadow configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {demoCards.map((card, index) => (
          <InteractiveCard3D
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
            {...card.settings}
          >
            <div className="text-center">
              <div className={`inline-flex p-4 rounded-full ${card.bgColor} mb-4`}>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {card.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {card.description}
              </p>
              
              <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <div>Max Tilt: {card.settings.maxTilt}°</div>
                <div>Scale: {card.settings.scaleOnHover}x</div>
                <div>Perspective: {card.settings.perspective}px</div>
              </div>
            </div>
          </InteractiveCard3D>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Features:
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
          <li>✓ Real-time mouse tracking for X/Y rotation</li>
          <li>✓ Smooth transitions and reset animations</li>
          <li>✓ Configurable tilt, scale, and shadow effects</li>
          <li>✓ Responsive design with touch device support</li>
          <li>✓ Dark/light theme compatibility</li>
          <li>✓ Reduced motion accessibility support</li>
          <li>✓ Hardware-accelerated transforms</li>
          <li>✓ Perspective-based 3D depth</li>
        </ul>
      </div>
    </div>
  );
};

export default Card3DDemo;
