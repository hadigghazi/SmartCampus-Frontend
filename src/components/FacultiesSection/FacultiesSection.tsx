import React, { useRef } from 'react';
import styles from './FacultiesSection.module.css'; 
import ArrowButton from '../ArrowButton/ArrowButton';
import FacultiesCard from '../FacultiesCard/FacultiesCard';
import { useGetFacultiesQuery } from '../../features/api/facultiesApi';

const FacultiesSection: React.FC = () => {
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

  const { data: faculties, error, isLoading } = useGetFacultiesQuery();

  if (isLoading) return <p>Loading...</p>; 
  if (error) return <p>Error loading faculties</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Our Faculties</h2>
      <h1 className={styles.headingPrimary}>Explore Our Faculties</h1>
      <div className={styles.carouselContainer}>
        <ArrowButton onClick={scrollLeft} direction='left' />        
        <div className={styles.cardsContainer} ref={scrollRef}>
          {faculties?.map((faculty) => (
            <FacultiesCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
        <ArrowButton onClick={scrollRight} direction='right' />
      </div>
    </div>
  );
};

export default FacultiesSection;
