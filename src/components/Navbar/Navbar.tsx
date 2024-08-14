import React from 'react';
import NavbarLogo from '../../assets/images/NavBar_logo.png';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <img src={NavbarLogo} alt="header_logo" className={`${styles.logo}`} />
      <ul className={`${styles.menu}`}>
        <li className={`${styles.menuItem}`}><a href="#admissions">Admissions</a></li>
        <li className={`${styles.menuItem}`}><a href="#academics">Academics</a></li>
        <li className={`${styles.menuItem}`}><a href="#campuses">Campuses</a></li>
        <li className={`${styles.menuItem}`}><a href="#library">Library</a></li>
        <li className={`${styles.menuItem}`}><a href="#portal">Portal</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
