import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import './BurgerMenu.css';
import logo from '../../assets/images/menu_logo.png';

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
            <a href="#">Students</a>
            <a href="#">Instructors</a>
            <a href="#">Courses</a>
            <a href="#">Faculties & Majors</a>
            <a href="#">Academic Calendar</a>
            <a href="#">Exams</a>
            <a href="#">Semester</a>
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
            <a href="#">Applications</a>
            <a href="#">Facility</a>
            <a href="#">Centers</a>
            <a href="#">Campuses</a>
            <a href="#">Departments</a>
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
            <a href="#">Library</a>
            <a href="#">Announcements</a>
            <a href="#">Chat</a>
            <a href="#">News</a>
          </div>
        )}
      </div>
      </div>
    </Menu>
  );
};

export default BurgerMenu;
