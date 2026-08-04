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
    const walletId = userData?.NameAppearOncheque || ""; // Wallet ID from user data

    // Format amount function (for token amount)
    const formatAmount = (amount) => {
        return `${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        })}`;
    };

    // Format date function
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

    // Truncate hash for display
    const truncateHash = (hash) => {
        if (!hash) return "-";
        return hash.length > 20 ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}` : hash;
    };

    // ✅ Fetch Wallet History
    useEffect(() => {
        const fetchWalletHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                // ✅ Using fetch with the API endpoint
                const response = await fetch(
                    `http://gateway.maxedlogic.com/api/v1/WalletHistory?ClientId=40c629c6780143feb3d7&WalletAddress=${walletId}`
                );

                const res = await response.json();

                if (res?.status === true) {
                    // Get data from response - using the exact structure from your API
                    const data = res?.data || [];

                    // All transactions are deposit transactions (based on your API response)
                    setRecords(data);
                } else {
                    console.warn("⚠️ API response error:", res);
                    setRecords([]);
                    setError(res?.message || "No data found");
                }
            } catch (error) {
                console.error("❌ API Error:", error);
                setError(error?.message || "Failed to fetch data");
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        if (walletId) {
            fetchWalletHistory();
        } else {
            console.warn("⚠️ No Wallet ID found in user data");
            setLoading(false);
            setError("Wallet ID not found. Please check user data.");
        }
    }, [walletId]);

    // Filter records based on search term
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

    // Reset to first page when search term or items per page changes
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

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusLower = (status || "").toLowerCase();
        if (statusLower.includes("success")) {
            return "badge bg-success";
        } else if (statusLower.includes("pending") || statusLower.includes("waiting")) {
            return "badge bg-warning";
        } else if (statusLower.includes("failed") || statusLower.includes("rejected") || statusLower.includes("declined")) {
            return "badge bg-danger";
        } else {
            return "badge bg-secondary";
        }
    };

    return (
        <div className="Table-container royalty-main-wrapper mb-5 p-4">
            {/* <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                <h3 className="mb-0">Fund Deposit Status</h3>
                {walletId && (
                    <span className="badge bg-primary">
                        Wallet ID: {walletId}
                    </span>
                )}
            </div> */}

            <div className="d-flex justify-content-between entries-search-bar entries-control mb-3">
                <div className="entries-control">
                    <label>Show entries:</label>
                    <select
                        className="form-select"
                        value={itemsPerPage}
                        onChange={e => setItemsPerPage(Number(e.target.value))}
                    >
                        {[10, 25, 50, 75, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>
                <div className="search-wrapper mt-3">
                    <input
                        className="form-control search-input"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-danger mb-3">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="report-card">
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
                                    {/* ✅ Hash with BSCScan Link */}
                                    {row.hash_key || row.Transfer_hashKey ? (
                                        <a
                                            href={`https://bscscan.com/tx/${row.hash_key || row.Transfer_hashKey}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: '#0d6efd',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                fontSize: '14px'
                                            }}
                                            className="hash-link"
                                        >
                                            {truncateHash(row.hash_key || row.Transfer_hashKey)}
                                            <i className="ti ti-external-link ms-1" style={{ fontSize: '12px' }}></i>
                                        </a>
                                    ) : (
                                        <span style={{ color: '#6c757d', fontSize: '14px' }}>N/A</span>
                                    )}
                                </td>
                                <td style={{ fontSize: '13px' }}>
                                    {row.From_address ? truncateHash(row.From_address) : "-"}
                                </td>
                                <td style={{ fontSize: '13px' }}>
                                    {row.to_address ? truncateHash(row.to_address) : "-"}
                                </td>
                                <td style={{ color: "#10b981", fontWeight: "600" }}>
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
                                {loading ? (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    "No deposit records found"
                                )}
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
    );
};

export default FundDepositStatus;