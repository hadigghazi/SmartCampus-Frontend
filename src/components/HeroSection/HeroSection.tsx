import React from 'react';
import Navbar from '../Navbar/Navbar';
import Button from '../Button/Button';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <div className={styles.heroSection}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.separatorContainer}>
          <hr className={`${styles.separator} ${styles.separatorLeft}`} />
          <h1 className={styles.heading}>SmartCampus</h1>
          <hr className={`${styles.separator} ${styles.separatorRight}`} />
        </div>
        <Button className={styles.button}>Apply Now</Button>
      </div>
    </div>
  );
};

export default HeroSection;
