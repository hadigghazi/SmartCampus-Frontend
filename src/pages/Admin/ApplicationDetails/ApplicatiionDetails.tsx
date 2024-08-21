import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../features/api/usersApi';
import { useCreateStudentMutation, useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import AdminLayout from '../AdminLayout';
import styles from './ApplicationDetails.module.css'; 
import defaultProfile from '../../../assets/images/profileImage.jpg';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id!, 10);

  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);
  const { data: student } = useGetStudentByUserIdQuery(userId);
  const [updateUserStatus] = useUpdateUserMutation();
  const [createStudent] = useCreateStudentMutation();

  const [formData, setFormData] = useState({
    id: 0,
    user_id: userId,
    government_id: '',
    civil_status_number: '',
    passport_number: '',
    visa_status: '',
    native_language: '',
    secondary_language: '',
    current_semester_id: '',
    additional_info: '',
    transportation: false,
    dorm_residency: false,
    emergency_contact_id: 0,
    created_at: '',
    updated_at: '',
    deleted_at: '',
  });

  useEffect(() => {
    if (user && student) {
      setFormData({
        ...student,
        user_id: userId
      });
    }
  }, [user, student, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAccept = async () => {
    try {
      if (!student) {
        await createStudent(formData).unwrap();
      }
      await updateUserStatus({ id: userId, status: 'Approved' }).unwrap();
      alert('Application accepted and student created successfully!');
    } catch (err) {
      console.error('Error accepting application:', err);
      alert('Failed to accept application.');
    }
  };

  const handleReject = async () => {
    try {
      await updateUserStatus({ id: userId, status: 'Rejected' }).unwrap();
      alert('Application rejected successfully!');
    } catch (err) {
      console.error('Error rejecting application:', err);
      alert('Failed to reject application.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      <div className={styles.applicationDetailsContainer}>
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
                    <label htmlFor="government_id">Government ID:</label>
                    <input
                      type="text"
                      id="government_id"
                      name="government_id"
                      value={formData.government_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="civil_status_number">Civil Status Number:</label>
                    <input
                      type="text"
                      id="civil_status_number"
                      name="civil_status_number"
                      value={formData.civil_status_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="passport_number">Passport Number (optional):</label>
                    <input
                      type="text"
                      id="passport_number"
                      name="passport_number"
                      value={formData.passport_number || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="visa_status">Visa Status (optional):</label>
                    <input
                      type="text"
                      id="visa_status"
                      name="visa_status"
                      value={formData.visa_status || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="native_language">Native Language:</label>
                    <input
                      type="text"
                      id="native_language"
                      name="native_language"
                      value={formData.native_language}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="secondary_language">Secondary Language:</label>
                    <input
                      type="text"
                      id="secondary_language"
                      name="secondary_language"
                      value={formData.secondary_language}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="current_semester_id">Current Semester ID (optional):</label>
                    <input
                      type="number"
                      id="current_semester_id"
                      name="current_semester_id"
                      value={formData.current_semester_id || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="additional_info">Additional Info (optional):</label>
                    <input
                      type="text"
                      id="additional_info"
                      name="additional_info"
                      value={formData.additional_info || ''}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="transportation">Needs Transportation:</label>
                    <input
                      type="checkbox"
                      id="transportation"
                      name="transportation"
                      checked={formData.transportation}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="dorm_residency">Dorm Residency:</label>
                    <input
                      type="checkbox"
                      id="dorm_residency"
                      name="dorm_residency"
                      checked={formData.dorm_residency}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="emergency_contact_id">Emergency Contact ID:</label>
                    <input
                      type="number"
                      id="emergency_contact_id"
                      name="emergency_contact_id"
                      value={formData.emergency_contact_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </form>

                <div className={styles.actionButtons}>
                  <button className={styles.acceptBtn} onClick={handleAccept}>Accept Application</button>
                  <button className={styles.rejectBtn} onClick={handleReject}>Reject Application</button>
                </div>
              </div>
            )}

            {user.status === 'Approved' || user.status === 'Rejected' ? (
              <div className={styles.statusInfo}>
                <p>Application has been {user.status.toLowerCase()}.</p>
              </div>
            ) : null}
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetails;
