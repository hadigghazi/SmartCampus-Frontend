import React, { useState } from 'react';
import { useLoginMutation } from '../../features/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { LoginRequest } from '../../features/api/types';
import { useNavigate } from 'react-router-dom';

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
      const user = await login(formData).unwrap();
      dispatch(setCredentials(user));
      navigate('/'); 
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
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
