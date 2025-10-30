import React from "react";

function OrderModal({ order, onClose, onViewMap }) {
  if (!order) return null;

  return (
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
            <strong>Buyer:</strong> {order.buyer}
          </p>
          <p>
            <strong>No. of Gases:</strong> {order.gases}
          </p>
          <p>
            <strong>Location:</strong> {order.location}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={
                order.status === "Pending"
                  ? "text-yellow-500"
                  : order.status === "Delivered"
                  ? "text-green-600"
                  : order.status === "Returned"
                  ? "text-red-500"
                  : "text-blue-500"
              }
            >
              {order.status}
            </span>
          </p>
        </div>

        {/* Action Button */}
        {order.status === "Pending" && (
          <button className="w-full bg-indigo-600 mt-5 text-white py-2 rounded-md">
            Assign Driver
          </button>
        )}

        {order.status === "In-delivery" && (
          <button
            className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md"
            onClick={() => onViewMap(order)} // ✅ trigger map modal
          >
            View Map
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderModal;
