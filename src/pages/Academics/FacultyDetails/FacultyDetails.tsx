import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetFacultyByIdQuery } from '../../../features/api/facultiesApi';
import styles from './FacultyDetails.module.css';
import AcademicsLayout from '../AcademicsLayout';

const FacultyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: faculty, isLoading, error } = useGetFacultyByIdQuery(Number(id));

  if (isLoading) return <p>Loading...</p>;
  if (error || !faculty) return <p>Error loading faculty details</p>;
  
  return (
    <AcademicsLayout title={faculty.name}>
    <div className={styles.container}>
    <h2 className={styles.headingSecondary}>- About The Faculty</h2>
      <h1 className={styles.headingPrimary}>{faculty.name}</h1>
        <p className={styles.text}>{faculty?.description}</p>
    </div>
    </AcademicsLayout>
  );
};

export default FacultyDetails;
