import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Adjust path to your firebase config
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";

function AssignDriverModal({ order, onClose, onDriverAssigned }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");

  // Fetch drivers when the modal opens
  useEffect(() => {
    const driversRef = collection(db, 'users');
    
    // --- THIS IS THE QUERY YOU ASKED FOR ---
    // It looks for documents in the 'users' collection
    // where the 'role' field is exactly "driver"
    const q = query(driversRef, where("role", "==", "driver"));
    // ---

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const driverList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDrivers(driverList);
      setLoadingDrivers(false);
      if (driverList.length > 0 && !selectedDriverId) {
        setSelectedDriverId(driverList[0].id);
      }
    }, (err) => {
      console.error("Error fetching drivers:", err);
      setError("Failed to load drivers. Please try again.");
      setLoadingDrivers(false);
    });

    return () => unsubscribe();
  }, [selectedDriverId]);

  if (!order) return null; // Don't render if no order is passed

  const handleAssignDriver = async () => {
    if (!selectedDriverId) {
      setError("Please select a driver.");
      return;
    }
    setIsAssigning(true);
    setError("");

    try {
      const orderRef = doc(db, 'orders', order.id);
      const selectedDriver = drivers.find(d => d.id === selectedDriverId);

      if (!selectedDriver) {
        throw new Error("Selected driver not found.");
      }

      // Update the order document
      await updateDoc(orderRef, {
        order_status: "Assigned",
        assigned_driver_id: selectedDriver.id,
        assigned_driver_name: selectedDriver.name || "N/A", // Assumes driver doc has 'name'
        assigned_driver_phone: selectedDriver.phone || "N/A", // Assumes driver doc has 'phone'
      });
      onDriverAssigned(); // This closes the modals
    } catch (err) {
      console.error("Error assigning driver:", err);
      setError("Failed to assign driver. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
          Assign Driver
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Order</label>
            <input
              type="text"
              value={`#${order.id.slice(0, 6)}...`}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Driver</label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingDrivers || isAssigning}
            >
              {loadingDrivers ? (
                <option value="">Loading drivers...</option>
              ) : drivers.length === 0 ? (
                <option value="">No drivers found</option>
              ) : (
                drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name || `Driver ${driver.id.slice(0, 5)}`}
                  </option>
                ))
              )}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              value={order.customer_address || "N/A"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          onClick={handleAssignDriver}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md mt-6 transition duration-200"
          disabled={isAssigning || loadingDrivers || drivers.length === 0}
        >
          {isAssigning ? "Assigning..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}

export default AssignDriverModal;