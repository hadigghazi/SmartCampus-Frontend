import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserQuery } from '../../features/api/authApi';
import NavbarLogo from '../../assets/images/logo.png';
import defaultProfile from '../../assets/images/profileImage.jpg';
import styles from '../../components/Navbar/Navbar.module.css';

const Navbar: React.FC = () => {
  const { data: user, isLoading } = useGetUserQuery();
  const [menuOpen, setMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <nav className={`${styles.nav} ${styles.spnav}`}>
      <Link to="/">
        <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      </Link>
      
      <button className={styles.hamburger} onClick={toggleMenu}>
        {menuOpen ? '✕' : '☰'} 
      </button>

      <ul className={`${styles.menu} ${styles.spmenu} ${menuOpen ? styles.open : styles.closed}`}>
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
          <Link to="/profile">
            <img
              src={user?.profile_picture || defaultProfile}
              alt="profile"
              className={styles.profileImage}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
