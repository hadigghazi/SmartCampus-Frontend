import React from 'react';
import styles from './NewsCard.module.css'; 

export interface NewsCardProps {
  news: {
    title: string;
    date: string;
    imageUrl: string;
  };
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className={styles.card}>
      <img 
        src={news.imageUrl}
        alt="SmartCampus News" 
        className={styles.image} 
      />
      <div className={styles.content}>
        <p className={styles.date}>{news.date}</p>
        <h3 className={styles.title}>{news.title}</h3>
      </div>
    </div>
  );
};

export default NewsCard;
