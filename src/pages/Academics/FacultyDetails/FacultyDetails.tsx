
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetFacultyByIdQuery } from '../../../features/api/facultiesApi';
import { useGetMajorsByFacultyQuery } from '../../../features/api/majorsApi';
import styles from './FacultyDetails.module.css';
import AcademicsLayout from '../AcademicsLayout';
import MajorCard from '../../../components/MajorCard/MajorCard';

const FacultyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: faculty, isLoading: facultyLoading, error: facultyError } = useGetFacultyByIdQuery(Number(id));
  const { data: majors, isLoading: majorsLoading, error: majorsError } = useGetMajorsByFacultyQuery(Number(id));

  if (facultyLoading || majorsLoading) return <p>Loading...</p>;
  if (facultyError || majorsError || !faculty) return <p>Error loading faculty details or majors</p>;

  return (
    <AcademicsLayout title={faculty.name}>
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- About The Faculty</h2>
        <h1 className={styles.headingPrimary}>{faculty.name}</h1>
        <p className={styles.text}>{faculty?.description}</p>
        <div className={styles.majorsContainer}>
          {majors.length > 0 ? (
            majors.map((major) => (
              <MajorCard key={major.id} major={major} />
            ))
          ) : (
            <p>No majors available for this faculty</p>
          )}
        </div>
      </div>
    </AcademicsLayout>
  );
};

export default FacultyDetails;
