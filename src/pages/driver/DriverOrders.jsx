import React, { useState } from 'react';
import { FaShoppingCart, FaHourglassHalf } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ordersSeed from '././ordersData';
import './driver.css';

const PAGE_SIZE = 9;

export default function DriverOrders() {
  const [orders, setOrders] = useState([...ordersSeed]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOrder, setModalOrder] = useState(null);
  const navigate = useNavigate();

  const filtered = orders.filter(o => o.id.includes(filter));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  function openModal(order) {
    setModalOrder(order);
  }
  function closeModal() { setModalOrder(null); }

  function handleReject(id) {
    const remaining = orders.filter(o => o.id !== id);
    setOrders(remaining);
    closeModal();
    const newFiltered = remaining.filter(o => o.id.includes(filter));
    const newPages = Math.max(1, Math.ceil(newFiltered.length / PAGE_SIZE));
    if (page > newPages) setPage(newPages);
  }
  function handleAccept(order) {
    navigate('/driver/map', { state: { order } });
  }

  function goPrev() {
    setPage(p => Math.max(1, p - 1));
  }
  function goNext() {
    setPage(p => Math.min(totalPages, p + 1));
  }



  return (
    <div className="driver-page">
      <aside className="driver-sidebar">
        <div className="driver-logo">
          <img src="/images/cylinder-logo.png" alt="logo" />
          <h1>CylinderTrack</h1>
        </div>
        <nav className="driver-nav">
          <Link to="/driver/orders" className="active"><FaShoppingCart /> Orders</Link>
          <Link to="/driver/history"><FaHourglassHalf /> History</Link>
        </nav>
      </aside>

      <main className="driver-main">
        <h2 className="page-title">New Assigned Orders</h2>

        <div className="search-box" style={{ marginBottom: 20 }}>
          <input value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} placeholder="Search by order id..." />
        </div>

        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Order Id</th>
                <th style={{ width: '28%' }}>Buyer</th>
                <th style={{ width: '12%' }}>No. of Gases</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '22%' }}>Location</th>
                <th style={{ width: '14%' }}>Details</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: 30, textAlign: 'center' }}>No results found</td></tr>
              ) : pageItems.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 800 }}>{o.id}</td>
                  <td>{o.buyer}</td>
                  <td>{o.gases}</td>
                  <td className={o.status === 'Pending' ? 'status-pending' : 'status-delivered'}>{o.status}</td>
                  <td>{o.location}</td>
                  <td><button className="view-btn" onClick={() => openModal(o)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="page-btn"
            onClick={goPrev}
            disabled={page === 1}
            aria-disabled={page === 1}
            title={page === 1 ? 'No previous page' : 'Previous page'}
          >
            Previous
          </button>

          <div className="page-info">Page {page} Of {totalPages}</div>

          <button
            className="page-btn"
            onClick={goNext}
            disabled={page === totalPages}
            aria-disabled={page === totalPages}
            title={page === totalPages ? 'No next page' : 'Next page'}
          >
            Next
          </button>
        </div>
      </main>

      {modalOrder && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Order Details</h2>
              <button style={{ background: 'transparent', border: 'none', fontSize: 28, cursor: 'pointer' }} onClick={closeModal}>✕</button>
            </div>

            <div className="field"><strong>Order id:</strong> <span style={{ fontWeight: 600, fontSize: 24 }}>{modalOrder.id}</span></div>
            <div className="field"><strong>Buyer:</strong> <span style={{ fontWeight: 600, fontSize: 22 }}>{modalOrder.buyer}</span></div>
            <div className="field"><strong>No. of Gases:</strong> <span style={{ fontWeight: 600, fontSize: 22 }}>{modalOrder.gases}</span></div>
            <div className="field"><strong>Location:</strong> <span style={{ fontWeight: 600, fontSize: 22 }}>{modalOrder.location}</span></div>
            <div className="field"><strong>Status:</strong> <span className="status-pending">{modalOrder.status}</span></div>

            <div className="modal-buttons">
              <button className="btn-reject" onClick={() => handleReject(modalOrder.id)}>✖ Reject</button>
              <button className="btn-accept" onClick={() => handleAccept(modalOrder)}>✔ Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}