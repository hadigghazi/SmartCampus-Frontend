import React from 'react';
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetSemestersByStudentQuery } from '../../../features/api/semestersApi';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi';
import Table from '../../../components/Table/Table';
import styles from './AcademicHistory.module.css';

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

  return (
    <div className={styles.container}>
      <h2 className={styles.headingPrimary}>Academic History</h2>
      {student && (
        <div className={styles.studentInfo}>
          <p>{user?.first_name} {user?.middle_name} {user?.last_name} | {student.id}</p>
        </div>
      )}

      {semesters && semesters.map((semester) => {
        const filteredRegistrations = getFilteredRegistrations(semester.id);

        return (
          <div key={semester.id} className={styles.semesterSection}>
            <h3 className={styles.headingSecondary}>- {semester.name}</h3>
            {isLoading ? (
              <p>Loading courses...</p>
            ) : (
              filteredRegistrations.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <Table columns={registrationColumns} data={filteredRegistrations} />
                </div>
              ) : (
                <p>No courses found for this semester.</p>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AcademicHistory;
