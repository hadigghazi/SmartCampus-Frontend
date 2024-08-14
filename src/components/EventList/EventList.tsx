import React from 'react';
import EventItem from '../EventItem/EventItem';
import styles from './EventList.module.css';

const events = [
    { date: '03', month: 'September', description: 'End of summer 2023/24 semester' },
    { date: '03', month: 'September', description: 'End of summer 2023/24 semester' },
    { date: '03', month: 'September', description: 'End of summer 2023/24 semester' },
    { date: '03', month: 'September', description: 'End of summer 2023/24 semester' },
    { date: '03', month: 'September', description: 'End of summer 2023/24 semester' },
    { date: '03', month: 'September', description: 'End of summer 2023/24 semester' }
];

const EventList: React.FC = () => {
    return (
        <div className={styles.eventList}>
            <h2 className={styles.heading}>Latest Events And Deadlines</h2>
            <div className={styles.grid}>
                {events.map((event, index) => (
                    <EventItem key={index} date={event.date} month={event.month} description={event.description} />
                ))}
            </div>
        </div>
    );
}

export default EventList;
