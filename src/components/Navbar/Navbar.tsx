import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../../features/api/authApi';
import { logout } from '../../features/auth/authSlice';
import NavbarLogo from '../../assets/images/NavBar_logo.png';
import styles from './Navbar.module.css';
import { useAppSelector } from '../../hooks';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <Link to="/">
        <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      </Link>
      <button className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'} {/* Hamburger icon changes to X when menu is open */}
      </button>
      <ul className={`${styles.menu} ${isMenuOpen ? styles.open : styles.closed}`}>
        <li className={styles.menuItem}>
          <Link to="/admissions/requirements">Admissions</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/academics/faculties">Academics</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/campuses">Campuses</Link>
        </li>
        {isAuthenticated ? (
          <>
            <li className={styles.menuItem}>
              <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
            </li>
            <li className={styles.menuItem}>
              <Link to="/login">Portal</Link>
            </li>
          </>
        ) : (
          <li className={styles.menuItem}>
            <Link to="/login">Portal</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
