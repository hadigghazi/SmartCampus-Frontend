import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './BurgerMenu.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import defaultProfile from '../../assets/images/profileImage.jpg';
import { useGetUserQuery } from '../../features/api/authApi';

const BurgerMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data: user } = useGetUserQuery();
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Menu>
      <div className='menu_container'>
        <div className="menu-logo">
          <Link to='/'><img src={logo} alt="Menu Logo" /></Link>
        </div>
        <div className='accordion-item'>
          <div className="menu-logo">
            <Link to='/admin/profile'>
              <img
                src={user?.profile_picture || defaultProfile}
                alt="profile"
                className='profile-image'
              />
            </Link>
          </div>
        </div>
        <div className='accordion-item'>
          <div className="accordion-title">
            <Link to='/admin/dashboard'>Dashboard</Link>
          </div>
        </div>
        <div className="accordion-item">
          <div
            className={`accordion-title ${activeIndex === 0 ? 'active' : ''}`}
            onClick={() => toggleAccordion(0)}
          >
            <h3>Academics</h3>
          </div>
          {activeIndex === 0 && (
            <div className="accordion-content">
              <Link to="/admin/students">Students</Link>
              <Link to="/admin/instructors">Instructors</Link>
              <Link to="/admin/admins">Staff</Link>
              <Link to="/admin/courses">Courses</Link>
              <Link to="/admin/faculties">Faculties</Link>
              <Link to="/admin/majors">Majors</Link>
              <Link to="/admin/calendar">Academic Calendar</Link>
              <Link to="/admin/exams">Exams</Link>
              <Link to="/admin/semesters">Semesters</Link>
            </div>
          )}
        </div>

        <div className="accordion-item">
          <div
            className={`accordion-title ${activeIndex === 1 ? 'active' : ''}`}
            onClick={() => toggleAccordion(1)}
          >
            <h3>Administration</h3>
          </div>
          {activeIndex === 1 && (
            <div className="accordion-content">
              <Link to="/admin/applications/students">Students Applications</Link>
              <Link to="/admin/applications/instructors">Instructors Applications</Link>
              <Link to="/admin/applications/admins">Staff Applications</Link>
              <Link to="/admin/payment-settings">Payment Settings</Link>
              <Link to="/admin/rooms">Rooms</Link>
              <Link to="/admin/blocks">Blocks</Link>
              <Link to="/admin/centers">Centers</Link>
              <Link to="/admin/campuses">Campuses</Link>
              <Link to="/admin/departments">Departments</Link>
              <Link to="/admin/dorms">Dorms</Link>
              <Link to="/admin/buses">Transportation</Link>
            </div>
          )}
        </div>

        <div className="accordion-item">
          <div
            className={`accordion-title ${activeIndex === 2 ? 'active' : ''}`}
            onClick={() => toggleAccordion(2)}
          >
            <h3>Communication</h3>
          </div>
          {activeIndex === 2 && (
            <div className="accordion-content">
              <Link to="/admin/library">Library</Link>
              <Link to="/admin/announcements">Announcements</Link>
              <Link to="#">Chat</Link>
              <Link to="/admin/news">News</Link>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
};

export default BurgerMenu;
