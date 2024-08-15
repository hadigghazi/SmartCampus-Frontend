import React from 'react';
import { Link } from 'react-router-dom';
import NavbarLogo from '../../assets/images/NavBar_logo.png';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link to="/admissions/requirements">Admissions</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/admissions/requirements">Academics</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/admissions/requirements">Campuses</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/admissions/requirements">Library</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/admissions/requirements">Portal</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
