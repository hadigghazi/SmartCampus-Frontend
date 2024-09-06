import React from 'react';
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetSemestersByStudentQuery } from '../../../features/api/semestersApi';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi';
import Table from '../../../components/Table/Table';
import styles from './AcademicHistory.module.css';
import StudentLayout from '../StudentLayout';

const AcademicHistory: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: student } = useGetStudentByUserIdQuery(user?.id);
  const { data: semesters } = useGetSemestersByStudentQuery(student?.id);
  const { data: registrations, isLoading } = useGetRegistrationsByStudentQuery(student?.id);

  const registrationColumns = [
    { header: 'Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Instructor', accessor: 'instructor_name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Status', accessor: 'status' },
    { header: 'From', accessor: 'start_date' },
    { header: 'To', accessor: 'end_date' },
    { header: 'Grade', accessor: 'grade' }
  ];

  const getFilteredRegistrations = (semesterId: number) => {
    return registrations?.filter(reg => reg.semester_id === semesterId) || [];
  };

  const calculateSummary = (registrations: any[]) => {
    const totalCourses = registrations.length;
    const validCredits = registrations
      .filter(reg => reg.credits !== 'N/A')
      .map(reg => parseFloat(reg.credits));
    const requiredCredits = validCredits.reduce((sum, credits) => sum + credits, 0);
    const earnedCredits = registrations
      .filter(reg => reg.status === 'Completed' && reg.credits !== 'N/A')
      .reduce((sum, reg) => sum + parseFloat(reg.credits), 0);
    const validGrades = registrations
      .filter(reg => reg.grade !== 'N/A')
      .map(reg => parseFloat(reg.grade));
    const averageGrade = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length || 0;

    return { totalCourses, requiredCredits, earnedCredits, averageGrade };
  };

  return (
    <StudentLayout>
    <div className={styles.container}>
      <h2 className={styles.headingPrimary}>Academic History</h2>
      {student && (
        <div className={styles.studentInfo}>
          <p>{user?.first_name} {user?.middle_name} {user?.last_name} | {student.id}</p>
        </div>
      )}

      {semesters && semesters.map((semester) => {
        const filteredRegistrations = getFilteredRegistrations(semester.id);
        const summary = calculateSummary(filteredRegistrations);

        return (
          <div key={semester.id} className={styles.semesterSection}>
            <h3 className={styles.headingSecondary}>- {semester.name}</h3>
            {isLoading ? (
              <p>Loading courses...</p>
            ) : (
              filteredRegistrations.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <Table columns={registrationColumns} data={filteredRegistrations} />
                  <div className={styles.summaryRow}>
                    <div className={styles.summaryItem}><strong>Total Courses:</strong> {summary.totalCourses}</div>
                    <div className={styles.summaryItem}><strong>Required Credits:</strong> {summary.requiredCredits}</div>
                    <div className={styles.summaryItem}><strong>Earned Credits:</strong> {summary.earnedCredits}</div>
                    <div className={styles.summaryItem}><strong>Average Grade:</strong> {summary.averageGrade.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <p>No courses found for this semester.</p>
              )
            )}
          </div>
        );
      })}
    </div>
    </StudentLayout>
  );
};

export default AcademicHistory;
