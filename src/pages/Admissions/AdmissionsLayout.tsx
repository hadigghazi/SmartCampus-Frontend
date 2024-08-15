import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdmissionsLayout.module.css';
import headerImage from '../../assets/images/Pages_header.jpg';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

type AdmissionsLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const AdmissionsLayout: React.FC<AdmissionsLayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.layout}>
        <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Admissions Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>{title}</h1>
        <nav className={styles.nav}>
          <h2 className={styles.admissionsTitle}>- Admissions</h2>
          <ul>
            <li>
              <NavLink
                to="/admissions/requirements"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Admission Requirements
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/apply"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Apply Now
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/fees"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Fees
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/assessment"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Entrance Assessment
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/financial-aid"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Financial Aid And Scholarships
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/registrar"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Registrar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/dorms"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Dorms
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/transportation"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Transportation
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admissions/centers"
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                Centers
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

export default AdmissionsLayout;
