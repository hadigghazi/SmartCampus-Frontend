import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../../../features/api/coursesApi'; 
import styles from './CourseDetails.module.css';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, error, isLoading } = useGetCourseByIdQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading course details</div>;

  if (!course) return <div>Course not found</div>;

  return (
    <div className={styles.content}>
        <h1 className={styles.headingPrimary}>{course.name}</h1>
        <h2 className={styles.headingSecondary}>{course.code}</h2>
        <p className={styles.text}>{course.credits} Credits</p>
        <p className={styles.text}>{course.description}</p>
    </div>
  );
};

export default CourseDetails;
