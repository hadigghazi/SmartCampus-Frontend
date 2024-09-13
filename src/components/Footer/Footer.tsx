import React from 'react';
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
          <p><a href="#">About Us</a></p>
          <p><a href="#">Fees</a></p>
          <p><a href="#">Library</a></p>
          <p><a href="#">AI Major Suggestion</a></p>
          <p><a href="#">Faculties And Programs</a></p>
        </div>
        <div className={styles.footerColumn}>
          <h4>More Links</h4>
          <p><a href="#">Careers</a></p>
          <p><a href="#">Registrar</a></p>
          <p><a href="#">News</a></p>
          <p><a href="#">Financial Aid</a></p>
          <p><a href="#">Contact Us</a></p>
          <p><a href="#">Campus Location</a></p>
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
