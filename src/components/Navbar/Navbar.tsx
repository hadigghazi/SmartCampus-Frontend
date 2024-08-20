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

      dispatch(logoutAction());
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className={styles.nav}>
      <Link to="/">
      <img src={NavbarLogo} alt="header_logo" className={styles.logo} />
      </Link>
      <ul className={styles.menu}>
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
