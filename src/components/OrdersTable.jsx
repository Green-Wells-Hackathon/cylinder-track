import React, { useState } from "react";
import OrderModal from "./OrderModal";
import MapModal from "./MapModal";

const ordersData = [
  {
    id: "000012",
    buyer: "Alice Mun",
    gases: "05",
    status: "Delivered",
    location: "Mamlaka Road",
  },
  {
    id: "000013",
    buyer: "Baraka Unxile",
    gases: "02",
    status: "Pending",
    location: "Korongo Road",
  },
  {
    id: "000014",
    buyer: "Umutoni Shayi",
    gases: "03",
    status: "In-delivery",
    location: "Hardy,Karen",
  },
  {
    id: "000015",
    buyer: "Teddy Bore",
    gases: "03",
    status: "Returned",
    location: "Ndege Road",
  },
  {
    id: "000012",
    buyer: "Alice Mun",
    gases: "05",
    status: "Delivered",
    location: "Ndege Road",
  },
  {
    id: "000013",
    buyer: "Baraka Unxile",
    gases: "02",
    status: "Pending",
    location: "Ndege Road",
  },
  {
    id: "000014",
    buyer: "Umutoni Shayi",
    gases: "03",
    status: "In-delivery",
    location: "Ndege Road",
  },
  {
    id: "000015",
    buyer: "Teddy Bore",
    gases: "03",
    status: "Returned",
    location: "Ndege Road",
  },
];

function OrdersTable() {
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const rowsPerPage = 7;
  const filteredOrders = ordersData.filter((order) => {
    return (
      (filterStatus === "All Status" || order.status === filterStatus) &&
      order.id.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const indexStart = (currentPage - 1) * rowsPerPage;
  const currentRows = filteredOrders.slice(
    indexStart,
    indexStart + rowsPerPage
  );

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
      default:
        return "";
    }
  };

  return (
    <div className="mt-6 w-full">
      {/* Search & Filter */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search Order by ID"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 rounded-md w-full sm:w-64 h-10 bg-white border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="All Status"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-40 p-2 rounded-md h-10 bg-white border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All Status">All Status</option>
          <option value="Delivered">Delivered</option>
          <option value="Pending">Pending</option>
          <option value="In-delivery">In-delivery</option>
          <option value="Returned">Returned</option>
        </select>
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
            {currentRows.map((order, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{order.id}</td>
                <td className="px-4 py-3">{order.buyer}</td>
                <td className="px-4 py-3">{order.gases}</td>
                <td className="px-4 py-3">
                  <span className={getStatusStyle(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">{order.location}</td>
                <td className="px-4 py-3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                    onClick={() => setSelectedOrder(order)} // NEW
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
        onViewMap={(order) => setShowMap(order)} // ✅ activates map modal
      />

      {showMap && (
        <MapModal
          start={{ lat: -1.2833, lon: 36.8238 }} // Odeon
          destination={{ lat: -1.2712, lon: 36.8219 }} // Ngara
          onClose={() => setShowMap(false)}
        />
      )}

      {/* Cards (mobile) */}
      <div className="block md:hidden w-full">
        {currentRows.map((order, index) => (
          <div
            key={`${order.id}-${index}`}
            className="bg-white rounded-lg p-4 mb-4 shadow-md border border-gray-200"
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Order #{order.id}</h3>
              <span
                className={`text-sm px-2 py-1 rounded-md
          ${order.status === "Pending" && "bg-yellow-100 text-yellow-700"}
          ${order.status === "In-delivery" && "bg-blue-100 text-blue-700"}
          ${order.status === "Delivered" && "bg-green-100 text-green-700"}
          ${order.status === "Returned" && "bg-red-100 text-red-700"}
        `}
              >
                {order.status}
              </span>
            </div>

            <p className="mt-2">
              <span className="font-semibold">Buyer:</span> {order.buyer}
            </p>
            <p>
              <span className="font-semibold">No. of Gases:</span> {order.gases}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {order.location}
            </p>

            {order.status === "Pending" && (
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md">
                Assign Driver
              </button>
            )}

            {order.status === "In-delivery" && (
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
                onClick={() => setShowMap(order)}
              >
                View Map
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-1 rounded bg-gray-300 text-gray-800 disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <p className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </p>

        <button
          className="px-4 py-1 rounded bg-blue-500 text-white disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrdersTable;
