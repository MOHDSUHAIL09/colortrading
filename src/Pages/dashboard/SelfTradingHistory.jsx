import React, { useState, useEffect } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from "../../api/apiClient";


const SelfTradingHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalWin, setTotalWin] = useState(0);
    const [totalLoss, setTotalLoss] = useState(0);
    const [recordCount, setRecordCount] = useState(0);

    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const regno = sessionStorage.getItem('Regno');

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return '-';
        }
    };

    const formatAmount = (amount) => {
        return `$${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatRate = (rate) => {
        return parseFloat(rate || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const fetchSelfTradingHistory = async () => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await apiClient.get('/Trading/BidReport', {
                params: {
                    regno: parseInt(regno),
                    PageIndex: pageIndex,
                    PageSize: itemsPerPage
                }
            });

            const data = response.data;

            if (data.result === "true" || data.result === true) {
                const historyData = data.response?.data || [];
                const totalRecords = data.response?.recordCount || 0;

                setRecords(historyData);
                setRecordCount(totalRecords);

                let totalBet = 0;
                let winCount = 0;
                let lossCount = 0;

                historyData.forEach(item => {
                    totalBet += parseFloat(item.betAmount) || 0;
                    if (item.type?.toLowerCase() === 'win') winCount++;
                    if (item.type?.toLowerCase() === 'loss') lossCount++;
                });

                setTotalAmount(totalBet);
                setTotalWin(winCount);
                setTotalLoss(lossCount);

            } else {
                toast.error(data.message || 'Failed to fetch history');
                setRecords([]);
                setTotalAmount(0);
                setRecordCount(0);
            }
        } catch (err) {
            console.error('Error fetching report:', err);

            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Something went wrong';
            toast.error(errorMessage);
            setRecords([]);
            setTotalAmount(0);
            setRecordCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSelfTradingHistory();
    }, [pageIndex, itemsPerPage]);

    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.entryDate?.toLowerCase().includes(searchLower)) ||
            (row.endtime?.toLowerCase().includes(searchLower)) ||
            (row.betAmount?.toString().toLowerCase().includes(searchLower)) ||
            (row.currency?.toLowerCase().includes(searchLower)) ||
            (row.predict?.toLowerCase().includes(searchLower)) ||
            (row.type?.toLowerCase().includes(searchLower)) ||
            (row.remark?.toLowerCase().includes(searchLower)) ||
            (row.status?.toString().toLowerCase().includes(searchLower)) ||
            (row.unique_id?.toLowerCase().includes(searchLower)) ||
            (row.slot?.toString().toLowerCase().includes(searchLower))
        );
    });

    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setPageIndex(1);
    }, [searchTerm]);

    const columns = [
        "Sl.No.",
        "Date",
        "Currency",
        "Bet Amount",
        "Slot",
        "Prediction",
        "Buying Rate",
        "Selling Rate",
        "Result",
        "Remark",
    ];

    // ===== Status Badge (Win/Loss) =====
    const getStatusBadge = (type) => {
        const t = type?.toLowerCase();
        if (t === 'win') {
            return <span className="st-badge st-badge-win">Win</span>;
        } else if (t === 'loss') {
            return <span className="st-badge st-badge-loss">Loss</span>;
        }
        return <span className="st-badge st-badge-neutral">-</span>;
    };

    // ===== Prediction Badge (Up/Down) =====
    const getPredictionBadge = (predict) => {
        const p = predict?.toLowerCase();
        if (p === 'up') {
            return <span className="st-badge st-badge-up">▲ UP</span>;
        } else if (p === 'down') {
            return <span className="st-badge st-badge-down">▼ DOWN</span>;
        }
        return <span className="st-badge st-badge-neutral">{predict || '-'}</span>;
    };

    const getSlotDisplay = (slot) => {
        if (!slot) return '-';
        if (typeof slot === 'number') return `${slot} min`;
        return slot;
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="Table-container royalty-main-wrapper mb-5 p-4">

                {/* ===== HEADER CARD ===== */}
                <div className="dh-header-card">
                    <div className="dh-header-icon">
                        <i className="ti ti-chart-candle"></i>
                    </div>
                    <div className="dh-header-texts">
                        <h2>Self Trading History</h2>
                        <p>View your self trading transaction records</p>
                    </div>
                </div>

                {/* ===== FILTERS BAR ===== */}
                <div className="dh-filters-bar">
                    <div className="dh-filter-item">
                        <label className="dh-filter-label">Show entries:</label>
                        <select
                            className="dh-select"
                            value={itemsPerPage}
                            onChange={e => {
                                setItemsPerPage(Number(e.target.value));
                                setPageIndex(1);
                            }}
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
                                <tr key={row.unique_id || row.id || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td className="st-date">
                                        {formatDate(row.entryDate || row.endtime)}
                                    </td>
                                    <td>
                                        <span className="st-badge st-badge-currency">
                                            {row.currency?.toUpperCase() || '-'}
                                        </span>
                                    </td>
                                    <td className="st-bet-amount">
                                        {formatAmount(row.betAmount || 0)}
                                    </td>
                                    <td>
                                        <span className="st-badge st-badge-slot">
                                            {getSlotDisplay(row.slot)}
                                        </span>
                                    </td>
                                    <td>
                                        {getPredictionBadge(row.predict)}
                                    </td>
                                    <td className="st-rate">
                                        ${formatRate(row.currencyRate)}
                                    </td>
                                    <td className="st-rate">
                                        ${formatRate(row.sellingRate)}
                                    </td>
                                    <td>
                                        {getStatusBadge(row.type)}
                                    </td>
                                    <td className="st-remark" title={row.remark || "-"}>
                                        {row.remark ? (
                                            row.remark.length > 50 ?
                                                row.remark.substring(0, 50) + '...' :
                                                row.remark
                                        ) : "-"}
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

                    {!loading && totalPages > 1 && (
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

export default SelfTradingHistory;