import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const LinkCylinder = ({ user, onCylinderLinked }) => {
  const [cylinderId, setCylinderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLinkCylinder = async (e) => {
    e.preventDefault();
    if (!cylinderId.trim()) {
      setError('Please enter a cylinder ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Linking cylinder:', cylinderId);
      
      // Check if cylinder exists
      const cylinderDocRef = doc(db, 'cylinders', cylinderId.trim().toUpperCase());
      const cylinderDoc = await getDoc(cylinderDocRef);
      
      if (!cylinderDoc.exists()) {
        setError('Cylinder ID not found. Please check the ID and try again.');
        setLoading(false);
        return;
      }

      const cylinderData = cylinderDoc.data();
      
      // Check if cylinder is already assigned to another user
      if (cylinderData.userId && cylinderData.userId !== user.uid) {
        setError('This cylinder is already linked to another account.');
        setLoading(false);
        return;
      }

      // Update cylinder with user ID
      await updateDoc(cylinderDocRef, {
        userId: user.uid,
        lastUpdated: new Date()
      });

      // Update user document with cylinder ID
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        cylinderId: cylinderId.trim().toUpperCase(),
        cylinderLinkedAt: new Date()
      });

      console.log('Cylinder linked successfully');
      onCylinderLinked({ ...cylinderData, cylinderId: cylinderId.trim().toUpperCase() });
      
    } catch (error) {
      console.error('Error linking cylinder:', error);
      setError('Failed to link cylinder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Link Your Cylinder</h2>
          <p className="text-gray-600 mb-8">
            Enter the Cylinder ID found on your LPG cylinder to start monitoring its safety.
          </p>
        </div>

        <form onSubmit={handleLinkCylinder} className="space-y-6">
          <div>
            <label htmlFor="cylinderId" className="block text-sm font-medium text-gray-700 mb-2">
              Cylinder ID
            </label>
            <input
              id="cylinderId"
              name="cylinderId"
              type="text"
              required
              value={cylinderId}
              onChange={(e) => setCylinderId(e.target.value)}
              placeholder="e.g., GW-CYL-12345"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <p className="mt-2 text-sm text-gray-500">
              Find this ID on the sticker attached to your cylinder
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Linking Cylinder...
              </>
            ) : (
              'Link Cylinder & Continue'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Where to find your Cylinder ID?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Look for a sticker on the cylinder body</li>
            <li>• Check your purchase receipt or invoice</li>
            <li>• Contact Green Wells Energies support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkCylinder;