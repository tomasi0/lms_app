import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination-container">
      <button
        className="prev-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>
      <div className="number-button-wrapper">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={`number-button ${
              currentPage === page + 1 ? "selected" : ""
            }`}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>
      <button
        className="next-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        이후
      </button>
    </div>
  );
};

export default Pagination;
