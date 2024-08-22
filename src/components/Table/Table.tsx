import React from 'react';
import styles from './Table.module.css';

type TableProps<T> = {
  columns: Array<{ header: string; accessor: keyof T | ((item: T) => React.ReactNode) }>;
  data: T[];
  actions?: (item: T) => React.ReactNode;
};

const Table = <T,>({ columns, data, actions }: TableProps<T>) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={styles.tableHeader}>
                {col.header}
              </th>
            ))}
            {actions && <th className={styles.tableHeader}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((col, idx) => (
                <td key={idx} className={styles.tableCell}>
                  {typeof col.accessor === 'function' 
                    ? col.accessor(item) 
                    : item[col.accessor]
                  }
                </td>
              ))}
              {actions && <td className={`${styles.tableCell} ${styles.tableActions}`}>{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
