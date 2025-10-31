import React, { useState, useEffect } from 'react';

const SafetyHistory = ({ cylinderId, isDemo = false }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(!isDemo);

  // Demo alerts data
  const demoAlerts = [
    {
      id: '1',
      cylinderId: 'GW-CYL-67890',
      type: 'low_gas',
      severity: 'medium',
      message: 'Gas level is getting low. Consider ordering a refill soon.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: '2',
      cylinderId: 'GW-CYL-67890',
      type: 'maintenance',
      severity: 'low',
      message: 'Regular maintenance check due in 15 days.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: '3',
      cylinderId: 'GW-CYL-67890',
      type: 'safety_check',
      severity: 'low',
      message: 'Monthly safety check completed successfully.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      resolved: true
    }
  ];

  useEffect(() => {
    if (isDemo) {
      setAlerts(demoAlerts);
      setLoading(false);
      return;
    }

    // Real implementation would fetch from Firebase
    const timer = setTimeout(() => {
      setAlerts([]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cylinderId, isDemo]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Safety History</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Safety History</h2>
        {isDemo && (
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            Demo Data
          </span>
        )}
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No safety alerts recorded</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{alert.message}</p>
                  <p className="text-sm opacity-75 mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  alert.severity === 'critical' ? 'bg-red-200' :
                  alert.severity === 'high' ? 'bg-orange-200' :
                  alert.severity === 'medium' ? 'bg-yellow-200' : 'bg-blue-200'
                }`}>
                  {alert.severity}
                </span>
              </div>
              {!alert.resolved && (
                <div className="mt-2 flex justify-between items-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Active
                  </span>
                  {isDemo && (
                    <span className="text-xs text-gray-500">Demo Alert</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SafetyHistory;