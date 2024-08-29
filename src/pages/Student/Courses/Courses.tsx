import React from 'react';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi'; 
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi'; 
import CourseCard from '../../../components/CourseCard/CourseCard'; 
import styles from './Courses.module.css'; 
import { Course } from '../../../features/api/types'; 
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';

const CoursesPage: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: student } = useGetStudentByUserIdQuery(user?.id);
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: registrations } = useGetRegistrationsByStudentQuery(student?.id);

  const filteredCourses = registrations?.filter(
    (registration) => registration.semester_id === currentSemester?.id
  );

  return (
    <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Your Courses</h2>
        <h1 className={styles.headingPrimary}>Courses Overview</h1>
    <div className={styles.coursesContainer}>
      {filteredCourses && filteredCourses.length > 0 ? (
        filteredCourses.map((course: Course) => (
          <CourseCard key={course.id} course={course} />
        ))
      ) : (
        <p>No courses available for this semester.</p>
      )}
    </div>
    </div>
  );
};

export default CoursesPage;
