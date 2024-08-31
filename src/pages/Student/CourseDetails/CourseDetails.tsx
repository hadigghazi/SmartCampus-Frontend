import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCourseMaterialsByInstructorQuery } from '../../../features/api/courseMaterialsApi';
import { useFetchAssignmentsByInstructorQuery } from '../../../features/api/assignmentsApi';
import MaterialsList from '../../../components/MaterialsList/MaterialsList';
import AssignmentsList from '../../../components/AssignmentsList/AssignmentsList';
import styles from './CourseDetails.module.css';
import { useGetCourseDetailsByInstructorIdQuery } from '../../../features/api/coursesApi';

const StudentCourseDetailsPage: React.FC = () => {
  const { courseInstructorId } = useParams<{ courseInstructorId: string }>();
  const { data: materials } = useFetchCourseMaterialsByInstructorQuery(Number(courseInstructorId));
  const { data: assignments } = useFetchAssignmentsByInstructorQuery(Number(courseInstructorId));
  const { data: courseDetails, isLoading: isCourseLoading } = useGetCourseDetailsByInstructorIdQuery(Number(courseInstructorId));

  return (
    <div className={styles.container}>
      {isCourseLoading ? (
        <p>Loading course details...</p>
      ) : (
        <>
          <h1 className={styles.headingPrimary}>{courseDetails?.course_name} ({courseDetails?.course_code})</h1>
        </>
      )}
      <MaterialsList
        materials={materials}
      />

      <h2 className={styles.headingSecondary}>- Assignments</h2>
      <AssignmentsList 
        assignments={assignments || []}
        courseInstructorId={courseInstructorId}
        isInstructor={false}
      />
    </div>
  );
};

export default StudentCourseDetailsPage;
