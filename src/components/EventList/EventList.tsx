import React from 'react';
import EventItem from '../EventItem/EventItem';
import styles from './EventList.module.css';
import { useGetImportantDatesQuery } from '../../features/api/importantDatesApi';

const EventList: React.FC = () => {
  const { data: importantDates, isLoading, error } = useGetImportantDatesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading events</p>;

  const sortedDates = importantDates?.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestSixDates = sortedDates?.slice(0, 6);

  return (
    <div className={styles.eventList}>
      <h2 className={styles.headingSecondary}>- Calendar</h2>
      <h1 className={styles.headingPrimary}>Latest Events And Deadlines</h1>
      <div className={styles.grid}>
        {latestSixDates?.map((event) => (
          <EventItem
            key={event.id}
            date={new Date(event.date).getDate().toString()}
            month={new Date(event.date).toLocaleString('default', { month: 'long' })}
            title={event.title || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;
