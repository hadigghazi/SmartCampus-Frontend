import React from 'react';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi'; 
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi'; 
import CourseCard from '../../../components/CourseCard/CourseCard'; 
import styles from '../Courses/Courses.module.css'; 
import { Course } from '../../../features/api/types'; 
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import StudentLayout from '../StudentLayout';

const CoursesPage: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: student } = useGetStudentByUserIdQuery(user?.id);
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: registrations } = useGetRegistrationsByStudentQuery(student?.id);

  const filteredCourses = registrations?.filter(
    (registration) => registration.semester_id === currentSemester?.id
  );

  return (
    <StudentLayout>
    <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Your Channels</h2>
        <h1 className={styles.headingPrimary}>Channels Overview</h1>
    <div className={styles.coursesContainer}>
      {filteredCourses && filteredCourses.length > 0 ? (
        filteredCourses.map((course: Course) => (
          <CourseCard key={course.id} course={course} isChannel={true} />
        ))
      ) : (
        <p>No channels available for this semester.</p>
      )}
    </div>
    </div>
    </StudentLayout>
  );
};

export default CoursesPage;
