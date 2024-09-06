import React from 'react';
import styles from '../../pages/Admin/AdminLayout.module.css';
import Navbar from './StudentNav';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children }) => {
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
