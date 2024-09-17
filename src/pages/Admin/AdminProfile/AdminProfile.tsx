import { useGetAdminByUserIdQuery } from '../../../features/api/adminsApi';
import { useGetDepartmentByIdQuery } from '../../../features/api/departmentsApi'; // Import the department query hook
import AdminLayout from '../AdminLayout';
import styles from '../StudentDetails/StudentDetails.module.css'; 
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
      <div className={styles.studentDetailsContainer}>
        <h1 className={styles.headingPrimary}>Admin Details</h1>
        {user && admin && department ? (
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
        <strong>ID:</strong> {admin?.id}
      </td>
      <td>
        <strong>Name:</strong> {user?.first_name} {user?.middle_name} {user?.last_name}
      </td>
    </tr>
    <tr>
      <td>
        <strong>Email:</strong> {user?.email}
      </td>
      <td>
        <strong>Phone:</strong> {user?.phone_number || 'N/A'}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Date of Birth:</strong> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}
      </td>
      <td>
        <strong>Nationality:</strong> {user?.nationality}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Country of Birth:</strong> {user?.country_of_birth || 'N/A'}
      </td>
      <td>
        <strong>Gender:</strong> {user?.gender || 'N/A'}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Marital Status:</strong> {user?.marital_status}
      </td>
      <td>
        <strong>Address:</strong> {user?.address || 'N/A'}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Emergency Contact Number:</strong> {user?.emergency_contact_number || 'N/A'}
      </td>
      <td colSpan={2}>
        <strong>Salary:</strong> {admin?.salary || 'N/A'}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Admin Type:</strong> {admin?.admin_type}
      </td>
      <td>
        <strong>Department:</strong> {department ? department.name : 'N/A'}
      </td>
    </tr>
  </tbody>
</table>

          </div>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDetails;
