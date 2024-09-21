import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from '../AdmissionRequirements/AdmissionRequirements.module.css';

const Transportation: React.FC = () => {
  return (
    <AdmissionsLayout title="Transportation">
    <div className={styles.container}>
    <h2 className={styles.headingSecondary}>- Need A Ride?</h2>
      <h1 className={styles.headingPrimary}>Transportation Program</h1>
          <h2 className={styles.headingSecondary}>Overview</h2>
      <p className={styles.text}>
        Our university offers a comprehensive campus bus service designed to provide students with convenient and reliable transportation options. Our buses connect various neighborhoods and key locations around the city with the campus, making daily commutes easy and stress-free.
      </p>
      
      <h2 className={styles.headingSecondary}>Bus Services</h2>
      <ul className={styles.list}>
        <li><strong>Regular Routes:</strong> The campus bus service operates on several regular routes, ensuring coverage of major residential and commercial areas. The routes are planned to align with peak times for student arrivals and departures.</li>
        <li><strong>Comfortable Seating:</strong> Our buses are designed with comfortable seating and climate control to ensure a pleasant travel experience.</li>
      </ul>

      <h2 className={styles.headingSecondary}>Bus Passes and Fees</h2>
      <p className={styles.text}>
        <strong>Semester Passes:</strong> Students can purchase bus passes for a semester, which offer unlimited rides within the service period. Passes can be bought at a discounted rate during the registration period.
      </p>

      <h2 className={styles.headingSecondary}>Contact Information</h2>
      <p className={styles.text}>
        For more details about our campus bus services, including route maps and schedules, please contact the Bus Services Office:
      </p>
      <ul className={styles.list}>
        <li><strong>Phone:</strong> 999999999</li>
        <li><strong>Email:</strong> <a href="mailto:smartcampus@gmail.com" className={styles.text}>smartcampus@gmail.com</a></li>
        <li><strong>Office Hours:</strong> 08:00 AM - 14:00 PM</li>
      </ul>

      <p className={styles.text}>
        Our goal is to provide reliable and convenient transportation solutions to support your academic journey and campus life.
      </p>
    </div>

    </AdmissionsLayout>
  );
};

export default Transportation;
