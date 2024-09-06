import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserQuery } from '../../features/api/authApi';
import Navbar from './StudentNav';
import FloatingButton from '../../components/FloatingButton/FloatingButton';
import styles from '../../pages/Admin/AdminLayout.module.css';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

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

  if (user?.role !== 'Student' || user?.status !== 'Approved') {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.studentLayout}>
      <Navbar />
      <div>
        {children}
      </div>
      <FloatingButton linkTo="/instructor" icon={faRobot} ariaLabel="AI Instructor" />
    </div>
  );
};

export default StudentLayout;
