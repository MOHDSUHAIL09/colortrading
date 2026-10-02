import React, { useState, useEffect } from "react";
import CustomTable from "../../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from "../../../api/apiClient";

const SocialTaskReport = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalRecords, setTotalRecords] = useState(0);

    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [transtype, setTranstype] = useState('All');

    const regno = sessionStorage.getItem('Regno');

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

    const fetchSocialTaskReport = async () => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get(
                `/Dashboard/SocialTaskReport?regno=${regno}&transtype=${transtype}&pageIndex=${pageIndex}&pageSize=${itemsPerPage}`);

            const data = response.data;

            if (data.result === "true") {
                const historyData = data.response?.data || [];
                setRecords(historyData);
                setTotalRecords(data.response?.recordCount || 0);
            } else {
                toast.error(data.message || 'Failed to fetch report');
                setRecords([]);
                setTotalRecords(0);
            }
        } catch (err) {
            console.error('Error fetching report:', err);
            toast.error(err.message || 'Something went wrong');
            setRecords([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSocialTaskReport();
    }, [pageIndex, itemsPerPage, transtype]);

    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.AppName?.toLowerCase().includes(searchLower)) ||
            (row.Url?.toLowerCase().includes(searchLower)) ||
            (row.Percentage?.toString().toLowerCase().includes(searchLower)) ||
            (row.status?.toLowerCase().includes(searchLower)) ||
            (row.EntryDate?.toLowerCase().includes(searchLower))
        );
    });

    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setPageIndex(1);
    }, [searchTerm, itemsPerPage, transtype]);

    const columns = [
        "Sl.No.",
        "App Name",
        "URL Link",
        "Percentage",
        "Entry Date",
        "Status",
    ];

    // ===== Status Badge (navy theme) =====
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <span className="stb-badge stb-badge-success">✓ Completed</span>;
            case 'pending':
                return <span className="stb-badge stb-badge-warning">Pending</span>;
            case 'failed':
                return <span className="stb-badge stb-badge-danger">✕ Failed</span>;
            default:
                return <span className="stb-badge stb-badge-neutral">{status || 'Pending'}</span>;
        }
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="Table-container royalty-main-wrapper mb-5 p-4">

                {/* ===== HEADER CARD ===== */}
                <div className="dh-header-card">
                    <div className="dh-header-icon">
                        <i className="ti ti-brand-instagram"></i>
                    </div>
                    <div className="dh-header-texts">
                        <h2>Social Task Report</h2>
                        <p>View your social media task history</p>
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
                                <tr key={row.RowNumber || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <strong className="stb-app-name">{row.AppName || '-'}</strong>
                                    </td>
                                    <td>
                                        <a
                                            href={row.Url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="stb-url-link"
                                            title={row.Url || "-"}
                                        >
                                            {row.Url?.length > 50 ? row.Url.substring(0, 50) + '...' : row.Url || '-'}
                                        </a>
                                    </td>
                                    <td className="stb-percentage">
                                        {row.Percentage || 0}%
                                    </td>
                                    <td className="stb-date">
                                        {formatDate(row.EntryDate)}
                                    </td>
                                    <td>
                                        {getStatusBadge(row.status)}
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

export default SocialTaskReport;