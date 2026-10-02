import React from 'react';


const Pagination = ({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange
}) => {

  if (totalPages <= 1) return null;

  const getPaginationItems = () => {
    if (totalRecords === 0 || totalPages === 1) return [1];

    const pages = [1];
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');
    if (!pages.includes(totalPages)) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="custom-pagination">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="custom-page-btn custom-page-nav"
        aria-label="Previous page"
      >
        <i className="ti ti-chevron-left"></i>
      </button>

      {/* Page Numbers */}
      {getPaginationItems().map((page, index) => (
        <button
          key={index}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
          className={`custom-page-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="custom-page-btn custom-page-nav"
        aria-label="Next page"
      >
        <i className="ti ti-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;