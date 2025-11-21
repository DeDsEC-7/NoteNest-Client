// components/shared/PaginationControl.jsx
import { useState, useEffect } from "react";

const PaginationControl = ({ 
  pagination, 
  onPageChange, 
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  className = "",
  showItemsPerPage = true,
  showPageInfo = true,
  showPageNumbers = true
}) => {
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(pagination?.limit || 10);

  // Sync with parent pagination
  useEffect(() => {
    if (pagination?.limit && pagination.limit !== currentItemsPerPage) {
      setCurrentItemsPerPage(pagination.limit);
    }
  }, [pagination?.limit]);

  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, totalItems, hasPrev, hasNext } = pagination;

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit) => {
    setCurrentItemsPerPage(newLimit);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newLimit);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/50 rounded-xl border border-primary-200 ${className}`}>
      {/* Items per page selector */}
      {showItemsPerPage && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-typo-muted whitespace-nowrap">Show:</span>
          <select
            value={currentItemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-primary-300 rounded-md bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-typo-muted whitespace-nowrap">per page</span>
        </div>
      )}

      {/* Page info */}
      {showPageInfo && (
        <div className="text-sm text-typo-muted text-center sm:text-left">
          <span className="whitespace-nowrap">
            Page {page} of {totalPages}
          </span>
          {totalItems > 0 && (
            <span className="ml-2 whitespace-nowrap">
              ({totalItems.toLocaleString()} total items)
            </span>
          )}
        </div>
      )}

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className={`
            px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
            flex items-center gap-1 whitespace-nowrap
            ${hasPrev
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Page numbers */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {/* First page */}
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="w-8 h-8 rounded-md text-sm transition-all duration-200 bg-white text-typo-secondary hover:bg-primary-100 border border-primary-200 hover:border-primary-300"
                >
                  1
                </button>
                {pageNumbers[0] > 2 && (
                  <span className="px-1 text-typo-muted">...</span>
                )}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers.map(pageNum => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`
                  w-8 h-8 rounded-md text-sm font-medium transition-all duration-200
                  ${page === pageNum
                    ? 'bg-primary-500 text-white shadow-md scale-105'
                    : 'bg-white text-typo-secondary hover:bg-primary-100 border border-primary-200 hover:border-primary-300'
                  }
                `}
                aria-label={`Go to page ${pageNum}`}
                aria-current={page === pageNum ? 'page' : undefined}
              >
                {pageNum}
              </button>
            ))}

            {/* Last page */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-1 text-typo-muted">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="w-8 h-8 rounded-md text-sm transition-all duration-200 bg-white text-typo-secondary hover:bg-primary-100 border border-primary-200 hover:border-primary-300"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className={`
            px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
            flex items-center gap-1 whitespace-nowrap
            ${hasNext
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          aria-label="Next page"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PaginationControl;