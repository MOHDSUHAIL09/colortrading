import React, { useState, useEffect } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from "../../api/apiClient";

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

    const [pageIndex, setPageIndex] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const regno = sessionStorage.getItem('Regno');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const typeFromUrl = params.get('type');
        if (typeFromUrl) {
            const decodedType = decodeURIComponent(typeFromUrl);
            setSelectedType(decodedType);
        } else {
            setSelectedType('all');
        }
    }, [location.search]);

    const fetchIncomeTypes = async () => {
        try {
            const response = await apiClient.get('/Token/AllMiningIncome');
            const data = response.data;
            if (data.result === "true" && data.data) {
                setIncomeTypes(data.data);
            } else {
                setIncomeTypes([]);
            }
        } catch (err) {
            console.error('Error fetching income types:', err);
            toast.error('Failed to load income types');
            setIncomeTypes([]);
        } finally {
            setIsTypesLoaded(true);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    };

    const formatAmount = (amount) => {
        return `$${parseFloat(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const fetchTokenMiningHistory = async () => {
        if (!regno) {
            toast.error('Registration number not found');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            let url = `/Token/TokenMiningIncomeHistoryAsync?regno=${regno}&pageIndex=${pageIndex}&pageSize=${itemsPerPage}`;
            if (selectedType) {
                url += `&type=${encodeURIComponent(selectedType)}`;
            }

            const response = await apiClient.get(url);
            const data = response.data;

            if (data.result === "true" || data.result === true) {
                const historyData = data.data?.data || [];
                const totalRecords = data.data?.totalRecords || 0;

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
            const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
            toast.error(errorMsg);
            setRecords([]);
            setTotalIncome(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomeTypes();
    }, []);

    useEffect(() => {
        if (isTypesLoaded) {
            fetchTokenMiningHistory();
        }
    }, [pageIndex, itemsPerPage, selectedType, isTypesLoaded]);

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
        "Credit",
        "Debit",
        "Remark",
    ];

    return (
        <>
            <ToastContainer position="top-right" />
            <div className="Table-container royalty-main-wrapper mb-5 p-4">

                {/* ===== HEADER CARD ===== */}
                <div className="dh-header-card">
                    <div className="dh-header-icon">
                        <i className="ti ti-report-money"></i>
                    </div>
                    <div className="dh-header-texts">
                        <h2>
                            Statement
                            {selectedType && selectedType !== 'all' && (
                                <span className="tmh-type-label"> - {selectedType}</span>
                            )}
                            {selectedType === 'all' && (
                                <span className="tmh-type-label-muted"> - All Types</span>
                            )}
                        </h2>
                        <p>View your token mining income records</p>
                    </div>
                </div>

                {/* ===== FILTERS BAR ===== */}
                <div className="dh-filters-bar">
                    <div className="dh-filter-item">
                        <label className="dh-filter-label">Income Type:</label>
                        <select
                            className="dh-select"
                            value={selectedType}
                            onChange={e => {
                                const newType = e.target.value;
                                setSelectedType(newType);
                                setPageIndex(1);

                                if (newType === 'all') {
                                    navigate('/dashboard/TokenMiningIncomeHistory');
                                } else {
                                    navigate(`/dashboard/TokenMiningIncomeHistory?type=${encodeURIComponent(newType)}`);
                                }
                            }}
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
                                <tr key={row.in_InsID || index}>
                                    <td className="text-center">
                                        <div className="sr-no-circle">
                                            {startIndex + index + 1}
                                        </div>
                                    </td>
                                    <td className="tmh-date">
                                        {formatDate(row.EntryDate || row.dt_DueDate)}
                                    </td>
                                    <td className="tmh-income-type">
                                        {row.IncomeType || "-"}
                                    </td>
                                    <td className="tmh-credit">
                                        {formatAmount(row.mn_Amount || 0)}
                                    </td>
                                    <td className="tmh-debit">
                                        {formatAmount(row.debit || 0)}
                                    </td>
                                    <td className="tmh-remark" title={row.Remark || "-"}>
                                        {row.Remark || "-"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    {loading ? (
                                        <div className="d-flex justify-content-center">
                                            <div className="tmh-spinner" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="tmh-empty-state">
                                            <i className="ti ti-database-off"></i>
                                            <div className="tmh-empty-title">
                                                No records found for <strong>"{selectedType === 'all' ? 'All Types' : selectedType}"</strong>
                                            </div>
                                            <div className="tmh-empty-hint">
                                                Try selecting a different income type from the dropdown above
                                            </div>
                                        </div>
                                    )}
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

export default TokenMiningIncomeHistory;