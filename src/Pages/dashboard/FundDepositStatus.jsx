import React, { useState, useEffect } from 'react';
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";

const FundDepositStatus = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get user data from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
    const walletId = userData?.NameAppearOncheque || "";

    // Format amount
    const formatAmount = (amount) => {
        return `${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        })}`;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Truncate hash
    const truncateHash = (hash) => {
        if (!hash) return "-";
        return hash.length > 20 ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}` : hash;
    };

    // Fetch Wallet History
    useEffect(() => {
        const fetchWalletHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `http://gateway.maxedlogic.com/api/v1/WalletHistory?ClientId=40c629c6780143feb3d7&WalletAddress=${walletId}`
                );

                const res = await response.json();

                if (res?.status === true) {
                    const data = res?.data || [];
                    setRecords(data);
                } else {
                    setRecords([]);
                    setError(res?.message || "No data found");
                }
            } catch (error) {
                setError(error?.message || "Failed to fetch data");
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        if (walletId) {
            fetchWalletHistory();
        } else {
            setLoading(false);
        }
    }, [walletId]);

    // Filter records
    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.entry_date?.toLowerCase().includes(searchLower)) ||
            (row.hash_key?.toLowerCase().includes(searchLower)) ||
            (row.Transfer_hashKey?.toLowerCase().includes(searchLower)) ||
            (row.From_address?.toLowerCase().includes(searchLower)) ||
            (row.to_address?.toLowerCase().includes(searchLower)) ||
            (row.amount?.toString().toLowerCase().includes(searchLower)) ||
            (row.Status?.toLowerCase().includes(searchLower)) ||
            (row.token?.toLowerCase().includes(searchLower))
        );
    });

    // Pagination logic
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
        "Txn Hash",
        "From",
        "To",
        "Amount",
        "Status"
    ];

    // Status badge class
    const getStatusBadge = (status) => {
        const s = (status || "").toLowerCase();
        if (s.includes("success")) return "fs-badge fs-badge-success";
        if (s.includes("pending") || s.includes("waiting")) return "fs-badge fs-badge-warning";
        if (s.includes("failed") || s.includes("rejected") || s.includes("declined")) return "fs-badge fs-badge-danger";
        return "fs-badge fs-badge-neutral";
    };

    return (
        <div className="Table-container royalty-main-wrapper mb-5 p-4">

            {/* ===== HEADER CARD ===== */}
            <div className="dh-header-card">
                <div className="dh-header-icon">
                    <i className="ti ti-wallet"></i>
                </div>
                <div className="dh-header-texts">
                    <h2>Fund Deposit Status</h2>
                    <p>View your deposit transaction records</p>
                </div>
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
                            <tr key={index}>
                                <td className="text-center">
                                    <div className="sr-no-circle">
                                        {startIndex + index + 1}
                                    </div>
                                </td>
                                <td>{formatDate(row.entry_date)}</td>
                                <td>
                                    {row.hash_key || row.Transfer_hashKey ? (
                                        <a
                                            href={`https://bscscan.com/tx/${row.hash_key || row.Transfer_hashKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hash-link"
                                        >
                                            {truncateHash(row.hash_key || row.Transfer_hashKey)}
                                            <i className="ti ti-external-link ms-1" style={{ fontSize: '12px' }}></i>
                                        </a>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
                                <td className="fs-address">
                                    {row.From_address ? truncateHash(row.From_address) : "-"}
                                </td>
                                <td className="fs-address">
                                    {row.to_address ? truncateHash(row.to_address) : "-"}
                                </td>
                                <td className="fs-amount">
                                    ${formatAmount(row.amount)}
                                </td>
                                <td>
                                    <span className={getStatusBadge(row.Status)}>
                                        {row.Status || "-"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-4">
                                {loading ? "Loading..." : "No deposit records found"}
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
    );
};

export default FundDepositStatus;