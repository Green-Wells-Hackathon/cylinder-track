import React, { useState, useEffect } from 'react';

const GasMonitor = ({ cylinder, isDemo = false }) => {
  const [realTimeData, setRealTimeData] = useState(cylinder);

  // Simulate real-time data updates in demo mode
  useEffect(() => {
    if (!isDemo) return;

    const interval = setInterval(() => {
      // Simulate small fluctuations in gas level
      const fluctuation = Math.random() * 2 - 1; // -1 to +1
      const newLevel = Math.max(0, Math.min(100, realTimeData.currentLevel + fluctuation));
      
      setRealTimeData(prev => ({
        ...prev,
        currentLevel: Math.round(newLevel * 10) / 10,
        lastReading: new Date()
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isDemo, realTimeData?.currentLevel]);

  const getStatusColor = (level) => {
    if (level > 70) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    if (level > 15) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusMessage = (level) => {
    if (level > 70) return 'Good';
    if (level > 30) return 'Moderate';
    if (level > 15) return 'Low';
    return 'Critical - Order Refill';
  };

  if (!realTimeData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gas Level Monitor</h2>
        <div className="text-center text-gray-500 py-8">
          No cylinder data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Gas Level Monitor</h2>
        {isDemo && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Live Demo
          </span>
        )}
      </div>
      
      {/* Gas Gauge */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
            <div 
              className="absolute inset-4 bg-green-500 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                clipPath: `inset(${100 - realTimeData.currentLevel}% 0 0 0)`,
              }}
            ></div>
            <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
              <span className={`text-3xl font-bold ${getStatusColor(realTimeData.currentLevel)}`}>
                {Math.round(realTimeData.currentLevel)}%
              </span>
            </div>
          </div>
        </div>
        <p className={`mt-4 text-lg font-semibold ${getStatusColor(realTimeData.currentLevel)}`}>
          {getStatusMessage(realTimeData.currentLevel)}
        </p>
        {isDemo && (
          <p className="text-sm text-gray-500 mt-2">Simulated data - updates every 5 seconds</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Cylinder Status</p>
          <p className="text-lg font-semibold capitalize">{realTimeData.status}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Valve Position</p>
          <p className="text-lg font-semibold">
            {realTimeData.isValveOpen ? 'Open' : 'Closed'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Location</p>
          <p className="text-lg font-semibold">{realTimeData.location}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Last Updated</p>
          <p className="text-lg font-semibold">
            {realTimeData.lastReading?.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex space-x-4">
        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
          Order Refill
        </button>
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Run Safety Check
        </button>
      </div>
    </div>
  );
};

export default GasMonitor;