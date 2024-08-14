import React from 'react';
import styles from './EventItem.module.css';

interface EventItemProps {
    date: string;
    month: string;
    description: string;
}

const EventItem: React.FC<EventItemProps> = ({ date, month, description }) => {
    return (
        <div className={styles.eventItem}>
            <div className={styles.dateBox}>
                <span className={styles.date}>{date}</span>
                <span className={styles.month}>{month}</span>
            </div>
            <div className={styles.description}>
                {description}
            </div>
        </div>
    );
}

export default EventItem;
