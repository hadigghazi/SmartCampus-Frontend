import React, { useState } from 'react';
import { useRegisterMutation } from '../../features/api/authApi';
import { RegisterRequest } from '../../features/api/types';

const Register: React.FC = () => {
  const [register] = useRegisterMutation();
  const [formData, setFormData] = useState<RegisterRequest>({
    first_name: '',
    middle_name: '',
    last_name: '',
    mother_full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    role: 'Student',
    status: 'Pending',
    date_of_birth: '',
    nationality: '',
    second_nationality: '',
    country_of_birth: '',
    gender: 'Male',
    marital_status: 'Single',
    profile_picture: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      alert('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
      </label>
      <label>
        Middle Name:
        <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} required />
      </label>
      <label>
        Last Name:
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
      </label>
      <label>
        Mother's Full Name:
        <input type="text" name="mother_full_name" value={formData.mother_full_name} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      <label>
        Confirm Password:
        <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required />
      </label>
      <label>
        Phone Number:
        <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
      </label>
      <label>
        Role:
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
          <option value="Instructor">Instructor</option>
        </select>
      </label>
      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </label>
      <label>
        Date of Birth:
        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
      </label>
      <label>
        Nationality:
        <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
      </label>
      <label>
        Second Nationality:
        <input type="text" name="second_nationality" value={formData.second_nationality} onChange={handleChange} required />
      </label>
      <label>
        Country of Birth:
        <input type="text" name="country_of_birth" value={formData.country_of_birth} onChange={handleChange} required />
      </label>
      <label>
        Gender:
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </label>
      <label>
        Marital Status:
        <select name="marital_status" value={formData.marital_status} onChange={handleChange} required>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </label>
      <label>
        Profile Picture URL:
        <input type="text" name="profile_picture" value={formData.profile_picture} onChange={handleChange} required />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
