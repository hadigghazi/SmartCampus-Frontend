import React, { useState } from 'react';
import { useLoginMutation } from '../../features/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { LoginRequest } from '../../features/api/types';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logo from '../../assets/images/NavBar_logo.png';
import Navbar from '../../components/Navbar/Navbar';

const Login: React.FC = () => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      const { access_token, user } = response;

      if (access_token && user) {
        dispatch(setCredentials({ token: access_token, user }));
        
        switch (user.role) {
          case 'Student':
            navigate('/student-dashboard');
            break;
          case 'Instructor':
            navigate('/instructor-dashboard');
            break;
          case 'Admin':
            navigate('/admin/applications/students');
            break;
          default:
            console.error('Unknown user role');
        }
      } else {
        console.error('Login failed: Token or user not found');
      }
    } catch (error) {
      if (error && 'data' in error) {
        const errorMessage = typeof error.data === 'string' ? error.data : 'An unknown error occurred';
        console.error('Login failed:', errorMessage);
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <img src={logo} alt="SmartCampus Logo" className={styles.logo} />
          <div className={styles.title}>SmartCampus</div>
        </div>
        <div className={styles.loginTitle}>Login</div>
        <form onSubmit={handleSubmit}>
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
          <button className={styles.submitButton} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
