import React from 'react';
import styles from './NewsCard.module.css'; 

const NewsCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <img 
        src="path/to/image.jpg" 
        alt="SmartCampus News" 
        className={styles.image} 
      />
      <div className={styles.content}>
        <p className={styles.date}>20 April, 2024</p>
        <h3 className={styles.title}>
          SmartCampus Recognized as a Leader in Modern Education with Cutting-Edge Programs
        </h3>
      </div>
    </div>
  );
};

export default NewsCard;
