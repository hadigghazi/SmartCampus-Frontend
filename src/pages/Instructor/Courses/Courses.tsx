import React from 'react';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi'; 
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi'; 
import CourseCard from '../../../components/CourseCard/CourseCard'; 
import styles from './Courses.module.css'; 
import { Course } from '../../../features/api/types'; 
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetInstructorByUserIdQuery } from '../../../features/api/instructorsApi';

const InstructorCoursesPage: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: instructor } = useGetInstructorByUserIdQuery(user?.id);
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: coursesAssigned } = useGetCoursesAssignedToInstructorQuery(instructor?.id);

  const filteredCourses = coursesAssigned?.filter(
    (course) => course.semester_id === currentSemester?.id
  );

  return (
    <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Your Assigned Courses</h2>
        <h1 className={styles.headingPrimary}>Courses Overview</h1>
    <div className={styles.coursesContainer}>
      {filteredCourses && filteredCourses.length > 0 ? (
        filteredCourses.map((course: Course) => (
          <CourseCard key={course.id} isInstructorView={true} course={course} />
        ))
      ) : (
        <p>No courses assigned for this semester.</p>
      )}
    </div>
    </div>
  );
};

export default InstructorCoursesPage;
