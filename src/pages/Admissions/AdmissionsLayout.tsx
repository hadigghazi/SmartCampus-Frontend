import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdmissionsLayout.module.css';
import HeaderImage from "../../assets/images/Pages_header.jpg"

type AdmissionsLayoutProps = {
  title: string;
  children: React.ReactNode;
};

const AdmissionsLayout: React.FC<AdmissionsLayoutProps> = ({ title, children }) => {
  return (
    <div className={styles.admissionsLayout}>
      <header className={styles.admissionsHeader}>
        <img src={HeaderImage} alt="Campus" className={styles.headerImage} />
      </header>
      <div className={styles.contentContainer}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Admissions</h2>
          <nav>
            <ul className={styles.navList}>
              <li>
                <NavLink to="/admissions/requirements" className={styles.navLink} activeClassName={styles.activeLink}>Admission Requirements</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/apply" className={styles.navLink} activeClassName={styles.activeLink}>Apply Now</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/fees" className={styles.navLink} activeClassName={styles.activeLink}>Fees</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/assessment" className={styles.navLink} activeClassName={styles.activeLink}>Entrance Assessment</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/financial-aid" className={styles.navLink} activeClassName={styles.activeLink}>Financial Aid and Scholarships</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/registrar" className={styles.navLink} activeClassName={styles.activeLink}>Registrar</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/dorms" className={styles.navLink} activeClassName={styles.activeLink}>Dorms</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/transportation" className={styles.navLink} activeClassName={styles.activeLink}>Transportation</NavLink>
              </li>
              <li>
                <NavLink to="/admissions/centers" className={styles.navLink} activeClassName={styles.activeLink}>Centers</NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdmissionsLayout;
