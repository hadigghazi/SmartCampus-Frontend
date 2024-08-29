import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMajorByIdQuery } from '../../../features/api/majorsApi';
import { useGetCoursesByMajorQuery } from '../../../features/api/coursesApi';
import styles from './MajorDetails.module.css';
import AcademicsLayout from '../AcademicsLayout';

const MajorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: major, error: majorError, isLoading: majorLoading } = useGetMajorByIdQuery(parseInt(id as string));
  const { data: courses, error: coursesError, isLoading: coursesLoading } = useGetCoursesByMajorQuery(parseInt(id as string));

  if (majorLoading || coursesLoading) return <p>Loading...</p>;
  if (majorError) return <p>Error loading major details</p>;
  if (coursesError) return <p>Error loading courses</p>;
  if (!major) return <p>Major not found</p>;

  return (
    <AcademicsLayout title={major.name}>
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- About The Major</h2>
        <h1 className={styles.headingPrimary}>{major.name}</h1>
        <p className={styles.text}>{major.description}</p>

        <h2 className={styles.headingSecondary}>- Courses in {major.name} Major</h2>
        <div className={styles.coursesList}>
          {courses && courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className={styles.courseCard}>
                <Link to={`/courses/info/${course.id}`} className={styles.courseLink}>
                  <h3 className={styles.courseTitle}>{course.code} - {course.name}</h3>
                </Link>
              </div>
            ))
          ) : (
            <p>No courses available for this major.</p>
          )}
        </div>
      </div>
    </AcademicsLayout>
  );
};

export default MajorDetails;
