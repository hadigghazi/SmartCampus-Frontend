import React, { useRef } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import styles from '../FacultiesSection/FacultiesSection.module.css';
import ArrowButton from '../ArrowButton/ArrowButton';
import { useGetNewsQuery } from '../../features/api/newsApi';
import Spinner from '../Spinner/Spinner';

const NewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: news, error, isLoading } = useGetNewsQuery();

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

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading news</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Announcements And News</h2>
      <h1 className={styles.headingPrimary}>Latest SmartCampus News</h1>
      <div className={styles.carouselContainer}>
        <ArrowButton onClick={scrollLeft} direction='left' />
        <div className={styles.cardsContainer} ref={scrollRef}>
          {news?.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
        <ArrowButton onClick={scrollRight} direction='right' />
      </div>
    </div>
  );
};

export default NewsSection;
