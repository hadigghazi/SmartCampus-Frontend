import React from 'react';
import styles from './EntriesPerPage.module.css';

type EntriesPerPageProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const EntriesPerPage: React.FC<EntriesPerPageProps> = ({ value, onChange }) => {
  return (
    <div className={styles.paginationControls}>
      <label htmlFor="entriesPerPage">Entries per page:</label>
      <select 
        id="entriesPerPage"
        value={value}
        onChange={onChange}
        className={styles.selectField}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
};

export default EntriesPerPage;
