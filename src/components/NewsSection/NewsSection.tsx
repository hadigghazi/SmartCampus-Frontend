// NewsSection.tsx
import React, { useRef } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import styles from './NewsSection.module.css'; 

const NewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Announcements And News</h2>
      <h1 className={styles.headingPrimary}>Latest SmartCampus News</h1>
      <div className={styles.carouselContainer}>
        <button className={styles.arrowButton} onClick={scrollLeft}>&lt;</button>
        <div className={styles.cardsContainer} ref={scrollRef}>
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </div>
        <button className={styles.arrowButton} onClick={scrollRight}>&gt;</button>
      </div>
    </div>
  );
};

export default NewsSection;
