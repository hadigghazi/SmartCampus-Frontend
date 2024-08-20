import React, { useRef } from 'react';
import { useGetNewsQuery } from '../../features/api/newsApi';
import NewsCard from '../NewsCard/NewsCard';
import styles from './NewsSection.module.css';
import ArrowButton from '../ArrowButton/ArrowButton';

const NewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: news = [], isLoading, error } = useGetNewsQuery();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 300;
    }
  };

  if (isLoading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Failed to load news. Please try again later.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Announcements And News</h2>
      <h1 className={styles.headingPrimary}>Latest SmartCampus News</h1>
      <div className={styles.carouselContainer}>
        <ArrowButton onClick={scrollLeft} direction="left" />
        <div className={styles.cardsContainer} ref={scrollRef}>
          {news.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>
        <ArrowButton onClick={scrollRight} direction="right" />
      </div>
    </div>
  );
};

export default NewsSection;
