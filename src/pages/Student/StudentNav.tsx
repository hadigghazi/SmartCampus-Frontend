import React from 'react';
import { Link } from 'react-router-dom';
import NavbarLogo from '../../assets/images/NavBar_logo.png';
import styles from '../../components/Navbar/Navbar.module.css';

const Navbar: React.FC = () => {


  return (
    <nav className={styles.nav}>
      <Link to="/">
        <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      </Link>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link to="/student-dashboard">Dashboard</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/academic-history">Academic History</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/statement-of-fees">Statement Of Fees</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/channels">Channels</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/courses">Courses</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
