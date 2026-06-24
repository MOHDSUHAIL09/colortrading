import React, { useState, useEffect } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TokenMiningHistory = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalIncome, setTotalIncome] = useState(0);
    const [incomeTypes, setIncomeTypes] = useState([]); // For dropdown

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedType, setSelectedType] = useState('all');

    // Get regno from localStorage
    const regno = localStorage.getItem('Regno');

    // Fetch Income Types from API
    const fetchIncomeTypes = async () => {
        try {
            const response = await fetch(
                'https://api.apexmindai.in/AllMiningIncome',
                {
                    method: 'GET',
                    headers: {
                        'accept': '*/*',
                    }
                }
            );
            const data = await response.json();
            console.log("Income Types Response:", data);
            
            // Fix: Directly set data.data because API returns array in data
            if (data.result === "true" && data.data) {
                setIncomeTypes(data.data); // data.data is already an array
                console.log("Income Types set:", data.data);
            } else {
                setIncomeTypes([]);
            }
        } catch (err) {
            console.error('Error fetching income types:', err);
            setIncomeTypes([]);
        }
    };

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

    // Fetch Token Mining Income History
    const fetchTokenMiningHistory = async () => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            let url = `https://api.apexmindai.in/TokenMiningIncomeHistoryAsync?regno=${regno}&pageIndex=${pageIndex}&pageSize=${itemsPerPage}`;
            
            if (selectedType !== 'all') {
                url += `&type=${encodeURIComponent(selectedType)}`;
            }
            
            console.log("Fetching URL:", url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                }
            });

            const data = await response.json();
            console.log("History API Response:", data);

            if (data.result === "true") {
                const historyData = data.data?.data || [];
                setRecords(historyData);
                
                const total = historyData.reduce((sum, item) => {
                    return sum + (parseFloat(item.mn_Amount) || parseFloat(item.amount) || 0);
                }, 0);
                setTotalIncome(total);
            } else {
                toast.error(data.message || 'Failed to fetch history');
                setRecords([]);
                setTotalIncome(0);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            toast.error(err.message || 'Something went wrong');
            setRecords([]);
            setTotalIncome(0);
        } finally {
            setLoading(false);
        }
    };

    // Fetch income types on component mount
    useEffect(() => {
        fetchIncomeTypes();
    }, []);

    // Fetch history when dependencies change
    useEffect(() => {
        fetchTokenMiningHistory();
    }, [pageIndex, itemsPerPage, selectedType]);

    // Filter records based on search term
    const filteredRecords = records.filter((row) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (row.EntryDate?.toLowerCase().includes(searchLower)) ||
            (row.dt_DueDate?.toLowerCase().includes(searchLower)) ||
            (row.mn_Amount?.toString().toLowerCase().includes(searchLower)) ||
            (row.IncomeType?.toLowerCase().includes(searchLower)) ||
            (row.Remark?.toLowerCase().includes(searchLower)) ||
            (row.bt_Status?.toString().toLowerCase().includes(searchLower))
        );
    });

    // Pagination logic
    const totalItems = filteredRecords.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setPageIndex(1);
    }, [searchTerm, itemsPerPage, selectedType]);

    const columns = [
        "Sl.No.",
        "Date",
        "Income Type",
        "Amount",
        "Status",
        "Remark",
    ];

    const getStatusLabel = (status) => {
        if (status === 0) return 'Pending';
        if (status === 1) return 'Completed';
        if (status === 2) return 'Failed';
        return status || 'N/A';
    };

    const getStatusClass = (status) => {
        if (status === 1) return 'status-completed';
        if (status === 0) return 'status-pending';
        if (status === 2) return 'status-failed';
        return 'status-default';
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="Table-container royalty-main-wrapper mb-5 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
                    <h3 className="mb-0 text-dark">Token Mining History</h3>
                    {totalIncome > 0 && (
                        <div className="total-income-badge">
                            <span className="text-dark">Total Income: </span>
                            <span style={{ color: "#10b981", fontWeight: "bold", fontSize: "18px" }}>
                                {formatAmount(totalIncome)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Filters Row */}
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3 entries-search-bar">
                    {/* Income Type Filter */}
                    <div className="entries-control d-flex align-items-center gap-2">
                        <label className="text-dark mb-0">Income Type:</label>
                        <select 
                            className="form-select" 
                            value={selectedType} 
                            onChange={e => {
                                setSelectedType(e.target.value);
                                setPageIndex(1);
                            }}
                            style={{ width: '200px' }}
                        >
                            <option value="all">All Types</option>
                            {incomeTypes.length > 0 ? (
                                incomeTypes.map((item, index) => (
                                    <option key={index} value={item.incometype}>
                                        {item.incometype}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>Loading types...</option>
                            )}
                        </select>
                    </div>

                    {/* Show Entries */}
                    {/* <div className="entries-control d-flex align-items-center gap-2">
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
                    </div> */}

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
                                <tr key={row.in_InsID || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td>
                                        {formatDate(row.EntryDate || row.dt_DueDate)}
                                    </td>
                                    <td style={{ color: "#6b7280", fontSize: "13px" }}>
                                        {row.IncomeType || "-"}
                                    </td>
                                    <td style={{ color: "#10b981", fontWeight: "600" }}>
                                        {formatAmount(row.mn_Amount || "00")}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(row.bt_Status)}`}>
                                            {getStatusLabel(row.bt_Status)}
                                        </span>
                                    </td>
                                    <td style={{ color: "#6b7280", fontSize: "13px" }} title={row.Remark || "-"}>
                                        {row.Remark || "-"}
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

            <style jsx>{`
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 500;
                    display: inline-block;
                }
                .status-completed {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                .status-pending {
                    background-color: #fef3c7;
                    color: #92400e;
                }
                .status-failed {
                    background-color: #fee2e2;
                    color: #991b1b;
                }
                .status-default {
                    background-color: #e5e7eb;
                    color: #374151;
                }
                .total-income-badge {
                    background: #f0fdf4;
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: 1px solid #bbf7d0;
                }
            `}</style>
        </>
    );
};

export default TokenMiningHistory;