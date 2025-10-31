import React, { useState, useEffect } from "react";
import { db } from "../../../firebase"; // Adjust this path to your firebase config
import { collection, onSnapshot } from "firebase/firestore";

import OrderModal from "./OrderModal";
import MapModal from "./MapModal";

function OrdersTable() {
  // --- STATE MANAGEMENT ---
  const [orders, setOrders] = useState([]); // Holds data from Firebase
  const [loading, setLoading] = useState(true); // Manages loading state

  // State for filtering and UI
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const ordersCollectionRef = collection(db, 'orders');

    // onSnapshot listens for real-time updates
    const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []); // Empty array ensures this runs only once on mount

  // --- FILTERING & PAGINATION LOGIC (Now uses live data) ---
  const rowsPerPage = 7;
  const filteredOrders = orders.filter((order) => {
    // NOTE: Ensure your Firestore documents have an 'order_status' field
    return (
      (filterStatus === "All Status" || order.order_status === filterStatus) &&
      order.id.toLowerCase().includes(query.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexStart = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredOrders.slice(indexStart, indexStart + rowsPerPage);

  // --- STYLING FUNCTION (Updated for new status values) ---
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 font-semibold";
      case "Pending":
        return "text-yellow-500 font-semibold";
      case "Returned":
        return "text-red-500 font-semibold";
      case "In-delivery":
        return "text-blue-500 font-semibold";
      case "Assigned":
        return "text-indigo-500 font-semibold";
      default:
        return "";
    }
  };

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="mt-6 w-full text-center">Loading Orders...</div>;
  }

  return (
    <div className="mt-6 w-full">
      {/* Search & Filter */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        {/* ... (Search and filter inputs remain the same) ... */}
      </div>

      {/* Table */}
      <div className="hidden md:block rounded-lg overflow-hidden border border-gray-300 shadow-sm bg-white">
        <table className="w-full text-left">
          <thead className="bg-[#EAF5EB] text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">Order Id</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">No. of Gases</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                {/* --- Mapped to Firestore Fields --- */}
                <td className="px-4 py-3 font-semibold">{order.id}</td>
                <td className="px-4 py-3">{order.customer_name}</td>
                {/* TODO: Adjust this if you have a quantity field */}
                <td className="px-4 py-3">1</td> 
                <td className="px-4 py-3">
                  <span className={getStatusStyle(order.order_status)}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-4 py-3">{order.customer_address}</td>
                <td className="px-4 py-3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onViewMap={(order) => setShowMap(order)}
      />

      {/* Map Modal */}
      {showMap && (
        <MapModal
          // TODO: Pass actual coordinates from the order document
          start={{ lat: -1.2833, lon: 36.8238 }} 
          destination={{ lat: -1.2712, lon: 36.8219 }}
          onClose={() => setShowMap(false)}
        />
      )}

      {/* Cards (mobile) */}
      <div className="block md:hidden w-full">
        {currentRows.map((order) => (
          // ... (Mobile card JSX now uses order.customer_name, order.order_status, etc.) ...
        ))}
      </div>

      {/* Pagination */}
      {/* ... (Pagination JSX remains the same) ... */}
    </div>
  );
}

export default OrdersTable;