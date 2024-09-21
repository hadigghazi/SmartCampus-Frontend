import React from 'react';
import styles from './EventItem.module.css';

type EventItemProps = {
  date: string;
  month: string;
  title: string;
}

const EventItem: React.FC<EventItemProps> = ({ date, month, title }) => {
  const formattedDate = date.length === 1 ? `0${date}` : date;

  return (
    <div className={styles.eventItem}>
      <div className={styles.dateBox}>
        <span className={styles.date}>{formattedDate}</span>
        <span className={styles.month}>{month}</span>
      </div>
      <div className={styles.description}>
        {title}
      </div>
    </div>
  );
};

export default EventItem;
