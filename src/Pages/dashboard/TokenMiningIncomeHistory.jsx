import React, { useState, useEffect } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

const TokenMiningIncomeHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalIncome, setTotalIncome] = useState(0);
    const [incomeTypes, setIncomeTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [isTypesLoaded, setIsTypesLoaded] = useState(false);

    // Pagination state
    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Get regno from localStorage
    const regno = localStorage.getItem('Regno');

    // ✅ URL se type nikaalo on mount
    useEffect(() => {
        console.log("📍 Location changed:", location.pathname, location.search);

        const params = new URLSearchParams(location.search);
        const typeFromUrl = params.get('type');

        console.log("🔍 Raw URL Type:", typeFromUrl);

        if (typeFromUrl) {
            // ✅ Decode karein
            const decodedType = decodeURIComponent(typeFromUrl);
            console.log("✅ Decoded Type:", decodedType);
            setSelectedType(decodedType);
        } else {
            console.log("⚠️ No type in URL, using 'all'");
            setSelectedType('all');
        }
    }, [location.search]);

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
            
            if (data.result === "true" && data.data) {
                setIncomeTypes(data.data);
                console.log("Income Types set:", data.data);
            } else {
                setIncomeTypes([]);
            }
        } catch (err) {
            console.error('Error fetching income types:', err);
            setIncomeTypes([]);
        } finally {
            setIsTypesLoaded(true);
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
        return `    ${parseFloat(amount || 0).toLocaleString(undefined, {
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
            
            // ✅ Agar 'all' nahi hai toh type add karo
            if (selectedType && selectedType !== 'all') {
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

    // ✅ Fetch history when selectedType changes and types are loaded
    useEffect(() => {
        if (isTypesLoaded) {
            fetchTokenMiningHistory();
        }
    }, [pageIndex, itemsPerPage, selectedType, isTypesLoaded]);

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
        "Token",
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
                    <h3 className="mb-0 text-dark">
                        Statement
                        {selectedType && selectedType !== 'all' && (
                            <span style={{
                                color: "#0d6efd",
                                fontSize: "20px",
                                fontWeight: "600",
                                marginLeft: "10px"
                            }}>
                                - {selectedType}
                            </span>
                        )}
                        {selectedType === 'all' && (
                            <span style={{
                                color: "#6c757d",
                                fontSize: "20px",
                                fontWeight: "500",
                                marginLeft: "10px"
                            }}>
                                - All Types
                            </span>
                        )}
                    </h3>
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
                                const newType = e.target.value;
                                console.log("🔄 Manual type change to:", newType);
                                setSelectedType(newType);
                                setPageIndex(1);
                                
                                // ✅ URL update karein
                                if (newType === 'all') {
                                    navigate('/dashboard/TokenMiningIncomeHistory');
                                } else {
                                    navigate(`/dashboard/TokenMiningIncomeHistory?type=${encodeURIComponent(newType)}`);
                                }
                            }}
                            style={{ width: '220px' }}
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
               
                                    <td style={{ color: "#6b7280", fontSize: "13px" }} title={row.Remark || "-"}>
                                        {row.Remark || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    {loading ? (
                                        <div className="d-flex justify-content-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: "30px 0" }}>
                                            <i className="ti ti-database-off" style={{ fontSize: "40px", color: "#ccc", display: "block", marginBottom: "10px" }}></i>
                                            <div style={{ fontSize: "16px", color: "#6c757d" }}>
                                                No records found for <strong style={{ color: "#0d6efd" }}>"{selectedType === 'all' ? 'All Types' : selectedType}"</strong>
                                            </div>
                                            <div style={{ fontSize: "13px", color: "#999", marginTop: "5px" }}>
                                                Try selecting a different income type from the dropdown above
                                            </div>
                                        </div>
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

export default TokenMiningIncomeHistory;