import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery, useGetCourseOptionsQuery } from '../../../features/api/coursesApi';
import styles from './CourseDetails.module.css';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, error: courseError, isLoading: courseLoading } = useGetCourseByIdQuery(Number(id));
  const { data: courseOptions, error: optionsError, isLoading: optionsLoading } = useGetCourseOptionsQuery(Number(id));

  if (courseLoading || optionsLoading) return <div>Loading...</div>;
  if (courseError || optionsError) return <div>Error loading course details</div>;

  if (!course) return <div>Course not found</div>;

  return (
    <div className={styles.content}>
      <h1 className={styles.headingPrimary}>{course.name}</h1>
      <h2 className={styles.headingSecondary}>{course.code}</h2>
      <p className={styles.text}>{course.credits} Credits</p>
      <p className={styles.text}>{course.description}</p>

      <h3 className={styles.headingTertiary}>Course Options</h3>
      {courseOptions && courseOptions.length > 0 ? (
        <ul className={styles.optionsList}>
          {courseOptions.map(option => (
            <li key={option.id} className={styles.optionItem}>
              <h4 className={styles.optionHeading}>{option.instructor_name}</h4>
              <p className={styles.optionText}>Campus: {option.campus_name}</p>
              <p className={styles.optionText}>Schedule: {option.schedule}</p>
              <p className={styles.optionText}>Available Seats: {option.available_seats}</p>
              <p className={styles.optionText}>Semester: {option.semester_name}</p>
              <p className={styles.optionText}>Room: {option.room}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.text}>No options available for this course.</p>
      )}
    </div>
  );
};

export default CourseDetails;
