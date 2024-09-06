import React from 'react';
import { Link } from 'react-router-dom';
import NavbarLogo from '../../assets/images/logo.png';
import styles from '../../components/Navbar/Navbar.module.css';

const Navbar: React.FC = () => {


  return (
    <nav className={`${styles.nav} ${styles.spnav}`}>
      <Link to="/">
        <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      </Link>
      <ul className={styles.menu}>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/student-dashboard">Dashboard</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/academic-history">Academic History</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/statement-of-fees">Statement Of Fees</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/channels">Channels</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/courses">Courses</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
