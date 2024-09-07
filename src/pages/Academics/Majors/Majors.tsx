import React from 'react';
import AcademicsLayout from "../AcademicsLayout";
import styles from './Majors.module.css';
import MajorCard from '../../../components/MajorCard/MajorCard';
import { useGetMajorsQuery } from '../../../features/api/majorsApi';
import Spinner from '../../../components/Spinner/Spinner';

const Majors: React.FC = () => {
  const { data: majors, error, isLoading } = useGetMajorsQuery();

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading majors</p>;

  return (
    <AcademicsLayout title="Majors">
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Our Majors</h2>
        <h1 className={styles.headingPrimary}>Explore Majors</h1>
        <div className={styles.grid}>
          {majors?.map((major) => (
            <MajorCard key={major.id} major={major} />
          ))}
        </div>
      </div>
    </AcademicsLayout>
  );
};

export default Majors;
