import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hooks';
import { logout } from '../features/auth/authSlice';
import { isTokenExpired } from '../features/auth/jwtUtils';

const AuthCheckComponent: React.FC = () => {
  const dispatch = useDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      dispatch(logout());
    }
  }, [dispatch, token]);

  return null;
};

export default AuthCheckComponent;
