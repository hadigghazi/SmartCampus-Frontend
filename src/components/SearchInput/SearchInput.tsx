import React from 'react';
import styles from './SearchInput.module.css';

type SearchInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        className={styles.inputField}
      />
    </div>
  );
};

export default SearchInput;
