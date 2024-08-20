import React from 'react';
import { Link } from 'react-router-dom';
import { News } from '../../features/api/types'; 
import styles from './NewsCard.module.css';
import newsImage from "../../assets/images/Welcome1.png"

type NewsCardProps = {
  news: News;
};

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { id, title, published_date } = news;

  return (
    <div className={styles.card}>
      <img
        src={newsImage}
        alt="SmartCampus News"
        className={styles.image}
      />
      <div className={styles.content}>
        <p className={styles.date}>{published_date}</p>
        <h3 className={styles.title}>
          <Link to={`/news/${id}`}>{title}</Link>
        </h3>
      </div>
    </div>
  );
};

export default NewsCard;
