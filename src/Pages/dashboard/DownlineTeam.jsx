import { useState, useEffect } from 'react';
import CustomTable from '../../Componenets/ui/customtable/CustomTable';
import Pagination from '../../Componenets/ui/pagination/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../api/apiClient';


const DownlineTeam = () => {
  const [loading, setLoading] = useState(false);
  const [downlineData, setDownlineData] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const [totalBusiness, setTotalBusiness] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [findlvl, setFindlvl] = useState(1);
  const [levelOptions] = useState([...Array(10).keys()].map(i => i + 1));
  const [pageSize] = useState(10);

  const regno = sessionStorage.getItem('Regno');

  const columns = [
    "S.No.",
    "Downline Info",
    "Sponsor",
    "Invested Amount",
    "Status",
  ];

  const formatAmount = (amount) => {
    return `$${parseFloat(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // ===== Status Badge (navy theme) =====
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <span className="dl-badge dl-badge-success">Active</span>;
      case 'inactive':
        return <span className="dl-badge dl-badge-danger">Inactive</span>;
      default:
        return <span className="dl-badge dl-badge-neutral">{status || 'Unknown'}</span>;
    }
  };

  const fetchDownlineTeam = async () => {
    if (!regno) {
      toast.error('Registration number not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(
        '/Dashboard/DownLineTeam',
        {
          mregno: parseInt(regno),
          findlvl: findlvl,
          pageIndex: currentPage,
          pageSize: pageSize
        },
      );

      const data = response.data;

      if (data.result === "true" || data.result === true) {
        const teamData = data.response?.data || [];
        const totalCount = data.response?.recordCount || teamData.length;
        const totalBiz = data.response?.totalBusiness || 0;

        setDownlineData(teamData);
        setRecordCount(totalCount);
        setTotalBusiness(totalBiz);
      } else {
        toast.error(data.message || 'Failed to fetch downline team');
        setDownlineData([]);
        setRecordCount(0);
        setTotalBusiness(0);
      }
    } catch (error) {
      console.error("Error fetching downline team:", error);

      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Something went wrong';
      toast.error(errorMessage);

      setDownlineData([]);
      setRecordCount(0);
      setTotalBusiness(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownlineTeam();
  }, [currentPage, findlvl, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLevelChange = (e) => {
    setFindlvl(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(recordCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="Table-container royalty-main-wrapper mb-5 p-4">

        {/* ===== HEADER CARD ===== */}
        <div className="dh-header-card">
          <div className="dh-header-icon">
            <i className="ti ti-users-group"></i>
          </div>
          <div className="dh-header-texts">
            <h2>Downline Team</h2>
            <p>View your team members and their details</p>
          </div>
        </div>

        {/* ===== FILTERS + SUMMARY BAR ===== */}
        <div className="dh-filters-bar dl-filters-bar">
          {/* Level Filter */}
          <div className="dh-filter-item">
            <label className="dh-filter-label">Select Level:</label>
            <select
              className="dh-select"
              value={findlvl}
              onChange={handleLevelChange}
            >
              {levelOptions.map(level => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== TABLE CARD ===== */}
        <div className="dh-table-card">
          <CustomTable
            columns={columns}
            loading={loading}
            emptyMessage="No downline members found"
          >
            {downlineData.map((item, index) => (
              <tr key={item.regno || index}>
                <td className="text-center">
                  <div className="sr-no-circle">
                    {startIndex + index + 1}
                  </div>
                </td>
                <td>
                  <div className="dl-info-cell">
                    <span className="dl-name">{item.Name || '-'}</span>
                  </div>
                         <span className="dl-loginid">{item.loginid || '-'}</span>
                </td>
                <td>
                  <div className="dl-info-cell">
                    <span className="dl-sponsor">{item.Sponsor || '-'}</span>
                  </div>
                </td>
                <td>
                  <span className="dl-amount">
                    {formatAmount(item.kitPrice || item.Stake)}
                  </span>
                </td>
                <td>
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </CustomTable>

          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={recordCount}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DownlineTeam;