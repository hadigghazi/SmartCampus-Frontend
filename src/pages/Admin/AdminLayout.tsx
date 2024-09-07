import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserQuery } from '../../features/api/authApi';
import BurgerMenu from '../../components/BurgerMenu/BurgerMenu';
import styles from './AdminLayout.module.css';
import { useGetAdminByUserIdQuery } from '../../features/api/adminsApi';

interface AdminLayoutProps {
  children: React.ReactNode;
  requiredAdminType?: 'Admin' | 'Super Admin';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, requiredAdminType }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: user, isLoading: userLoading } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: admin, isLoading: adminLoading } = useGetAdminByUserIdQuery(user?.id, {
    skip: !user?.id,
  });

  if (userLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'Admin' || user?.status !== 'Approved') {
    return <Navigate to="/" />;
  }

  if (requiredAdminType && admin?.admin_type !== requiredAdminType) {
    return <Navigate to="/admin/applications/students" />;
  }

  return (
    <div className={styles.adminLayout}>
      <BurgerMenu />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
