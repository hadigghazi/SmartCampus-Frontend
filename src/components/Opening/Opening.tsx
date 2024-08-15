import React from 'react';
import styles from './Opening.module.css'; 

const Opening: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Availability</h2>
      <h1 className={styles.headingPrimary}>Opening Hours</h1>
      <div className={styles.contentWrapper}>
        <table className={styles.openingHoursTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Days</th>
              <th className={styles.tableHeader}>Opening Hours</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.tableCell}>Monday - Friday</td>
              <td className={styles.tableCell}>08:00 AM - 03:00 PM</td>
            </tr>
            <tr>
              <td className={styles.tableCell}>Saturday</td>
              <td className={styles.tableCell}>10:00 AM - 02:00 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Opening;
