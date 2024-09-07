import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './BurgerMenu.css';
import logo from '../../assets/images/logo.png';

const BurgerMenu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <Menu>
      <div className='menu_container'>
      <div className="menu-logo">
        <img src={logo} alt="Menu Logo" />
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
            <a href="/admin/students">Students</a>
            <a href="/admin/instructors">Instructors</a>
            <a href="/admin/admins">Staff</a>
            <a href="/admin/courses">Courses</a>
            <a href="/admin/faculties">Faculties</a>
            <a href="/admin/majors">Majors</a>
            <a href="/admin/calendar">Academic Calendar</a>
            <a href="/admin/exams">Exams</a>
            <a href="/admin/semesters">Semesters</a>
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
            <a href="/admin/applications/students">Students Applications</a>
            <a href="/admin/applications/instructors">Instructors Applications</a>
            <a href="/admin/applications/admins">Staff Applications</a>
            <a href="/admin/payment-settings">Payment Settings</a>
            <a href="/admin/rooms">Rooms</a>
            <a href="/admin/blocks">Blocks</a>
            <a href="/admin/centers">Centers</a>
            <a href="/admin/campuses">Campuses</a>
            <a href="/admin/departments">Departments</a>
            <a href="#">Dorms & Transportation</a>
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
            <a href="/admin/library">Library</a>
            <a href="/admin/announcements">Announcements</a>
            <a href="#">Chat</a>
            <a href="/admin/news">News</a>
          </div>
        )}
      </div>
      </div>
    </Menu>
  );
};

export default BurgerMenu;
