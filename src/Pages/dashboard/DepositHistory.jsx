import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../api/apiClient";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";


const DepositHistory = () => {
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [incomeTypes, setIncomeTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("all");
    const [loading, setLoading] = useState(true);

    const regno = sessionStorage.getItem("Regno") || 1;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const typeFromUrl = queryParams.get('type');
        if (typeFromUrl) {
            setSelectedType(typeFromUrl);
        }
    }, [location.search]);

    const formatAmount = (amount) => {
        return `$${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    useEffect(() => {
        const fetchIncomeTypes = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get("/DepositReport/WalletIncomeType");
                if (res.data && res.data.result === "true") {
                    const typesData = res.data.response?.topupWalletType || [];
                    setIncomeTypes(typesData);
                } else {
                    setIncomeTypes([]);
                }
            } catch (error) {
                console.error("Failed to load dropdown types:", error);
                setIncomeTypes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchIncomeTypes();
    }, []);

    useEffect(() => {
        const fetchDepositHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                let url = `/DepositReport/WalletReport/${regno}`;
                if (selectedType) {
                    url += `?type=${encodeURIComponent(selectedType)}`;
                }

                const res = await apiClient.get(url);

                if (res.data?.result === "true") {
                    const data = res.data.response?.walletData || [];
                    setRecords(data);
                } else {
                    setRecords([]);
                    setError("No data found");
                }
            } catch (error) {
                console.error("API Error:", error.response || error);
                setError(error.response?.data?.message || "Failed to fetch data");
                setRecords([]);
            } finally {
                setLoading(false);
            }
        };

        if (regno) {
            fetchDepositHistory();
        } else {
            setLoading(false);
        }
    }, [regno, selectedType]);

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedType(value);
        setPageIndex(1);
    };

    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.dt?.toLowerCase().includes(searchLower)) ||
            (row.transType?.toLowerCase().includes(searchLower)) ||
            (row.credit?.toString().toLowerCase().includes(searchLower)) ||
            (row.debit?.toString().toLowerCase().includes(searchLower)) ||
            (row.remark?.toLowerCase().includes(searchLower))
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
        "Transaction Type",
        "Credit",
        "Debit",
        "Remark",
    ];

    // Helper: Transaction type ke hisaab se badge color
    const getBadgeClass = (type = "") => {
        const t = type.toLowerCase();
        if (t.includes("fund") || t.includes("transfer")) return "badge-blue";
        if (t.includes("winning") || t.includes("bonus")) return "badge-green";
        if (t.includes("betting") || t.includes("bet")) return "badge-purple";
        if (t.includes("trading")) return "badge-purple";
        if (t.includes("income")) return "badge-green";
        return "badge-blue";
    };

    // Helper: Icon for transaction type
    const getTypeIcon = (type = "") => {
        const t = type.toLowerCase();
        if (t.includes("fund")) return "ti ti-transfer";
        if (t.includes("winning")) return "ti ti-trophy";
        if (t.includes("betting") || t.includes("bet")) return "ti ti-target-arrow";
        if (t.includes("trading")) return "ti ti-chart-candle";
        return "ti ti-coin";
    };

    return (
        <div className="deposit-history-page">

            {/* ===== HEADER CARD ===== */}
        <div className="dh-header-card">
    <div className="dh-header-icon">
        <i className="ti ti-history"></i>
    </div>
    <div className="dh-header-texts">
        <h2>Deposit History</h2>
        <p>View your deposit transaction records</p>
    </div>
</div>

            {/* ===== FILTERS BAR ===== */}
            <div className="dh-filters-bar">
                {/* Show entries */}
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

                {/* Income Type */}
                <div className="dh-filter-item">
                    <label className="dh-filter-label">Income Type:</label>
                    <select
                        className="dh-select"
                        value={selectedType}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="all">{loading ? "Loading types..." : "All"}</option>
                        {!loading && incomeTypes.map((item, index) => (
                            <option key={index} value={item.transType}>
                                {item.transType}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search */}
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

            {/* Error Display */}
            {error && (
                <div className="dh-error-alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* ===== TABLE CARD ===== */}
            <div className="dh-table-card">
                <CustomTable columns={columns} loading={loading}>
                    {currentRecords.length > 0 ? (
                        currentRecords.map((row, index) => (
                            <tr key={index}>
                                <td className="dh-sl-no">
                                    {startIndex + index + 1}
                                </td>
                                <td className="dh-date">
                                    <i className="ti ti-calendar dh-date-icon"></i>
                                    {row.dt || "-"}
                                </td>
                                <td>
                                    <span className={`dh-badge ${getBadgeClass(row.transType)}`}>
                                        <i className={getTypeIcon(row.transType)}></i>
                                        {row.transType || "-"}
                                    </span>
                                </td>
                                <td className="dh-credit">
                                    <i className="ti ti-arrow-up-right"></i>
                                    {row.credit > 0 ? formatAmount(row.credit) : "$0.00"}
                                </td>
                                <td className="dh-debit">
                                    <i className="ti ti-arrow-down-right"></i>
                                    {row.debit > 0 ? formatAmount(row.debit) : "$0.00"}
                                </td>
                                <td className="dh-remark" title={row.remark || "-"}>
                                    {row.remark || "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="dh-empty-msg">
                                {loading ? "Loading..." : "No records found"}
                            </td>
                        </tr>
                    )}
                </CustomTable>

                {/* Pagination */}
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

export default DepositHistory;