import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { useLogoutMutation } from '../../features/api/authApi';
import { logout as logoutAction } from '../../features/auth/authSlice';
import NavbarLogo from '../../assets/images/NavBar_logo.png';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      // Clear token and user data from Redux state and local storage
      dispatch(logoutAction());
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Refresh the page to reset the state of the app
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

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
        {isAuthenticated ? (
          <li className={styles.menuItem}>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </li>
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
