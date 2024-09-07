import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserQuery } from '../../features/api/authApi';
import Navbar from './InstructorNav';
import styles from '../../pages/Admin/AdminLayout.module.css';
import Spinner from '../../components/Spinner/Spinner';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const InstructorLayout: React.FC<StudentLayoutProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: user, isLoading } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'Instructor' || user?.status !== 'Approved') {
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

export default InstructorLayout;
