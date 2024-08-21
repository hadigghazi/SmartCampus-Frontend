import React from 'react';
import BurgerMenu from '../../components/BurgerMenu/BurgerMenu';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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
