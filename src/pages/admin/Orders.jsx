import React, { useState, useEffect } from "react";
import { db } from "../../../firebase"; // Adjust this path to your firebase config
import { collection, onSnapshot } from "firebase/firestore";


import OrderModal from "../../components/OrderModal";
import MapModal from "../../components/MapModal";

function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const ordersCollectionRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const rowsPerPage = 7;
  const filteredOrders = orders.filter((order) => {
    return (
      (filterStatus === "All Status" || order.status === filterStatus) &&
      order.id.toLowerCase().includes(query.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexStart = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredOrders.slice(indexStart, indexStart + rowsPerPage);

  const getStatusStyle = (status) => {
    switch (status.toString().toLowerCase()) {
      case "delivered": return "text-green-600 font-semibold";
      case "pending": return "text-yellow-500 font-semibold";
      case "returned": return "text-red-500 font-semibold";
      case "in-delivery": return "text-blue-500 font-semibold";
      case "assigned": return "text-indigo-500 font-semibold";
      default: return "";
    }
  };

  if (loading) {
    return <div className="mt-6 w-full text-center p-8">Loading Orders...</div>;
  }

  return (
    <div className="mt-6 w-full">
      {/* Search & Filter Inputs */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Order by ID"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
          className="p-2 rounded-md w-full sm:w-64 h-10 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="All Status"
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-40 p-2 rounded-md h-10 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All Status">All Status</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="in-delivery">In-delivery</option>
          <option value="assigned">Assigned</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-lg overflow-hidden border border-gray-300 shadow-sm bg-white">
        <table className="w-full text-left">
          <thead className="bg-[#EAF5EB] text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3">Order Id</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-600">#{order.id.slice(0, 6)}...</td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3">KES {order.amount}</td>
                <td className="px-4 py-3">
                  <span className={getStatusStyle(order.status)}>{order.status}</span>
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

      {/* --- FIX IS HERE --- Mobile Cards */}
      <div className="block md:hidden w-full">
        {currentRows.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.slice(0, 6)}...</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full
                  ${order.status === "pending" && "bg-yellow-100 text-yellow-800"}
                  ${order.status === "in-delivery" && "bg-blue-100 text-blue-800"}
                  ${order.status === "delivered" && "bg-green-100 text-green-800"}
                  ${order.status === "returned" && "bg-red-100 text-red-800"}
                  ${order.status === "assigned" && "bg-indigo-100 text-indigo-800"}
                `}
              >
                {order.status}
              </span>
            </div>

            <p className="mt-2 text-gray-600">
              <span className="font-semibold text-gray-900">Buyer:</span> {order.customer_name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Location:</span> {order.customer_address}
            </p>
             <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Amount:</span> KES {order.amount}
            </p>

            {order.status === "Pending" && (
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
                Assign Driver
              </button>
            )}

            {order.status == "in-delivery" && (
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                onClick={() => setShowMap(order)}
              >
                View Map
              </button>
            )}
             <button
                className="mt-2 w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 border border-gray-300"
                onClick={() => setSelectedOrder(order)}
              >
                View Details
              </button>
          </div>
        ))}
      </div>

      {/* Modals and Pagination */}
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onViewMap={() => setShowMap(selectedOrder)} />
      {/* Map Modal */}
      {showMap && (
        <MapModal
          start={{ lat: -1.2833, lon: 36.8238 }} 
          destination={{
            lat: showMap.destination_location.latitude,
            lon: showMap.destination_location.longitude
          }}
          onClose={() => setShowMap(false)}
        />
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <p className="text-sm font-medium">Page {currentPage} of {totalPages || 1}</p>
        <button
          className="px-4 py-1 rounded bg-blue-500 text-white disabled:opacity-40"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrdersTable;