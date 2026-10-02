import React, { useState, useEffect } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from "../../api/apiClient";


const SeftradingHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
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
                minute: '2-digit'
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

    const fetchSelfTradingHistory = async () => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await apiClient.post(
                '/Trading/SelfTradingPayoutHistory',
                null,
                {
                    params: {
                        regno: parseInt(regno),
                        pageNumber: pageIndex,
                        pageSize: itemsPerPage
                    }
                }
            );

            const data = response.data;
            if (data.result === "true" || data.result === true) {
                const historyData = data.response || data.data || [];
                setRecords(historyData);
                setRecordCount(historyData.length);

                const total = historyData.reduce((sum, item) => {
                    return sum + (parseFloat(item.payoutAmount) || parseFloat(item.Amount) || parseFloat(item.amount) || 0);
                }, 0);
                setTotalAmount(total);
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
            (row.EntryDate?.toLowerCase().includes(searchLower)) ||
            (row.date?.toLowerCase().includes(searchLower)) ||
            (row.payoutDate?.toLowerCase().includes(searchLower)) ||
            (row.Amount?.toString().toLowerCase().includes(searchLower)) ||
            (row.payoutAmount?.toString().toLowerCase().includes(searchLower)) ||
            (row.amount?.toString().toLowerCase().includes(searchLower)) ||
            (row.remark?.toLowerCase().includes(searchLower)) ||
            (row.lcount?.toString().toLowerCase().includes(searchLower)) ||
            (row.status?.toLowerCase().includes(searchLower))
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
        "Payout Amount",
        "Remaining Amount",
        "Remark",
    ];

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
                        <h2>Self Trading Payout History</h2>
                        <p>View your self trading payout transaction records</p>
                    </div>
                    {totalAmount > 0 && (
                        <div className="sth-total-badge">
                            <span>Total Payout</span>
                            <strong>{formatAmount(totalAmount)}</strong>
                        </div>
                    )}
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
                                <tr key={row.id || row.Rid || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td className="sth-date">
                                        {formatDate(row.EntryDate || row.date || row.payoutDate)}
                                    </td>
                                    <td className="sth-payout-amount">
                                        {formatAmount(row.Amount || row.payoutAmount || row.amount || 0)}
                                    </td>
                                    <td className="sth-remaining-amount">
                                        {formatAmount(row.lcount || row.remainingAmount || row.balance || 0)}
                                    </td>
                                    <td className="sth-remark" title={row.remark || row.Remark || "-"}>
                                        {row.remark || row.Remark ? (
                                            (row.remark || row.Remark).length > 50 ?
                                                (row.remark || row.Remark).substring(0, 50) + '...' :
                                                (row.remark || row.Remark)
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

export default SeftradingHistory;