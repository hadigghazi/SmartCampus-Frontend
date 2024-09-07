import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../features/api/usersApi';
import { useAddInstructorMutation, useGetInstructorByUserIdQuery } from '../../../features/api/instructorsApi';
import { useGetDepartmentsQuery } from '../../../features/api/departmentsApi'; 
import AdminLayout from '../AdminLayout';
import styles from './ApplicationDetails.module.css';
import defaultProfile from '../../../assets/images/profileImage.jpg';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../../../components/Spinner/Spinner';

const ApplicationDetailsInstructors: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id!, 10);

  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId);
  const { data: instructor } = useGetInstructorByUserIdQuery(userId);
  const [updateUserStatus] = useUpdateUserMutation();
  const [createInstructor] = useAddInstructorMutation();
  const { data: departments, isLoading: departmentsLoading, error: departmentsError } = useGetDepartmentsQuery();

  const [formData, setFormData] = useState({
    id: 0,
    user_id: userId,
    department_id: '', 
    specialization: '',
    created_at: '', 
    updated_at: '', 
    deleted_at: '', 
  });

  useEffect(() => {
    if (user && instructor) {
      setFormData({
        ...instructor,
        user_id: userId,
        department_id: instructor.department_id || '', 
        specialization: instructor.specialization || '',
        created_at: instructor.created_at || '', 
        updated_at: instructor.updated_at || '', 
        deleted_at: instructor.deleted_at || '', 
      });
    }
  }, [user, instructor, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'select-one'
        ? value
        : value === '' 
          ? null 
          : name === 'department_id' 
            ? parseInt(value, 10) 
            : value,
    }));
  };

  const handleAccept = async () => {
    try {
      const cleanFormData = {
        ...formData,
        department_id: formData.department_id || null,
        specialization: formData.specialization || null,
      };

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to accept this application and create the instructor?',
        icon: 'question',
        showCancelButton: true,
        color: '#123962',
        confirmButtonColor: '#123962',
        cancelButtonColor: '#ff0000',
        confirmButtonText: 'Yes, accept!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        if (!instructor) {
          await createInstructor(cleanFormData).unwrap();
        }
        await updateUserStatus({ id: userId, status: 'Approved' }).unwrap();
        toast.success('Application accepted successfully!');
      }
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
    } catch (err) {
      console.error('Error rejecting application:', err);
      toast.error('Failed to reject application.');
    }
  };

  if (userLoading || departmentsLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (userError || departmentsError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Application Details</h1>
        {user ? (
          <div className={styles.detailsWrapper}>
            <div className={styles.profileCard}>
              <div className={styles.profilePicture}>
                <img src={user.profile_picture || defaultProfile} alt="Profile" />
              </div>
              <div className={styles.profileInfo}>
                <p><strong>ID:</strong> {user.id}</p>
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
                    <label htmlFor="specialization">Specialization:</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                </form>
                <div className={styles.buttons}>
                  <button onClick={handleAccept} className={styles.acceptBtn}>Accept Application</button>
                  <button onClick={handleReject} className={styles.rejectBtn}>Reject Application</button>
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

export default ApplicationDetailsInstructors;
