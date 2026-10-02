import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import apiClient from '../../../api/apiClient';
import CustomTable from '../../../Componenets/ui/customtable/CustomTable';
import Pagination from '../../../Componenets/ui/pagination/Pagination';
import toast from 'react-hot-toast';


const Support = () => {
  const navigate = useNavigate();
  const { user, userData, refreshData } = useUser();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', ticketType: '', messege: '' });
  const [submitting, setSubmitting] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const pageSize = 10;

  const getRegNo = () => userData?.regno || user?.Regno || user?.regno || sessionStorage.getItem('regno') || '1';

  const getLoginId = () => {
    if (userData?.me) return userData.me;
    if (user?.loginid) return user.loginid;
    const stored = sessionStorage.getItem('userData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.me) return parsed.me;
        if (parsed.loginid) return parsed.loginid;
      } catch { }
    }
    return 'india';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'numeric', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
      });
    } catch { return dateString; }
  };

  const fetchTickets = async (page = 1) => {
    const regNo = getRegNo();
    setLoading(true);
    try {
      const response = await apiClient.get('/Dashboard/TicketList', {
        params: {
          PageIndex: page,
          PageSize: pageSize,
          RegNo: regNo,
          PaymentMode: activeFilter
        }
      });

      const data = response.data;

      if (data?.result === "true" || data?.result === true) {
        const responseData = data.response;
        const ticketData = responseData?.data || [];
        const recordCount = responseData?.recordCount || 0;

        const formatted = ticketData.map(item => ({
          id: item.MsgId,
          ticketId: `FX${item.MsgId}`,
          date: formatDate(item.MsgDate),
          type: item.MsgType || 'N/A',
          subject: item.MsgSubject || 'VIEW',
          status: item.status || 'Pending',
          message: item.Message || item.Msg || 'No message provided'
        }));

        setTickets(formatted);
        setTotalRecords(recordCount);
      } else {
        setTickets([]);
        setTotalRecords(0);
        toast.error(data?.message || 'Failed to fetch tickets');
      }
    } catch (err) {
      console.error('API Error:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch tickets');
      setTickets([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(pageIndex);
  }, [pageIndex, activeFilter]);

  const createTicket = async (ticketData) => {
    const loginId = getLoginId();
    const regNo = getRegNo();
    setSubmitting(true);
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('From', regNo);
      formDataPayload.append('Subject', ticketData.subject);

      let messageType = ticketData.ticketType;
      if (messageType === 'withdrawal') messageType = 'withdraw';
      formDataPayload.append('MessageType', messageType);
      formDataPayload.append('LoginId', loginId);
      formDataPayload.append('Message', ticketData.messege || '');
      if (selectedImage) formDataPayload.append('TicketImgage', selectedImage);

      const response = await apiClient.post('/Dashboard/CreateTicket', formDataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.result === "true" || response.data?.result === true) {
        const responseData = response.data.response;
        if (responseData?.success) {
          toast.success(responseData?.message || 'Ticket created successfully!');
          await fetchTickets(pageIndex);
          if (refreshData) refreshData();
          setShowModal(false);
          setFormData({ subject: '', ticketType: '', messege: '' });
          setSelectedImage(null);
        } else {
          toast.error(responseData?.message || 'Failed to create ticket');
        }
      } else {
        toast.error(response.data?.message || 'Failed to create ticket');
      }
    } catch (err) {
      console.error('Create Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ticketType) return toast.error('Please select ticket type');
    if (!formData.subject.trim()) return toast.error('Please enter subject');
    createTicket(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setSelectedImage(e.target.files[0]);
      toast.success(`Image selected: ${e.target.files[0].name}`);
    }
  };

  const handleViewTicket = (ticket) => {
    navigate(`/dashboard/supporthelp/${ticket.id}`, { state: { ticket } });
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  const getSerialNo = (index) => {
    return (pageIndex - 1) * pageSize + index + 1;
  };

  const getTicketTypeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'withdraw':
      case 'withdrawal': return 'sup-badge-danger';
      case 'income': return 'sup-badge-success';
      case 'deposit': return 'sup-badge-primary';
      case 'purchase_bot': return 'sup-badge-warning';
      case 'profile': return 'sup-badge-info';
      case 'not w': return 'sup-badge-neutral';
      default: return 'sup-badge-neutral';
    }
  };

  const getStatusClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('pending')) return 'sup-badge-warning';
    if (s.includes('closed') || s.includes('resolved')) return 'sup-badge-success';
    if (s.includes('open')) return 'sup-badge-primary';
    return 'sup-badge-success';
  };

  return (
    <div className="sup-page">

      {/* ===== HEADER CARD ===== */}
      <div className="dh-header-card">
        <div className="dh-header-icon">
          <i className="ti ti-ticket"></i>
        </div>
        <div className="dh-header-texts">
          <h2>Ticket List</h2>
          <p>Manage your support tickets and requests</p>
        </div>


      {/* ===== TOP BAR — Create Button ===== */}
      <div className="sup-topbar">
        <button className="sup-create-btn" onClick={() => setShowModal(true)}>
          <i className="ti ti-plus"></i>
          <span>Create New Ticket</span>
        </button>
      </div>

      </div>



      {/* ===== TABLE CARD ===== */}
      <div className="dh-table-card">
        <CustomTable
          columns={["S.NO.", "DATE", "TICKET ID", "TICKET TYPE", "SUBJECT", "STATUS"]}
          loading={loading}
          emptyMessage="No tickets found. Create your first ticket!"
        >
          {tickets.map((ticket, index) => (
            <tr
              key={ticket.id}
              onClick={() => handleViewTicket(ticket)}
              style={{ cursor: 'pointer' }}
            >
              <td className="text-center">
                <div className="sr-no-circle">
                  {String(getSerialNo(index)).padStart(2, '0')}
                </div>
              </td>
              <td className="sup-date">{ticket.date}</td>
              <td>
                <span className="sup-ticket-id">{ticket.ticketId}</span>
              </td>
              <td>
                <span className={`sup-badge ${getTicketTypeClass(ticket.type)}`}>
                  {ticket.type}
                </span>
              </td>
              <td className="sup-subject" title={ticket.subject}>
                {ticket.subject}
              </td>
              <td>
                <span className={`sup-badge ${getStatusClass(ticket.status)}`}>
                  {ticket.status || 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </CustomTable>

        {totalPages > 1 && (
          <Pagination
            currentPage={pageIndex}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setPageIndex}
          />
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="sup-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sup-modal" onClick={(e) => e.stopPropagation()}>

            {/* Top gradient bar */}
            <div className="sup-modal-topbar"></div>

            {/* Modal Header */}
            <div className="sup-modal-header">
              <div className="sup-modal-title-wrap">
                <span className="sup-modal-title-icon">
                  <i className="ti ti-ticket"></i>
                </span>
                <h4>Create New Ticket</h4>
              </div>
              <button className="sup-modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="sup-modal-body">

                {/* Ticket Type */}
                <div className="sup-form-group">
                  <label className="sup-label">
                    <i className="ti ti-category"></i>
                    Ticket Type <span className="sup-required">*</span>
                  </label>
                  <select
                    name="ticketType"
                    value={formData.ticketType}
                    onChange={handleInputChange}
                    className="sup-select"
                    required
                  >
                    <option value="">-- Select Message Type --</option>
                    <option value="income">Income</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="deposit">Deposit</option>
                    <option value="purchase_bot">Purchase BOT</option>
                    <option value="profile">Profile</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="sup-form-group">
                  <label className="sup-label">
                    <i className="ti ti-edit"></i>
                    Subject <span className="sup-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief summary of your issue"
                    className="sup-input"
                    required
                  />
                </div>

                {/* Message */}
                <div className="sup-form-group">
                  <label className="sup-label">
                    <i className="ti ti-message"></i>
                    Message <span className="sup-required">*</span>
                  </label>
                  <textarea
                    name="messege"
                    value={formData.messege}
                    onChange={handleInputChange}
                    placeholder="Describe your issue in detail..."
                    rows="5"
                    className="sup-textarea"
                    required
                  />
                </div>

                {/* Attachment */}
                <div className="sup-form-group">
                  <label className="sup-label">
                    <i className="ti ti-paperclip"></i>
                    Attachment (Optional)
                  </label>
                  <div
                    className="sup-upload-box"
                    onClick={() => document.getElementById('file-upload-support').click()}
                  >
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      id="file-upload-support"
                      style={{ display: 'none' }}
                    />
                    <div className="sup-upload-icon">
                      <i className="ti ti-cloud-upload"></i>
                    </div>
                    <p className="sup-upload-text">Click to upload or drag & drop</p>
                    <small className="sup-upload-hint">PNG, JPG, GIF up to 5MB</small>
                  </div>

                  {selectedImage && (
                    <div className="sup-file-preview">
                      <div className="sup-file-info">
                        <span className="sup-file-icon">
                          <i className="ti ti-file"></i>
                        </span>
                        <div>
                          <div className="sup-file-name">{selectedImage.name}</div>
                          <div className="sup-file-size">
                            {(selectedImage.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="sup-file-remove"
                      >
                        <i className="ti ti-trash"></i> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sup-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="sup-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="sup-btn-submit"
                >
                  {submitting ? (
                    <>
                      <span className="sup-spinner"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-send"></i>
                      Create Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;