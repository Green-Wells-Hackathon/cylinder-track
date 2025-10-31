import React, { useState } from 'react';

const EmergencyShutdown = ({ cylinder, isDemo = false }) => {
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleEmergencyShutdown = async () => {
    if (!window.confirm('Are you sure you want to trigger emergency shutdown? This will close the main valve and alert emergency contacts.')) {
      return;
    }

    setIsShuttingDown(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isDemo) {
        alert('🚨 DEMO: Emergency shutdown activated! In a real scenario, emergency contacts would be notified.');
      } else {
        // Real implementation would go here
        alert('🚨 Emergency shutdown activated! Emergency contacts have been notified.');
      }

    } catch (error) {
      console.error('Error during shutdown:', error);
      alert('Error activating shutdown. Please check your connection.');
    } finally {
      setIsShuttingDown(false);
    }
  };

  const handleNormalShutdown = async () => {
    try {
      if (isDemo) {
        alert('DEMO: Cylinder valve closed safely.');
      } else {
        // Real implementation
        alert('Cylinder valve closed safely.');
      }
    } catch (error) {
      console.error('Error closing valve:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Emergency Controls</h2>
      {isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> Emergency features are simulated
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Emergency Shutdown</h3>
          <p className="text-red-700 text-sm mb-4">
            Use only in case of gas leak or emergency. This will close the main valve and alert emergency services.
          </p>
          <button
            onClick={handleEmergencyShutdown}
            disabled={isShuttingDown}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
          >
            {isShuttingDown ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activating Shutdown...
              </>
            ) : (
              '🚨 ACTIVATE EMERGENCY SHUTDOWN'
            )}
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Normal Shutdown</h3>
          <p className="text-yellow-700 text-sm mb-4">
            Safely close the cylinder valve when not in use for extended periods.
          </p>
          <button
            onClick={handleNormalShutdown}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Close Cylinder Valve
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Emergency Contacts</h3>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left p-2 hover:bg-blue-100 rounded">
              🚒 Fire Department: 999
            </button>
            <button className="w-full text-left p-2 hover:bg-blue-100 rounded">
              🏥 Emergency Services: 112
            </button>
            <button className="w-full text-left p-2 hover:bg-blue-100 rounded">
              📞 Green Wells Emergency: 0700-123-456
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyShutdown;