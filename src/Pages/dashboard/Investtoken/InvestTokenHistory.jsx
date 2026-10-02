// InvestTokenHistory.jsx
import React, { useState, useEffect } from "react";
import CustomTable from "../../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from "../../../api/apiClient";

const InvestTokenHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("running");

    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const regno = sessionStorage.getItem('Regno') || 1;

    const formatAmount = (amount) => {
        return `$${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchTokenHistory = async (type = "running") => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get('/Token/TokenMiningHistoryAsync', {
                params: { regno, type }
            });
            const data = response.data;

            if (data.result === "true" || data.result === true) {
                const historyData = data.data || [];
                setRecords(historyData);
            } else {
                toast.error(data.message || 'Failed to fetch history');
                setRecords([]);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            toast.error(err.message || 'Something went wrong');
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTokenHistory(activeTab);
    }, [activeTab]);

    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.investtype?.toLowerCase().includes(searchLower)) ||
            (row.Rkprice?.toString().toLowerCase().includes(searchLower)) ||
            (row.RKbv?.toString().toLowerCase().includes(searchLower)) ||
            (row.remark?.toLowerCase().includes(searchLower)) ||
            (row.TranNO?.toLowerCase().includes(searchLower)) ||
            (row.epinNo?.toLowerCase().includes(searchLower))
        );
    });

    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setPageIndex(1);
    }, [searchTerm, itemsPerPage]);

    const columns = [
        "Sl.No.",
        "Date",
        "Plan",
        "Amount",
        "Tokens",
        "Daily Percentage %",
        "Lock-up",
        "Status",
        "Remark",
    ];

    const handleTabChange = (type) => {
        setActiveTab(type);
        setPageIndex(1);
    };

    // ✅ Tab style helper
    const getTabStyle = (tabName) => {
        const isActive = activeTab === tabName;
        return {
            padding: "9px 22px",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: isActive ? 700 : 600,
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: isActive ? "none" : "1px solid rgba(120, 160, 255, 0.3)",
            background: isActive
                ? "linear-gradient(90deg, #0878ff 0%, #5420f5 70%, #e91bea 100%)"
                : "rgba(255, 255, 255, 0.05)",
            color: isActive ? "#ffffff" : "#a9b7d6",
            boxShadow: isActive ? "0 4px 16px rgba(84, 32, 245, 0.45)" : "none",
            outline: "none",
        };
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="Table-container royalty-main-wrapper mb-5 p-4">

                {/* ===== HEADER CARD ===== */}
                <div className="dh-header-card">
                    <div className="dh-header-icon">
                        <i className="ti ti-coin"></i>
                    </div>
                    <div className="dh-header-texts">
                        <h2>Token Mining History</h2>
                        <p>View your token mining transaction records</p>
                    </div>
                </div>

                {/* ===== TABS (inline styles) ===== */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginBottom: "18px"
                }}>
                    <button
                        onClick={() => handleTabChange('running')}
                        style={getTabStyle('running')}
                    >
                        Running
                    </button>
                    <button
                        onClick={() => handleTabChange('completed')}
                        style={getTabStyle('completed')}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => handleTabChange('all')}
                        style={getTabStyle('all')}
                    >
                        All
                    </button>
                </div>

                {/* ===== FILTERS BAR ===== */}
                <div className="dh-filters-bar">
                    <div className="dh-filter-item">
                        <label className="dh-filter-label">Show entries:</label>
                        <select
                            className="dh-select"
                            value={itemsPerPage}
                            onChange={e => setItemsPerPage(Number(e.target.value))}
                        >
                            {[10, 25, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <div className="dh-search-wrap">
                        <i className="ti ti-search dh-search-icon"></i>
                        <input
                            className="dh-search-input"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* ===== TABLE CARD ===== */}
                <div className="dh-table-card">
                    <CustomTable columns={columns} loading={loading}>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((row, index) => (
                                <tr key={row.Rid || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td className="ith-date">{formatDate(row.Rdate)}</td>
                                    <td>
                                        <span className="ith-plan">
                                            {row.investtype || 'Tier'}
                                        </span>
                                    </td>
                                    <td className="ith-amount">
                                        {formatAmount(row.Rkprice)}
                                    </td>
                                    <td className="ith-tokens">{row.RKbv || 0}</td>
                                    <td className="ith-percent">{row.slabfine}</td>
                                    <td>
                                        <span className="ith-lockup">
                                            {row.booster || 0} Months
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`ith-badge ${row.TranNO === 'Running' ? 'ith-badge-warning' : 'ith-badge-success'}`}>
                                            {row.TranNO === 'Running' ? 'Running' : 'Completed'}
                                        </span>
                                    </td>
                                    <td className="ith-remark" title={row.remark || "-"}>
                                        {row.remark || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    {loading ? "Loading..." : "No records found"}
                                </td>
                            </tr>
                        )}
                    </CustomTable>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={pageIndex}
                            totalPages={totalPages}
                            totalRecords={totalItems}
                            onPageChange={setPageIndex}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default InvestTokenHistory;