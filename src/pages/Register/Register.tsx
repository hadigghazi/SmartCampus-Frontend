import React, { useState } from 'react';
import { useRegisterMutation } from '../../features/api/authApi';
import { RegisterRequest } from '../../features/api/types';
import styles from './Register.module.css';
import logo from '../../assets/images/NavBar_logo.png'; 

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
    <div className={styles.wrapper}>
      <div className={styles.registerContainer}>
        <div className={styles.header}>
          <img src={logo} alt="SmartCampus Logo" className={styles.logo} />
          <div className={styles.title}>SmartCampus</div>
        </div>
        <div className={styles.registerTitle}>Register</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              className={styles.inputField}
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            <input
              className={styles.inputField}
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              placeholder="Middle Name"
              required
            />
            <input
              className={styles.inputField}
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              className={styles.inputField}
              type="text"
              name="mother_full_name"
              value={formData.mother_full_name}
              onChange={handleChange}
              placeholder="Mother's Full Name"
              required
            />
            <input
              className={styles.inputField}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              className={styles.inputField}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              className={styles.inputField}
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <input
              className={styles.inputField}
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <select
              className={styles.selectField}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <input
              className={styles.inputField}
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              placeholder="Date of Birth"
              required
            />
            <input
              className={styles.inputField}
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Nationality"
              required
            />
            <select
              className={styles.selectField}
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <input
              className={styles.inputField}
              type="text"
              name="second_nationality"
              value={formData.second_nationality}
              onChange={handleChange}
              placeholder="Second Nationality"
              required
            />
            <input
              className={styles.inputField}
              type="text"
              name="country_of_birth"
              value={formData.country_of_birth}
              onChange={handleChange}
              placeholder="Country of Birth"
              required
            />
             <input
              className={styles.inputField}
              type="text"
              name="profile_picture"
              value={formData.profile_picture}
              onChange={handleChange}
              placeholder="Profile Picture URL"
              required
            />
          </div>
          <button className={styles.submitButton} type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
