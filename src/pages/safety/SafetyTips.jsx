import React from 'react';

const SafetyTips = () => {
  const tips = [
    {
      title: "Gas Leak Detection",
      tips: [
        "If you smell gas, immediately turn off the cylinder valve",
        "Do not operate electrical switches or appliances",
        "Open all doors and windows for ventilation",
        "Evacuate the area and call emergency services"
      ]
    },
    {
      title: "Proper Storage",
      tips: [
        "Store cylinder in upright position",
        "Keep in well-ventilated area",
        "Away from heat sources and direct sunlight",
        "Do not store in basements or below ground level"
      ]
    },
    {
      title: "Regular Maintenance",
      tips: [
        "Check hose for cracks or wear monthly",
        "Ensure regulator is properly connected",
        "Look for corrosion on cylinder surface",
        "Schedule professional inspection annually"
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Safety Tips</h2>
      
      <div className="space-y-4">
        {tips.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-700 mb-2">{section.title}</h3>
            <ul className="space-y-1">
              {section.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                  <span className="text-green-500 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Emergency Procedure</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
          <li>Turn off cylinder valve immediately</li>
          <li>Extinguish all open flames</li>
          <li>Do not operate electrical switches</li>
          <li>Open all doors and windows</li>
          <li>Evacuate the area immediately</li>
          <li>Call emergency services from a safe distance</li>
        </ol>
      </div>
    </div>
  );
};

export default SafetyTips;