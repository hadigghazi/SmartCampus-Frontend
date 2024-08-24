import { useParams } from 'react-router-dom';
import { useGetStudentByIdQuery } from '../../../features/api/studentsApi';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import AdminLayout from '../AdminLayout';
import styles from './StudentDetails.module.css'; 
import defaultProfile from '../../../assets/images/profileImage.jpg';

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = parseInt(id!, 10);

  const { data: student, isLoading: studentLoading, error: studentError } = useGetStudentByIdQuery(studentId);

  const userId = student?.user_id;
  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId || -1);

  if (studentLoading || userLoading) return <p>Loading...</p>;
  if (studentError || userError) return <p>User is deleted from the system!</p>;

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
                <p><strong>Additional Info:</strong> {student.additional_info || 'N/A'}</p>
                <p><strong>Needs Transportation:</strong> {student.transportation ? 'Yes' : 'No'}</p>
                <p><strong>Dorm Residency:</strong> {student.dorm_residency ? 'Yes' : 'No'}</p>
                <p><strong>Emergency Contact ID:</strong> {student.emergency_contact_id || 'N/A'}</p>
                <p><strong>Created At:</strong> {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Updated At:</strong> {student.updated_at ? new Date(student.updated_at).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Deleted At:</strong> {student.deleted_at ? new Date(student.deleted_at).toLocaleDateString() : 'N/A'}</p>
              </div>
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
