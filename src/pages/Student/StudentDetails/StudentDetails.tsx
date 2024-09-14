import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi';
import { useGetSemestersQuery } from '../../../features/api/semestersApi';
import { useGetMajorsQuery } from '../../../features/api/majorsApi';
import Table from '../../../components/Table/Table';
import styles from './StudentDetails.module.css';
import defaultProfile from '../../../assets/images/profileImage.jpg';
import StudentLayout from '../StudentLayout';
import { RootState } from '../../../store'; 
import Spinner from '../../../components/Spinner/Spinner';

const StudentDetails: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: student, isLoading: studentLoading, error: studentError } = useGetStudentByUserIdQuery(user?.id || -1);
  const { data: registrations, isLoading: registrationsLoading, error: registrationsError } = useGetRegistrationsByStudentQuery(student?.id || -1);
  const { data: semesters, isLoading: semestersLoading, error: semestersError } = useGetSemestersQuery();
  const { data: majors } = useGetMajorsQuery(); 

  const [selectedSemester, setSelectedSemester] = useState<string>('All');

  if (studentLoading || registrationsLoading || semestersLoading) return <StudentLayout><Spinner /></StudentLayout>;
  if (studentError || registrationsError || semestersError) return <p>Error loading data.</p>;

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(event.target.value);
  };

  const filteredRegistrations = registrations?.filter(reg => 
    selectedSemester === 'All' || reg.semester_name === selectedSemester
  );

  const getMajorName = (majorId: number | null) => {
    const major = majors?.find(major => major.id === majorId);
    return major ? major.name : 'N/A';
  };

  const columns = [
    { header: 'Course Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Instructor Name', accessor: 'instructor_name' },
    { header: 'Status', accessor: 'status' },
    { header: 'Semester', accessor: 'semester_name' },
  ];

  return (
    <StudentLayout>
      <div className={styles.studentDetailsContainer}>
        <h1 className={styles.headingPrimary}>Student Details</h1>
        {student && user ? (
          <div className={styles.detailsWrapper}>
            <table className={styles.studentDetailsTable}>
              <tbody>
                <tr>
                  <td rowSpan={2} className={styles.profilePictureCell}>
                    <img
                      src={user.profile_picture || defaultProfile}
                      alt="Profile"
                      className={styles.profileImage}
                    />
                  </td>
                  <td>
                    <strong>ID:</strong> {student?.id}
                  </td>
                  <td>
                    <strong>Government ID:</strong> {student?.government_id}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Name:</strong> {user?.first_name} {user?.middle_name} {user?.last_name}
                  </td>
                  <td>
                    <strong>Civil Status Number:</strong> {student?.civil_status_number}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Email:</strong> {user?.email}
                  </td>
                  <td>
                    <strong>Passport Number:</strong> {student?.passport_number || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Mother Full Name:</strong> {user?.mother_full_name}
                  </td>
                  <td>
                    <strong>Country Of Birth:</strong> {user?.country_of_birth || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Marital Status:</strong> {user?.marital_status}
                  </td>
                  <td>
                    <strong>Gender:</strong> {user?.gender || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Phone:</strong> {user?.phone_number || 'N/A'}
                  </td>
                  <td>
                    <strong>Visa Status:</strong> {student?.visa_status || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Date of Birth:</strong>{' '}
                    {user.date_of_birth ? new Date(user?.date_of_birth).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <strong>Native Language:</strong> {student?.native_language}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Nationality:</strong> {user?.nationality}
                  </td>
                  <td>
                    <strong>Secondary Language:</strong> {student?.secondary_language}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Major:</strong> {getMajorName(student?.major_id) || 'N/A'}
                  </td>
                  <td>
                    <strong>Additional Info:</strong> {student?.additional_info || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <strong>Address</strong> {user?.address || 'N/A'}
                  </td>
                  <td>
                    <strong>Emergency Contact Number:</strong> {user?.emergency_contact_number|| 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={styles.registrationsContainer} style={{ marginTop: '4rem' }}>
              <h2 className={styles.headingSecondary}>Course Registrations</h2>
              <div className={styles.filters}>
                <label htmlFor="semesterFilter" className={styles.filtersText}>Semester:</label>
                <select
                  id="semesterFilter"
                  className={styles.selectField}
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                >
                  <option value="All">All</option>
                  {semesters?.map((semester) => (
                    <option key={semester.id} value={semester.name}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>
              {filteredRegistrations && filteredRegistrations.length > 0 ? (
                <Table columns={columns} data={filteredRegistrations} />
              ) : (
                <p>No course registrations found for this student.</p>
              )}
            </div>
          </div>
        ) : (
          <p>No student data found.</p>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDetails;
