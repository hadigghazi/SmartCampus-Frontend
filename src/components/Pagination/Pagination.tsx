import React from 'react';
import styles from './Pagination.module.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.pagination}>
      <button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
