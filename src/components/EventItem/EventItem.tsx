import React from 'react';
import styles from './EventItem.module.css';

type EventItemProps = {
  date: string;
  month: string;
  title: string;
}

const EventItem: React.FC<EventItemProps> = ({ date, month, title }) => {
  return (
    <div className={styles.eventItem}>
      <div className={styles.dateBox}>
        <span className={styles.date}>{date}</span>
        <span className={styles.month}>{month}</span>
      </div>
      <div className={styles.description}>
        {title}
      </div>
    </div>
  );
};

export default EventItem;
