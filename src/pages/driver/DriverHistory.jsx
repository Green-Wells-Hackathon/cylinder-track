import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ordersSeed from './ordersData';
import './driver.css';
import { FaShoppingCart, FaHourglassHalf } from 'react-icons/fa';


const PAGE_SIZE = 9;

export default function DriverHistory() {
    const [orders] = useState(ordersSeed.map(o => ({ ...o, status: 'Delivered' })));
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);

    const filtered = orders.filter(o => o.id.includes(filter));
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);


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
                <h2 className="page-title">Orders History</h2>

                <div className="search-box" style={{ marginBottom: 20 }}>
                    <input value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} placeholder="Search by order id..." />
                </div>

                <table className="orders-history-table">
                    <thead>
                        <tr>
                            <th>Order Id</th>
                            <th>Buyer</th>
                            <th>No. of Gases</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: 30, textAlign: 'center' }}>No results found</td>
                            </tr>
                        ) : pageItems.map(o => (
                            <tr key={o.id}>
                                <td style={{ fontWeight: 800 }}>{o.id}</td>
                                <td>{o.buyer}</td>
                                <td>{o.gases}</td>
                                <td className="status-delivered">{o.status}</td>
                                <td>{o.location}</td>
                                <td>{o.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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
        </div>
    );
}