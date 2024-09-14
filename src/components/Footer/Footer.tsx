import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../assets/images/NavBar_logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faFacebook, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="SmartCampus Logo" className={styles.logo} />
          <span className={styles.footerTitle}>SmartCampus</span>
        </div>
      </div>
      <div className={styles.footerContent}>
        <div className={styles.footerColumn}>
          <h4>Contact Info</h4>
          <p>Main Campus Address<br />Tel: 999999999<br />Email: smartcampus1@gmail.com</p>
          <p>Second Campus Address<br />Tel: 888888888<br />Email: smartcampus2@gmail.com</p>
          <p>Third Campus Address<br />Tel: 777777777<br />Email: smartcampus3@gmail.com</p>
        </div>
        <div className={styles.footerColumn}>
          <h4>Discover More</h4>
          <p><Link to="/about">About Us</Link></p>
          <p><Link to="/admissions/fees">Fees</Link></p>
          <p><Link to="/major-suggestor">AI Major Suggestion</Link></p>
          <p><Link to="/academics/faculties">Faculties And Programs</Link></p>
        </div>
        <div className={styles.footerColumn}>
          <h4>More Links</h4>
          <p><Link to="/admissions/academic-careers">Academic Careers</Link></p>
          <p><Link to="/admissions/non-academic-careers">Non-Academic Careers</Link></p>
          <p><Link to="/academics/academic-calendar">Calendar</Link></p>
          <p><Link to="/admissions/financial-aid">Financial Aid</Link></p>
          <p><a href="mailto:hadigghazi@gmail.com">Contact Us</a></p>
          <p><a href="https://www.google.com/maps?q=Beirut+City" target="_blank" rel="noopener noreferrer">Campus Location</a></p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; SmartCampus 2024. All Rights Reserved.</p>
        <div className={styles.socialIcons}>
          <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
          <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
