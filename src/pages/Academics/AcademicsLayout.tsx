import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AcademicsLayout.module.css';
import headerImage from '../../assets/images/Pages_header.jpg';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

type AcademicsLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const AcademicsLayout: React.FC<AcademicsLayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Academics Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>{title}</h1>
        <nav className={styles.nav}>
          <h2 className={styles.admissionsTitle}>- Admissions</h2>
          <ul>
            <li>
              <NavLink
                to="/academics/faculties"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Faculties
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/academics/majors"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Majors
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/academics/grading-system"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Grading System
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/academics/academic-calendar"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Academic Calendar
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AcademicsLayout;
