// File: src/components/BotTradingHistory.jsx

import { useState, useEffect, useRef } from "react";
import CustomTable from "../../Componenets/ui/customtable/CustomTable";
import Pagination from "../../Componenets/ui/pagination/Pagination";
import apiClient from "../../api/apiClient";

const BotTradingHistory = () => {
  const [records, setRecords] = useState([]);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const regno = sessionStorage.getItem("Regno");
  const intervalRef = useRef(null);

  // ===================== FETCH BOT EARNINGS =====================
  const fetchBotEarnings = async () => {
    if (!regno) return;

    try {
      setLoading(true);

      const response = await apiClient.get("/Trading/BotReport", {
        params: {
          regno: regno,
          PageIndex: 1,
          PageSize: 10000,
        },
      });

      if (response.data?.result === "true") {
        const data = response.data.response?.data || [];
        setRecords(data);

        const total = data.reduce((sum, item) => {
          return sum + (parseFloat(item.TotalEarnings) || 0);
        }, 0);
        setTotalEarnings(total);

        const openRecord = data.find((item) => item.status === 1);
        if (openRecord) {
          setCurrentEarnings(parseFloat(openRecord.TotalEarnings) || 0);
        } else {
          setCurrentEarnings(total);
        }
      } else {
        setRecords([]);
        setCurrentEarnings(0);
        setTotalEarnings(0);
      }
    } catch (error) {
      console.error("Bot earnings fetch error:", error);
      setRecords([]);
      setCurrentEarnings(0);
      setTotalEarnings(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (regno) {
      fetchBotEarnings();
    }
  }, [regno]);

  // ===================== LIVE EARNINGS INTERVAL =====================
  const startInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setRecords((prevRecords) => {
        const updatedRecords = prevRecords.map((record) => {
          if (record.status === 1) {
            const currentEarn = parseFloat(record.TotalEarnings) || 0;
            const increment = (record.PerSecondEarnings);
            const shouldIncrease = Math.random() < 0.5;
            const newEarnings = shouldIncrease
              ? currentEarn + increment
              : currentEarn - increment;
            return { ...record, TotalEarnings: newEarnings };
          }
          return record;
        });

        const openRecord = updatedRecords.find((item) => item.status === 1);
        if (openRecord) {
          setCurrentEarnings(parseFloat(openRecord.TotalEarnings) || 0);
        }

        const total = updatedRecords.reduce((sum, item) => {
          return sum + (parseFloat(item.TotalEarnings) || 0);
        }, 0);
        setTotalEarnings(total);

        return updatedRecords;
      });
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (records.length > 0) {
      startInterval();
    }
    return () => stopInterval();
  }, [records.length]);

  // ===================== FORMAT =====================
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ✅ Status badge - navy theme
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1: return "bt-badge bt-badge-success";
      case 0: return "bt-badge bt-badge-danger";
      default: return "bt-badge bt-badge-neutral";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return "Open";
      case 0: return "Closed";
      case 2: return "Closed";
      default: return "Closed";
    }
  };

  // ===================== FILTER & PAGINATION =====================
  const filteredRecords = records.filter((row) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      row.betAmount?.toString().toLowerCase().includes(searchLower) ||
      row.currency?.toLowerCase().includes(searchLower) ||
      row.entryDate?.toLowerCase().includes(searchLower) ||
      row.endtime?.toLowerCase().includes(searchLower) ||
      row.slot?.toString().toLowerCase().includes(searchLower) ||
      row.currencyRate?.toString().toLowerCase().includes(searchLower) ||
      row.status?.toString().toLowerCase().includes(searchLower)
    );
  });

  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

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

  // ===================== RENDER =====================
  return (
    <div className="Table-container royalty-main-wrapper mb-5 p-4">

      {/* ===== HEADER CARD ===== */}
      <div className="dh-header-card">
        <div className="dh-header-icon">
          <i className="ti ti-robot"></i>
        </div>
        <div className="dh-header-texts">
          <h2>Bot Trading History</h2>
          <p>View your bot trading transaction records</p>
        </div>
      </div>

      {/* ===== FILTERS BAR ===== */}
      <div className="dh-filters-bar">
        <div className="dh-filter-item">
          <label className="dh-filter-label">Show entries:</label>
          <select
            className="dh-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 75, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
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
            currentRecords.map((row, index) => {
              const currentEarn = parseFloat(row.TotalEarnings) || 0;
              const perdayroi = parseFloat(row.perdayroi) || 0;
              const betAmount = parseFloat(row.betAmount) || 0;

              const isEarningsNegative = currentEarn < 0;
              const isRoiNegative = perdayroi < 0;

              return (
                <tr key={index}>
                  <td className="text-center">
                    <div className="sr-no-circle">{startIndex + index + 1}</div>
                  </td>
                  <td className="bt-date">{formatDate(row.entryDate)}</td>
                  <td className="bt-date">{formatDate(row.endtime)}</td>
                  <td className="bt-amount">
                    {formatAmount(betAmount)}
                  </td>

                  {getStatusText(row.status) === "Open" ? (
                    <>
                      <td className="bt-amount">-</td>
                      <td className={isEarningsNegative ? "bt-earn-negative" : "bt-earn-positive"}>
                        ${currentEarn.toFixed(8)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={isRoiNegative ? "bt-earn-negative" : "bt-earn-positive"}>
                        {perdayroi.toFixed(4)}%
                      </td>
                      <td className={isEarningsNegative ? "bt-earn-negative" : "bt-earn-positive"}>
                        ${((perdayroi * betAmount) / 100).toFixed(4)}
                      </td>
                    </>
                  )}
                  <td className="bt-currency">{row.currency?.toUpperCase() || "-"}</td>
                  <td className="bt-rate">${row.currencyRate || "-"}</td>
                  <td className="bt-slot">{row.slot || "-"} H</td>
                  <td className="bt-type">{row.predict || "-"}</td>
                  <td>
                    <span className={getStatusBadgeClass(row.status)}>
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