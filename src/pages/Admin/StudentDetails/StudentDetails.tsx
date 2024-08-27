import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetStudentByIdQuery } from '../../../features/api/studentsApi';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi';
import { useGetSemestersQuery } from '../../../features/api/semestersApi';
import { useGetMajorsQuery } from '../../../features/api/majorsApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import styles from './StudentDetails.module.css';
import defaultProfile from '../../../assets/images/profileImage.jpg';

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = parseInt(id!, 10);

  const { data: student, isLoading: studentLoading, error: studentError } = useGetStudentByIdQuery(studentId);
  const userId = student?.user_id;
  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId || -1);
  const { data: registrations, isLoading: registrationsLoading, error: registrationsError } = useGetRegistrationsByStudentQuery(studentId);
  const { data: semesters, isLoading: semestersLoading, error: semestersError } = useGetSemestersQuery();
  const { data: majors } = useGetMajorsQuery(); 

  const [selectedSemester, setSelectedSemester] = useState<string>('All');

  if (studentLoading || userLoading || registrationsLoading || semestersLoading) return <p>Loading...</p>;
  if (studentError || userError || registrationsError || semestersError) return <p>Error loading data.</p>;

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
    <AdminLayout>
      <div className={styles.studentDetailsContainer}>
        <h1 className={styles.headingPrimary}>Student Details</h1>
        {user && student ? (
          <div className={styles.detailsWrapper}>
            <div className={styles.profileCard}>
              <div className={styles.profilePicture}>
                <img src={user.profile_picture || defaultProfile} alt="Profile" />
              </div>
              <div className={styles.profileInfo}>
                <p><strong>ID:</strong> {student.id}</p>
                <p><strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
                <p><strong>Mother Full Name:</strong> {user.mother_full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone_number || 'N/A'}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Date of Birth:</strong> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Nationality:</strong> {user.nationality}</p>
                <p><strong>Second Nationality:</strong> {user.second_nationality || 'N/A'}</p>
                <p><strong>Country of Birth:</strong> {user.country_of_birth}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Marital Status:</strong> {user.marital_status}</p>
              </div>
            </div>

            <div className={styles.studentCard}>
              <h2 className={styles.headingSecondary}>More Details</h2>
              <div className={styles.studentInfo}>
                <p><strong>Government ID:</strong> {student.government_id}</p>
                <p><strong>Civil Status Number:</strong> {student.civil_status_number}</p>
                <p><strong>Passport Number:</strong> {student.passport_number || 'N/A'}</p>
                <p><strong>Visa Status:</strong> {student.visa_status || 'N/A'}</p>
                <p><strong>Native Language:</strong> {student.native_language}</p>
                <p><strong>Secondary Language:</strong> {student.secondary_language}</p>
                <p><strong>Current Semester ID:</strong> {student.current_semester_id || 'N/A'}</p>
                <p><strong>Major:</strong> {getMajorName(student.major_id) || 'N/A'}</p> 
                <p><strong>Additional Info:</strong> {student.additional_info || 'N/A'}</p>
                <p><strong>Needs Transportation:</strong> {student.transportation ? 'Yes' : 'No'}</p>
                <p><strong>Dorm Residency:</strong> {student.dorm_residency ? 'Yes' : 'No'}</p>
                <p><strong>Emergency Contact ID:</strong> {student.emergency_contact_id || 'N/A'}</p>
              </div>
            </div>

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
    </AdminLayout>
  );
};

export default StudentDetails;
