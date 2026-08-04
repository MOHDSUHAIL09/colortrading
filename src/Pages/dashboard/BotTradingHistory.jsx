import { useState, useEffect, useRef } from "react";
import apiClient from "../../api/apiClient";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { useUser } from "../../context/UserContext";

const BotTradingHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    // const [totalBalance, setTotalBalance] = useState(0);
    const { userData } = useUser();

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const regno = sessionStorage.getItem("Regno");
    const intervalRef = useRef(null);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return dateString;
        }
    };

    // Format amount function
    const formatAmount = (amount) => {
        return `$${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Get status badge class
    const getStatusBadge = (status) => {
        switch (status) {
            case 1:
                return "bg-success"; // Active/Running
            case 0:
                return "bg-danger"; // Inactive
            default:
                return "bg-secondary";
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return "Open";
            case 0:
                return "Closed";
            case 2:
                return "Closed";
            default:
                return "Closed";
        }
    };


    const fetchDepositHistory = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(
                `/Trading/BotReport`,
                {
                    params: {
                        regno: regno,
                        PageIndex: 1,
                        PageSize: 10000
                    },
                }
            );

            if (res.data?.result === "true") {
                const data = res.data.response?.data || [];
                setRecords(data);

                // Calculate total balance (betAmount + earnings)
                // const balance = data.reduce((sum, item) => {
                //     const betAmount = parseFloat(item.betAmount) || 0;
                //     const earnings = parseFloat(item.TotalEarnings) || 0;
                //     return sum + betAmount + earnings;
                // }, 0);
                // setTotalBalance(balance);
            } else {
                console.warn(" API result is not true");
                setRecords([]);
            }
        } catch (error) {
            console.error(" API Error:", error.response || error);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔄 Interval function to update values (only for Open status)
    const startInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setRecords(prevRecords => {
                return prevRecords.map(record => {
                    // Only update if status is Open (1)
                    if (record.status === 1) {
                        const currentEarnings = parseFloat(record.TotalEarnings) || 0;
                        // const perdayroi = parseFloat(record.perdayroi) || 0;
                        // const betAmount = parseFloat(record.betAmount) || 0;

                        // 🔥 0.000008 increment/decrement per second
                        const increment = 0.000008;

                        // Randomly decide to increase or decrease (50% chance)
                        const shouldIncrease = Math.random() < 0.5;

                        let newEarnings;
                        if (shouldIncrease) {
                            newEarnings = currentEarnings + increment;
                        } else {
                            newEarnings = currentEarnings - increment;
                        }

                        // Also update perdayroi slightly
                        let newPerdayRoi = parseFloat(record.perdayroi) || 0;
                        const roiChange = (Math.random() < 0.5 ? 1 : -1) * 0.0001;
                        newPerdayRoi = newPerdayRoi + roiChange;

                        return {
                            ...record,
                            TotalEarnings: newEarnings,
                            perdayroi: newPerdayRoi
                        };
                    }
                    return record;
                });
            });
        }, 1000); // Every 1 second
    };

    // Stop interval
    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Initial fetch and interval setup
    useEffect(() => {
        if (regno) {
            fetchDepositHistory();
        } else {
            console.warn(" No Regno found");
            setLoading(false);
        }

        // Cleanup interval on unmount
        return () => {
            stopInterval();
        };
    }, [regno]);

    // Start interval automatically when records are loaded
    useEffect(() => {
        if (records.length > 0) {
            startInterval();
        }

        return () => {
            stopInterval();
        };
    }, [records.length]);

    // Filter records
    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.betAmount?.toString().toLowerCase().includes(searchLower)) ||
            (row.currency?.toLowerCase().includes(searchLower)) ||
            (row.entryDate?.toLowerCase().includes(searchLower)) ||
            (row.endtime?.toLowerCase().includes(searchLower)) ||
            (row.slot?.toString().toLowerCase().includes(searchLower)) ||
            (row.currencyRate?.toString().toLowerCase().includes(searchLower)) ||
            (row.status?.toString().toLowerCase().includes(searchLower))
        );
    });

    // Pagination logic
    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when search term or items per page changes
    // useEffect(() => {
    //     setPageIndex(1);
    // }, [searchTerm, itemsPerPage]);

    const columns = [
        "Sl.No.",
        "BotStart Date",
        "BotEnd Date",
        "Amount",
        "Bot Roi/Day",
        "Bot Earn",
        "Currency",
        "Currency Rate",
        "Slot",
        "Type",
        "Status",
    ];

    return (
        <div className="Table-container royalty-main-wrapper mb-5 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                <h3 className="mb-0">Bot Trading History</h3>
            </div>

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

            <div className="report-card">
                <CustomTable columns={columns} loading={loading}>
                    {currentRecords.length > 0 ? (
                        currentRecords.map((row, index) => {
                            const currentEarnings = parseFloat(row.TotalEarnings) || 0;
                            const perdayroi = parseFloat(row.perdayroi) || 0;
                            const betAmount = parseFloat(row.betAmount) || 0;

                            // 🔥 Check if earnings is negative
                            const isEarningsNegative = currentEarnings < 0;
                            const isRoiNegative = perdayroi < 0;

                            return (
                                <tr key={index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td>{formatDate(row.entryDate)}</td>
                                    <td>{formatDate(row.endtime)}</td>


                                    <td style={{ color: "#3b82f6", fontWeight: "600" }}>
                                        {formatAmount(betAmount)}
                                    </td>

                                    {getStatusText(row.status) === "Open" ? (
                                        <>
                                            <td style={{ color: "#3b82f6", fontWeight: "600" }}>
                                                -
                                            </td>
                                            <td style={{
                                                color: isEarningsNegative ? "#dc3545" : "#3b82f6",
                                                fontWeight: "600"
                                            }}>
                                                ${currentEarnings.toFixed(8)}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td style={{
                                                color: isRoiNegative ? "#dc3545" : "#3b82f6",
                                                fontWeight: "600"
                                            }}>
                                                {perdayroi.toFixed(4)}%
                                            </td>
                                            <td style={{
                                                color: isEarningsNegative ? "#dc3545" : "#3b82f6",
                                                fontWeight: "600"
                                            }}>
                                                ${(perdayroi * betAmount / 100).toFixed(4)}
                                            </td>
                                        </>
                                    )}
                                    <td>{row.currency?.toUpperCase() || "-"}</td>
                                    <td>${row.currencyRate || "-"}</td>
                                    <td>{row.slot || "-"} H</td>
                                    <td>{row.predict || "-"}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(row.status)}`}>
                                            {getStatusText(row.status)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-4">
                                {loading ? "Loading..." : "No records found"}
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

export default BotTradingHistory;