import React, { useState, useEffect } from 'react';
import GasMonitor from './GasMonitor';
import EmergencyShutdown from './EmergencyShutdown';
import SafetyHistory from './SafetyHistory';
import SafetyTips from './SafetyTips';

const SafetyDashboard = () => {
  const [cylinder, setCylinder] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cylinderId, setCylinderId] = useState('');

  // Demo cylinder data - multiple options for testing
  const demoCylinders = {
    'GW-CYL-1001': {
      cylinderId: 'GW-CYL-1001',
      currentLevel: 85,
      status: 'active',
      location: 'Kitchen',
      isValveOpen: true,
      lastReading: new Date(),
      lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
    },
    'GW-CYL-1002': {
      cylinderId: 'GW-CYL-1002',
      currentLevel: 25,
      status: 'warning',
      location: 'Restaurant',
      isValveOpen: true,
      lastReading: new Date(),
      lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
    },
    'GW-CYL-1003': {
      cylinderId: 'GW-CYL-1003',
      currentLevel: 10,
      status: 'critical',
      location: 'Hotel',
      isValveOpen: false,
      lastReading: new Date(),
      lastMaintenance: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
    },
    'GW-CYL-1004': {
      cylinderId: 'GW-CYL-1004',
      currentLevel: 95,
      status: 'active',
      location: 'Home',
      isValveOpen: true,
      lastReading: new Date(),
      lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    }
  };

  // Demo alerts data
  const demoAlerts = {
    'GW-CYL-1001': [
      {
        id: '1',
        type: 'maintenance',
        severity: 'low',
        message: 'Maintenance check due in 15 days',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: false
      }
    ],
    'GW-CYL-1002': [
      {
        id: '1',
        type: 'low_gas',
        severity: 'medium',
        message: 'Gas level low - Please schedule refill',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        resolved: false
      },
      {
        id: '2',
        type: 'maintenance',
        severity: 'high',
        message: 'OVERDUE: Maintenance check required',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        resolved: false
      }
    ],
    'GW-CYL-1003': [
      {
        id: '1',
        type: 'low_gas',
        severity: 'critical',
        message: 'CRITICAL: Gas level very low - Immediate refill needed',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false
      },
      {
        id: '2',
        type: 'maintenance',
        severity: 'critical',
        message: 'URGENT: Maintenance overdue by 30 days',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        resolved: false
      }
    ],
    'GW-CYL-1004': [
      {
        id: '1',
        type: 'safety_check',
        severity: 'low',
        message: 'All systems operating normally',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        resolved: true
      }
    ]
  };

  const handleCylinderLogin = (e) => {
    e.preventDefault();
    if (!cylinderId.trim()) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const cylinderData = demoCylinders[cylinderId.toUpperCase()];
      if (cylinderData) {
        setCylinder(cylinderData);
        const alerts = demoAlerts[cylinderId.toUpperCase()] || [];
        setCurrentAlert(alerts.find(alert => !alert.resolved) || null);
      } else {
        alert('Cylinder ID not found. Try: GW-CYL-1001, GW-CYL-1002, GW-CYL-1003, or GW-CYL-1004');
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setCylinder(null);
    setCurrentAlert(null);
    setCylinderId('');
  };

  const handleQuickLogin = (quickCylinderId) => {
    setCylinderId(quickCylinderId);
    const cylinderData = demoCylinders[quickCylinderId];
    if (cylinderData) {
      setCylinder(cylinderData);
      const alerts = demoAlerts[quickCylinderId] || [];
      setCurrentAlert(alerts.find(alert => !alert.resolved) || null);
    }
  };

  // Show login form if no cylinder
  if (!cylinder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">KijaniGuard</h1>
            <p className="text-gray-600 mb-8">LPG Cylinder Safety Monitor</p>
          </div>

          <form onSubmit={handleCylinderLogin} className="space-y-6">
            <div>
              <label htmlFor="cylinderId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Cylinder ID
              </label>
              <input
                id="cylinderId"
                name="cylinderId"
                type="text"
                required
                value={cylinderId}
                onChange={(e) => setCylinderId(e.target.value)}
                placeholder="e.g., GW-CYL-1001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center text-lg font-mono"
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                Find this ID on your cylinder sticker
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !cylinderId.trim()}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Accessing Dashboard...
                </>
              ) : (
                'Access Safety Dashboard'
              )}
            </button>
          </form>

          {/* Quick Demo Buttons */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 text-center mb-4">Quick Demo - Try these IDs:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('GW-CYL-1001')}
                className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-semibold"
              >
                🟢 GW-CYL-1001<br/><span className="text-xs font-normal">Good Condition</span>
              </button>
              <button
                onClick={() => handleQuickLogin('GW-CYL-1002')}
                className="p-3 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-semibold"
              >
                🟡 GW-CYL-1002<br/><span className="text-xs font-normal">Needs Attention</span>
              </button>
              <button
                onClick={() => handleQuickLogin('GW-CYL-1003')}
                className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
              >
                🔴 GW-CYL-1003<br/><span className="text-xs font-normal">Critical</span>
              </button>
              <button
                onClick={() => handleQuickLogin('GW-CYL-1004')}
                className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold"
              >
                🔵 GW-CYL-1004<br/><span className="text-xs font-normal">Excellent</span>
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Demo Features:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Real-time gas level monitoring</li>
              <li>• Emergency shutdown simulation</li>
              <li>• Safety alerts and history</li>
              <li>• Live status updates</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-green-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-white text-green-600 rounded-full p-1 mr-2">🛡️</span>
            <span className="font-semibold">KijaniGuard Demo Mode</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Monitoring: <strong>{cylinder.cylinderId}</strong></span>
            <button 
              onClick={handleLogout}
              className="bg-white text-green-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Switch Cylinder
            </button>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Safety Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring for your LPG cylinder</p>
          </div>

          {/* Alert Banner */}
          {currentAlert && (
            <div className={`mb-6 p-4 rounded-lg border ${
              currentAlert.severity === 'critical' 
                ? 'bg-red-50 border-red-200 text-red-800'
                : currentAlert.severity === 'high'
                ? 'bg-orange-50 border-orange-200 text-orange-800'
                : currentAlert.severity === 'medium'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{currentAlert.message}</h3>
                    <p className="text-xs opacity-75 mt-1">
                      {currentAlert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentAlert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                  currentAlert.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                  currentAlert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' : 
                  'bg-blue-200 text-blue-800'
                }`}>
                  {currentAlert.severity.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Monitoring */}
            <div className="lg:col-span-2 space-y-6">
              <GasMonitor cylinder={cylinder} isDemo={true} />
              <SafetyHistory cylinderId={cylinder.cylinderId} isDemo={true} />
            </div>

            {/* Right Column - Controls & Info */}
            <div className="space-y-6">
              <EmergencyShutdown cylinder={cylinder} isDemo={true} />
              <SafetyTips />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyDashboard;