// IncomePayOutHistory.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";


const IncomePayOutHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const regno = sessionStorage.getItem("Regno");

    useEffect(() => {
        const fetchWithdrawReport = async () => {
            if (!regno) {
                setLoading(false);
                setError("Please login to view your withdrawal history");
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await apiClient.get(
                    `/IncomePayout/PayoutReport/${regno}`
                );

                if (res.data && res.data.result === "true") {
                    const reportData = res.data.response || [];
                    setRecords(reportData);
                } else {
                    setRecords([]);
                    setError(res.data?.message || "Failed to fetch data");
                }
            } catch (error) {
                console.error("API Error:", error.response || error);
                setError(error.response?.data?.message || "An error occurred while fetching data");
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWithdrawReport();
    }, [regno]);

    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.entryDate && row.entryDate.toLowerCase().includes(searchLower)) ||
            (row.remark && row.remark.toLowerCase().includes(searchLower)) ||
            (row.status && row.status.toLowerCase().includes(searchLower))
        );
    });

    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    const handlePageChange = (page) => setCurrentPage(page);
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const formatAmount = (amount) => {
        if (!amount && amount !== 0) return "-";
        return `$${Number(amount).toFixed(2)}`;
    };

    // ✅ Status badge class - navy theme
    const getStatusBadgeClass = (status) => {
        if (!status) return "ip-badge-neutral";
        const type = status.toLowerCase();
        if (type.includes('success') || type.includes('approved') || type.includes('completed')) return "ip-badge-success";
        if (type.includes('pending')) return "ip-badge-warning";
        if (type.includes('rejected') || type.includes('failed') || type.includes('cancel')) return "ip-badge-danger";
        return "ip-badge-neutral";
    };

    const columns = [
        "Sl.No.",
        "Date",
        "PayOut Amount",
        "Service charge",
        "Recivice Amount",
        "Remark",
        "Status"
    ];

    // ===== Login required error =====
    if (error === "Please login to view your withdrawal history") {
        return (
            <div className="Table-container downline-main-wrapper report-container p-2 p-md-4 mb-5">
                <div className="dh-header-card">
                    <div className="dh-header-icon">
                        <i className="ti ti-cash-banknote"></i>
                    </div>
                    <div className="dh-header-texts">
                        <h2>Withdrawal Report</h2>
                        <p>View your withdrawal transaction records</p>
                    </div>
                </div>
                <div className="ip-error-alert ip-error-warning">
                    <i className="ti ti-alert-triangle"></i>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Table-container downline-main-wrapper report-container p-2 p-md-4 mb-5">
                <div className="dh-header-card">
                    <div className="dh-header-icon">
                        <i className="ti ti-cash-banknote"></i>
                    </div>
                    <div className="dh-header-texts">
                        <h2>PayOut Report</h2>
                        <p>View your payout transaction records</p>
                    </div>
                </div>
                <div className="ip-error-alert ip-error-danger">
                    <i className="ti ti-alert-circle"></i>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="Table-container downline-main-wrapper report-container p-2 p-md-4 mb-5">

            {/* ===== HEADER CARD ===== */}
            <div className="dh-header-card">
                <div className="dh-header-icon">
                    <i className="ti ti-cash-banknote"></i>
                </div>
                <div className="dh-header-texts">
                    <h2>Income Payout History</h2>
                    <p>View your payout transaction records</p>
                </div>
            </div>

            {/* ===== FILTERS BAR ===== */}
            <div className="dh-filters-bar">
                <div className="dh-filter-item">
                    <label className="dh-filter-label">Show entries:</label>
                    <select
                        className="dh-select"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="dh-search-wrap">
                    <i className="ti ti-search dh-search-icon"></i>
                    <input
                        className="dh-search-input"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* ===== TABLE CARD ===== */}
            <div className="dh-table-card">
                <CustomTable columns={columns} loading={loading}>
                    {currentRecords.length > 0 ? (
                        currentRecords.map((row, index) => (
                            <tr key={index}>
                                <td className="text-center">
                                    <div className="sr-no-circle">
                                        {startIndex + index + 1}
                                    </div>
                                </td>
                                <td className="ip-date">
                                    {row.TransDate ? new Date(row.TransDate).toLocaleString("en-GB") : "-"}
                                </td>
                                <td>
                                    {row.debit > 0 ? (
                                        <span className="ip-amount-badge ip-amount-green">
                                            {formatAmount(row.debit)}
                                        </span>
                                    ) : (
                                        <span className="ip-na">-</span>
                                    )}
                                </td>
                                <td>
                                    {row.handlingcharge > 0 ? (
                                        <span className="ip-amount-badge ip-amount-red">
                                            {formatAmount(row.handlingcharge)}
                                        </span>
                                    ) : (
                                        <span className="ip-na">-</span>
                                    )}
                                </td>
                                <td>
                                    {row.netPayable > 0 ? (
                                        <span className="ip-amount-badge ip-amount-blue">
                                            {formatAmount(row.netPayable)}
                                        </span>
                                    ) : (
                                        <span className="ip-na">-</span>
                                    )}
                                </td>
                                <td className="ip-remark" title={row.Remark || "-"}>
                                    {row.Remark || "-"}
                                </td>
                                <td>
                                    <span className={`ip-badge ${getStatusBadgeClass(row.status)}`}>
                                        {row.status || "N/A"}
                                    </span>
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
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={totalItems}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default IncomePayOutHistory;