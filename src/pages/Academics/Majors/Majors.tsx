import React from 'react';
import { useGetMajorsQuery } from '../../../features/api/majorsApi';
import MajorCard from '../../../components/MajorCard/MajorCard';
import styles from './Majors.module.css';

const Majors: React.FC = () => {
  const { data: majors, error, isLoading } = useGetMajorsQuery();

  if (isLoading) return <p>Loading majors...</p>;
  if (error) return <p>Error loading majors</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Our Majors</h2>
      <h1 className={styles.headingPrimary}>Explore Our Majors</h1>
      <div className={styles.grid}>
        {majors?.map((major) => (
          <MajorCard key={major.id} major={major} />
        ))}
      </div>
    </div>
  );
};

export default Majors;
