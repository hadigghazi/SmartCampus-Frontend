import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserQuery } from '../../features/api/authApi';
import Navbar from './StudentNav';
import styles from '../../pages/Admin/AdminLayout.module.css';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: user, isLoading } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'Student') {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.studentLayout}>
      <Navbar />
      <div>
        {children}
      </div>
    </div>
  );
};

export default StudentLayout;
