import React from 'react';
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetInstructorByUserIdQuery } from '../../../features/api/instructorsApi';
import { useGetSemestersByInstructorQuery } from '../../../features/api/semestersApi';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi';
import Table from '../../../components/Table/Table';
import styles from './InstructorHistory.module.css';

const InstructorHistory: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: instructor } = useGetInstructorByUserIdQuery(user?.id);
  const { data: semesters } = useGetSemestersByInstructorQuery(instructor?.id);
  const { data: coursesAssigned } = useGetCoursesAssignedToInstructorQuery(instructor?.id);

  const courseColumns = [
    { header: 'Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Room', accessor: (course) => `${course.campus_name}, ${course.room}` },
    { header: 'From', accessor: 'from_date' },
    { header: 'To', accessor: 'to_date' },
    { header: 'Schedule', accessor: 'schedule' },
    { header: 'Students', accessor: (course) => `${course.number_of_students}/${course.available_seats}` }
  ];

  const getFilteredCoursesAssigned = (semesterId: number) => {
    return coursesAssigned?.filter(course => course.semester_id === semesterId) || [];
  };

  const calculateSummary = (courses: any[]) => {
    const totalCourses = courses.length;
    const totalCredits = courses.reduce((sum, course) => sum + parseFloat(course.credits), 0);
    const totalStudents = courses.reduce((sum, course) => sum + parseInt(course.number_of_students, 10), 0);

    return { totalCourses, totalCredits, totalStudents };
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.headingPrimary}>Instructor History</h2>
      {instructor && (
        <div className={styles.instructorInfo}>
          <p>{user?.first_name} {user?.middle_name} {user?.last_name} | {instructor.id}</p>
        </div>
      )}

      {semesters && semesters.map((semester) => {
        const filteredCourses = getFilteredCoursesAssigned(semester.id);
        const summary = calculateSummary(filteredCourses);

        return (
          <div key={semester.id} className={styles.semesterSection}>
            <h3 className={styles.headingSecondary}>- {semester.name}</h3>
            {filteredCourses.length > 0 ? (
              <div className={styles.tableWrapper}>
                <Table columns={courseColumns} data={filteredCourses} />
                <div className={styles.summaryRow}>
                  <div className={styles.summaryItem}><strong>Total Courses:</strong> {summary.totalCourses}</div>
                  <div className={styles.summaryItem}><strong>Total Credits:</strong> {summary.totalCredits}</div>
                  <div className={styles.summaryItem}><strong>Total Students:</strong> {summary.totalStudents}</div>
                </div>
              </div>
            ) : (
              <p>No courses found for this semester.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InstructorHistory;
