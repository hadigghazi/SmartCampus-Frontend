import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetUserQuery } from '../../features/api/authApi';
import NavbarLogo from '../../assets/images/logo.png';
import defaultProfile from '../../assets/images/profileImage.jpg';
import styles from '../../components/Navbar/Navbar.module.css';
import Spinner from '../../components/Spinner/Spinner';

const Navbar: React.FC = () => {
  const { data: user, isLoading } = useGetUserQuery();
  const [menuOpen, setMenuOpen] = useState(false); 

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (isLoading) return <Spinner />;

  return (
    <nav className={`${styles.nav} ${styles.spnav}`}>
      <Link to="/">
        <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      </Link>
      
      <button className={`${styles.hamburger} ${styles.sphamburger}`} onClick={toggleMenu}>
        {menuOpen ? '✕' : '☰'} 
      </button>

      <ul className={`${styles.menu} ${styles.spmenu} ${menuOpen ? styles.open : styles.closed}`}>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/instructor-dashboard">Dashboard</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/instructor-history">Instructor History</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/instructor-channels">Channels</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/instructor-courses">Courses</Link>
        </li>
        <li className={`${styles.menuItem} ${styles.spmenuItem}`}>
          <Link to="/instructor-profile">
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
