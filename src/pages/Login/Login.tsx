import React, { useState } from 'react';
import { useLoginMutation } from '../../features/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { LoginRequest } from '../../features/api/types';

const Login: React.FC = () => {
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(formData).unwrap();
      dispatch(setCredentials(user));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" onChange={handleChange} />
      <input type="password" name="password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
