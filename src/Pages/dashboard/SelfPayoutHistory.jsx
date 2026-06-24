import React, { useState, useEffect } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from "../../api/apiClient";

const SelfPayoutHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get regno from localStorage
    const regno = localStorage.getItem('Regno');

    // Format Date
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

    // Format Amount
    const formatAmount = (amount) => {
        return `$${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // ✅ Fetch Self Trading Payout History
    const fetchSelfPayoutHistory = async () => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.post(
                `/Trading/SelfTradingPayoutHistory?regno=${regno}&pageNumber=${pageIndex}&pageSize=${itemsPerPage}`
            );

            console.log("API Response:", response.data);

            if (response.data?.result === "true") {
                const allData = response.data?.response || [];
                
                // ✅ Filter only "Fund Withdrawal" records
                const fundWithdrawalData = allData.filter(item => 
                    item.Designation?.toLowerCase().includes("fund withdrawal")
                );
                
                setRecords(fundWithdrawalData);
                
                // Calculate total amount
                const total = fundWithdrawalData.reduce((sum, item) => {
                    return sum + (parseFloat(item.Amount) || parseFloat(item.debit) || 0);
                }, 0);
                setTotalAmount(total);
            } else {
                toast.error(response.data?.message || 'Failed to fetch report');
                setRecords([]);
                setTotalAmount(0);
            }
        } catch (err) {
            console.error('Error fetching report:', err);
            toast.error(err.response?.data?.message || err.message || 'Something went wrong');
            setRecords([]);
            setTotalAmount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSelfPayoutHistory();
    }, [pageIndex, itemsPerPage]);

    // Filter records based on search term (local search)
    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.EntryDate?.toLowerCase().includes(searchLower)) ||
            (row.Designation?.toLowerCase().includes(searchLower)) ||
            (row.Amount?.toString().toLowerCase().includes(searchLower)) ||
            (row.debit?.toString().toLowerCase().includes(searchLower)) ||
            (row.MRID?.toString().toLowerCase().includes(searchLower))
        );
    });

    // Pagination logic
    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when search term or items per page changes
    useEffect(() => {
        setPageIndex(1);
    }, [searchTerm, itemsPerPage]);

    const columns = [
        "Sl.No.",
        "Date",
        "Debit",
        "Remark",
    ];

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="Table-container royalty-main-wrapper mb-5 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                    <h3 className="mb-0 text-dark">Self Trading Payout History</h3>
                    <div className="total-income-box">
                        <span className="text-muted">Total Amount: </span>
                        <strong className="text-success">{formatAmount(totalAmount)}</strong>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3 entries-search-bar">
                    {/* Show Entries */}
                    <div className="entries-control d-flex align-items-center gap-2">
                        <label className="text-dark mb-0">Show entries:</label>
                        <select 
                            className="form-select" 
                            value={itemsPerPage} 
                            onChange={e => {
                                setItemsPerPage(Number(e.target.value));
                                setPageIndex(1);
                            }}
                            style={{ width: '80px' }}
                        >
                            {[10, 25, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    {/* Search Records */}
                    <div className="search-wrapper">
                        <input
                            className="form-control search-input"
                            placeholder="🔍 Search records..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                    </div>
                </div>

                <div className="report-card">
                    <CustomTable columns={columns} loading={loading}>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((row, index) => (
                                <tr key={row.MRID || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td>
                                        {formatDate(row.EntryDate)}
                                    </td>
                                    <td style={{ color: "#d60d0d", fontWeight: "600" }}>
                                        {formatAmount(row.Amount || row.debit || "0")}
                                    </td>
                                    <td style={{ color: "#6b7280", fontSize: "13px" }} title={row.Designation || "-"}>
                                        {row.Designation || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    {loading ? "Loading..." : "No Fund Withdrawal records found"}
                                </td>
                            </tr>
                        )}
                    </CustomTable>

                    {/* Pagination Component */}
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

export default SelfPayoutHistory;