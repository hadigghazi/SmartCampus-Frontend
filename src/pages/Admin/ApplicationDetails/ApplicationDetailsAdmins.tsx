import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../features/api/usersApi';
import { useAddAdminMutation, useGetAdminByUserIdQuery } from '../../../features/api/adminsApi';
import { useGetDepartmentsQuery } from '../../../features/api/departmentsApi'; 
import AdminLayout from '../AdminLayout';
import styles from './ApplicationDetails.module.css';
import styles2 from '../StudentDetails/StudentDetails.module.css';
import defaultProfile from '../../../assets/images/profileImage.jpg';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner/Spinner';

const ApplicationDetailsAdmins: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id!, 10);

  const { data: user, isLoading: userLoading, error: userError, refetch: refetchUser } = useGetUserByIdQuery(userId);
  const { data: admin, refetch: refetchAdmin } = useGetAdminByUserIdQuery(userId);
  const [updateUserStatus] = useUpdateUserMutation();
  const [createAdmin] = useAddAdminMutation();
  const { data: departments, isLoading: departmentsLoading, error: departmentsError } = useGetDepartmentsQuery();

  const [formData, setFormData] = useState({
    id: 0,
    user_id: userId,
    department_id: '', 
    admin_type: '',
    salary: '',
    created_at: '', 
    updated_at: '', 
    deleted_at: '', 
  });

  useEffect(() => {
    if (user && admin) {
      setFormData({
        ...admin,
        user_id: userId,
        department_id: admin.department_id || '', 
        admin_type: admin.admin_type || '',
        salary: admin.salary || '', 
        created_at: admin.created_at || '', 
        updated_at: admin.updated_at || '', 
        deleted_at: admin.deleted_at || '', 
      });
    }
  }, [user, admin, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'select-one'
        ? value
        : value === '' 
          ? null 
          : name === 'department_id' || name === 'salary'
            ? parseInt(value, 10) 
            : value,
    }));
  };

  const handleAccept = async () => {
    try {
      const cleanFormData = {
        ...formData,
        department_id: formData.department_id || null,
        admin_type: formData.admin_type || null,
        salary: formData.salary || null, 
      };

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to accept this application and create the admin?',
        icon: 'question',
        showCancelButton: true,
        color: '#123962',
        confirmButtonColor: '#123962',
        cancelButtonColor: '#ff0000',
        confirmButtonText: 'Yes, accept!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        if (!admin) {
          await createAdmin(cleanFormData).unwrap();
        }
        await updateUserStatus({ id: userId, status: 'Approved' }).unwrap();
        toast.success('Application accepted successfully!');
      }
      refetchAdmin();
      refetchUser();
    } catch (err) {
      console.error('Error accepting application:', err);
      toast.error('Failed to accept application.');
    }
  };

  const handleReject = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to reject this application?',
        icon: 'warning',
        showCancelButton: true,
        color: '#123962',
        confirmButtonColor: '#ff0000',
        cancelButtonColor: '#123962',
        confirmButtonText: "Yes, reject!",
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        await updateUserStatus({ id: userId, status: 'Rejected' }).unwrap();
        toast.success('Application rejected successfully!');
      }
      refetchAdmin();
      refetchUser();
    } catch (err) {
      console.error('Error rejecting application:', err);
      toast.error('Failed to reject application.');
    }
  };

  if (userLoading || departmentsLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (userError || departmentsError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      <div className={styles.applicationDetailsContainer}>
        <h1 className={styles.headingPrimary}>Application Details</h1>
        {user ? (
          <div className={styles.detailsWrapper}>
<table className={styles2.studentDetailsTable}>
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
        <strong>ID:</strong> {user?.id}
      </td>
      <td>
        <strong>Name:</strong> {user?.first_name} {user?.middle_name} {user?.last_name}
      </td>
    </tr>
    <tr>
      <td>
        <strong>Mother Full Name:</strong> {user?.mother_full_name}
      </td>
      <td>
        <strong>Email:</strong> {user?.email}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Phone:</strong> {user?.phone_number || 'N/A'}
      </td>
      <td>
        <strong>Role:</strong> {user?.role}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Status:</strong> {user?.status}
      </td>
      <td>
        <strong>Date of Birth:</strong> {user?.date_of_birth ? new Date(user?.date_of_birth).toLocaleDateString() : 'N/A'}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Nationality:</strong> {user?.nationality}
      </td>
      <td>
        <strong>Second Nationality:</strong> {user?.second_nationality || 'N/A'}
      </td>
    </tr>
    <tr>
      <td colSpan={2}>
        <strong>Country of Birth:</strong> {user?.country_of_birth}
      </td>
      <td>
        <strong>Gender:</strong> {user?.gender}
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
      <td colSpan={3}>
        <strong>Emergency Contact Number:</strong> {user?.emergency_contact_number || 'N/A'}
      </td>
    </tr>
  </tbody>
</table>
            {user.status === 'Pending' && (
              <div className={styles.applicationForm}>
                <form>
                  <div className={styles.formGroup}>
                    <label htmlFor="department_id">Department:</label>
                    <select
                      id="department_id"
                      name="department_id"
                      value={formData.department_id || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(department => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="admin_type">Admin Type:</label>
                    <select
                      id="admin_type"
                      name="admin_type"
                      value={formData.admin_type || ''}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Admin Type</option>
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="salary">Salary:</label>
                    <input
                      id="salary"
                      name="salary"
                      type="number"
                      value={formData.salary || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </form>
                <div className={styles.buttons}>
                  <button onClick={handleReject} className={styles.rejectBtn}>Reject Application</button>
                  <button onClick={handleAccept} className={styles.acceptBtn}>Accept Application</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No user data available.</p>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetailsAdmins;
