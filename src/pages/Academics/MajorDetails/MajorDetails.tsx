import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetMajorByIdQuery } from '../../../features/api/majorsApi';
import styles from './MajorDetails.module.css';
import AcademicsLayout from '../AcademicsLayout';

const MajorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { data: major, error, isLoading } = useGetMajorByIdQuery(parseInt(id as string));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading major details</p>;
  if (!major) return <p>Major not found</p>;

  return (
    <AcademicsLayout title={major.name}>
    <div className={styles.container}>
       <h2 className={styles.headingSecondary}>- About The Major</h2>
      <h1 className={styles.headingPrimary}>{major.name}</h1>
        <p className={styles.text}>{major.description}</p>
    </div>
    </AcademicsLayout>
  );
};

export default MajorDetails;
