import React, { useState } from "react";
import AssignDriverModal from "./AssignDriverModal"; 

function OrderModal({ order, onClose, onViewMap }) {
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);

  if (!order) return null;

  const handleAssignClick = () => {
    setShowAssignDriverModal(true); // This will open the new modal
  };

  const handleDriverAssigned = () => {
    setShowAssignDriverModal(false); // Close assign driver modal
    onClose(); // Close this order details modal
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-center">
            Order Details
          </h2>

          <div className="space-y-2 text-lg">
            <p>
              <strong>Order id:</strong> {order.id}
            </p>
            <p>
              <strong>Buyer:</strong> {order.customer_name || 'N/A'}
            </p>
            <p>
              <strong>Amount:</strong> KES {order.amount || 0}
            </p>
            <p>
              <strong>Location:</strong> {order.customer_address || 'N/A'}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  order.status === "pending" // <-- CORRECTED
                    ? "text-yellow-500 font-semibold"
                    : order.status === "Delivered" // <-- CORRECTED
                    ? "text-green-600 font-semibold"
                    : order.status === "Returned" // <-- CORRECTED
                    ? "text-red-500 font-semibold"
                    : order.status === "In-delivery" // <-- CORRECTED
                    ? "text-blue-500 font-semibold"
                    : "text-indigo-500 font-semibold" // Default for "Assigned"
                }
              >
                {order.status} {/* <-- CORRECTED */}
              </span>
            </p>
            {/* --- New Section to show driver info --- */}
            {order.assigned_driver_name && ( 
              <div className="pt-2 border-t mt-3">
                <p>
                  <strong>Assigned Driver:</strong> {order.assigned_driver_name}
                </p>
                <p>
                  <strong>Driver Phone:</strong> {order.assigned_driver_phone}
                </p>
              </div>
            )}
            {/* --- End of New Section --- */}
          </div>

          {/* Action Button */}
          {order.status == "pending" && ( // <-- CORRECTED
            <button
              className="w-full bg-indigo-600 mt-5 text-white py-2 rounded-md hover:bg-indigo-700"
              onClick={handleAssignClick} 
            >
              Assign Driver
            </button>
          )}

          {order.status == "in-delivery" && ( // <-- CORRECTED
            <button
              className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              onClick={() => onViewMap(order)} 
            >
              View Map
            </button>
          )}
        </div>
      </div>

      {/* --- New Section to render the Assign Modal --- */}
      {showAssignDriverModal && (
        <AssignDriverModal
          order={order}
          onClose={() => setShowAssignDriverModal(false)}
          onDriverAssigned={handleDriverAssigned}
        />
      )}
      {/* --- End of New Section --- */}
    </>
  );
}

export default OrderModal;
