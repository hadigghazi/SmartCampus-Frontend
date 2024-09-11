import React from 'react';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi'; 
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi'; 
import CourseCard from '../../../components/CourseCard/CourseCard'; 
import styles from '../Courses/Courses.module.css'; 
import { Course } from '../../../features/api/types'; 
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetInstructorByUserIdQuery } from '../../../features/api/instructorsApi';
import InstructorLayout from '../InstructorLayout';

const InstructorCoursesPage: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: instructor } = useGetInstructorByUserIdQuery(user?.id);
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: coursesAssigned } = useGetCoursesAssignedToInstructorQuery(instructor?.id);

  const filteredCourses = coursesAssigned?.filter(
    (course) => course.semester_id === currentSemester?.id
  );

  return (
    <InstructorLayout>
    <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Your Channels</h2>
        <h1 className={styles.headingPrimary}>Channels Overview</h1>
    <div className={styles.coursesContainer}>
      {filteredCourses && filteredCourses.length > 0 ? (
        filteredCourses.map((course: Course) => (
          <CourseCard key={course.id} isInstructorView={true} course={course} isChannel={true} />
        ))
      ) : (
        <p>No channels for this semester.</p>
      )}
    </div>
    </div>
    </InstructorLayout>
  );
};

export default InstructorCoursesPage;
