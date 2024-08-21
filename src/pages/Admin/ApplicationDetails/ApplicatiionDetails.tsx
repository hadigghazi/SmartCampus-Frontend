import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../../features/api/usersApi';
import { useCreateStudentMutation, useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import AdminLayout from '../AdminLayout';
import { Student } from '../../../features/api/types'; 

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = parseInt(id!);

  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);
  const { data: student } = useGetStudentByUserIdQuery(userId);
  const [updateUserStatus] = useUpdateUserMutation();
  const [createStudent] = useCreateStudentMutation();

  const [formData, setFormData] = useState<Student>({
    id: 0, 
    user_id: userId,
    government_id: '',
    civil_status_number: '',
    passport_number: '',
    visa_status: '',
    native_language: '',
    secondary_language: '',
    current_semester_id: undefined,
    additional_info: '',
    transportation: false,
    dorm_residency: false,
    emergency_contact_id: 0,
    created_at: '', 
    updated_at: '', 
    deleted_at: '', 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      <h2>Application Details</h2>
      {user ? (
        <div>
          <p>ID: {user.id}</p>
          <p>Name: {user.first_name} {user.middle_name} {user.last_name}</p>
          <p>Status: {user.status}</p>
          <p>Date: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>

          <form onSubmit={handleSubmit}>
            <div>
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

            <div>
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

            <div>
              <label htmlFor="passport_number">Passport Number (optional):</label>
              <input
                type="text"
                id="passport_number"
                name="passport_number"
                value={formData.passport_number || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="visa_status">Visa Status (optional):</label>
              <input
                type="text"
                id="visa_status"
                name="visa_status"
                value={formData.visa_status || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
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

            <div>
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

            <div>
              <label htmlFor="current_semester_id">Current Semester ID (optional):</label>
              <input
                type="number"
                id="current_semester_id"
                name="current_semester_id"
                value={formData.current_semester_id || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="additional_info">Additional Info (optional):</label>
              <input
                type="text"
                id="additional_info"
                name="additional_info"
                value={formData.additional_info || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="transportation">Needs Transportation:</label>
              <input
                type="checkbox"
                id="transportation"
                name="transportation"
                checked={formData.transportation}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="dorm_residency">Dorm Residency:</label>
              <input
                type="checkbox"
                id="dorm_residency"
                name="dorm_residency"
                checked={formData.dorm_residency}
                onChange={handleInputChange}
              />
            </div>

            <div>
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
            <button type="submit">Accept Application</button>
          </form>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </AdminLayout>
  );
};

export default ApplicationDetails;
