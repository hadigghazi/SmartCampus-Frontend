import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './Registrar.module.css';
import { useGetImportantDatesQuery } from '../../../features/api/importantDatesApi'; 
import Spinner from '../../../components/Spinner/Spinner';

const Registrar: React.FC = () => {
  const { data: events, isLoading, error } = useGetImportantDatesQuery(); 

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading events</p>;

  return (
    <AdmissionsLayout title="Registrar Calendar">
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Important Dates</h2>
        <h1 className={styles.headingPrimary}>Registrar Calendar</h1>

        {events && (
          <>
            <h2 className={styles.text}>Events</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>From</th>
                  <th>To</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{event.date}</td>
                    <td>{event.end_date || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </AdmissionsLayout>
  );
};

export default Registrar;
