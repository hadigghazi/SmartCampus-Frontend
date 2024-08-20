import React from 'react';
import styles from './NewsCard.module.css';
import { News } from '../../features/api/types'; 
import NewsImage from "../../assets/images/Welcome1.png"

type NewsCardProps = {
  news: News;
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { title, published_date, content } = news;

  return (
    <div className={styles.card}>
      <img
        src={NewsImage}
        alt="SmartCampus News"
        className={styles.image}
      />
      <div className={styles.content}>
        <p className={styles.date}>{published_date}</p>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
};

export default NewsCard;
