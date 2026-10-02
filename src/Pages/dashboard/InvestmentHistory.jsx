import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";

const InvestmentHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const regno = sessionStorage.getItem("Regno");

    useEffect(() => {
        const fetchWalletReport = async () => {
            if (!regno) {
                setLoading(false);
                setError("Please login to view your investment history");
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const res = await apiClient.get(
                    `/Dashboard/SelfTradingHistory/${regno}`
                );

                if (res.data && res.data.result === "true") {
                    const tradingHistoryData = res.data.response?.tradingHistory || [];
                    setRecords(tradingHistoryData);
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

        fetchWalletReport();
    }, [regno]);

    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.Rdate && row.Rdate.toLowerCase().includes(searchLower)) ||
            (row.remark && row.remark.toLowerCase().includes(searchLower)) ||
            (row.Rkprice && row.Rkprice.toString().toLowerCase().includes(searchLower)) ||
            (row.slabfine && row.slabfine.toString().toLowerCase().includes(searchLower)) ||
            (row.BinaryBuffer && row.BinaryBuffer.toString().toLowerCase().includes(searchLower))
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return dateString.split('T')[0];
    };

    const columns = [
        "Sl.No.",
        "Date",
        "Amount",
        "ROI",
        "Max Caping",
        "Remark"
    ];

    return (
        <div className="Table-container downline-main-wrapper report-container p-2 p-md-4 mb-5">

            {/* ===== HEADER CARD ===== */}
            <div className="dh-header-card">
                <div className="dh-header-icon">
                    <i className="ti ti-chart-line"></i>
                </div>
                <div className="dh-header-texts">
                    <h2>Investment History</h2>
                    <p>View your investment transaction records</p>
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

            {/* Error */}
            {error && (
                <div className="alert alert-danger mb-3">
                    <strong>Error:</strong> {error}
                </div>
            )}

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
                                <td style={{ fontWeight: "500", whiteSpace: "nowrap" }}>
                                    {formatDate(row.Rdate)}
                                </td>
                                <td>
                                    <span className="dh-amount-badge">
                                        ${row.Rkprice || 0}
                                    </span>
                                </td>
                                <td className="dh-roi-value">
                                    {row.slabfine ?? "-"}
                                </td>
                                <td>
                                    <span className="dh-amount-badge">
                                        {row.BinaryBuffer || 0}
                                    </span>
                                </td>
                                <td>
                                    <span className="dh-remark-text">
                                        {row.remark || "-"}
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

export default InvestmentHistory;