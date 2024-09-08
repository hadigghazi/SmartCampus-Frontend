import { useGetAdminByUserIdQuery } from '../../../features/api/adminsApi';
import { useGetDepartmentByIdQuery } from '../../../features/api/departmentsApi'; // Import the department query hook
import AdminLayout from '../AdminLayout';
import styles from '../InstructorDetails/InstructorDetails.module.css'; 
import defaultProfile from '../../../assets/images/profileImage.jpg';
import Spinner from '../../../components/Spinner/Spinner';
import { useGetUserQuery } from '../../../features/api/authApi';

const AdminDetails: React.FC = () => {
  const { data: user, isLoading: userLoading, error: userError } = useGetUserQuery();
  const { data: admin, isLoading: adminLoading, error: adminError } = useGetAdminByUserIdQuery(user?.id)

  const departmentId = admin?.department_id;
  const { data: department, isLoading: departmentLoading, error: departmentError } = useGetDepartmentByIdQuery(departmentId || -1);

  if (adminLoading || userLoading || departmentLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (adminError || userError || departmentError) return <p>User is deleted from the system!</p>;

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.instructorDetailsContainer}>
        <h1 className={styles.headingPrimary}>Admin Details</h1>
        {user && admin && department ? (
          <div className={styles.detailsWrapper}>
            <div className={styles.profileCard}>
              <div className={styles.profilePicture}>
                <img src={user.profile_picture || defaultProfile} alt="Profile" />
              </div>
              <div className={styles.profileInfo}>
                <p><strong>ID:</strong> {admin.id}</p>
                <p><strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone_number || 'N/A'}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Date of Birth:</strong> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Nationality:</strong> {user.nationality}</p>
                <p><strong>Country of Birth:</strong> {user.country_of_birth}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Marital Status:</strong> {user.marital_status}</p>
              </div>
            </div>
            <div className={styles.instructorCard}>
              <h2 className={styles.headingSecondary}>More Details</h2>
              <div className={styles.instructorInfo}>
                <p><strong>Admin Type:</strong> {admin.admin_type}</p>
                <p><strong>Department:</strong> {department.name}</p> 
              </div>
            </div>
          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDetails;
