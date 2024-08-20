import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../../../features/api/coursesApi';
import styles from './CourseInfo.module.css';
import AcademicsLayout from '../AcademicsLayout';

const CourseInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: course, error, isLoading } = useGetCourseByIdQuery(Number(id));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading course details</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <AcademicsLayout title={course.name}>
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Course Details</h2>
        <h1 className={styles.headingPrimary}>{course.name}</h1>
        <p className={styles.text}><strong>Code:</strong> {course.code}</p>
        <p className={styles.text}><strong>Credits:</strong> {course.credits}</p>
        <p className={styles.text}><strong>Description:</strong> {course.description}</p>
      </div>
    </AcademicsLayout>
  );
};

export default CourseInfo;
