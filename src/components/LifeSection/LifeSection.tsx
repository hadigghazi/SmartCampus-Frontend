import React from 'react';
import LifeImage from '../../assets/images/life.jpg';
import styles from './LifeSection.module.css'; 
import { Link } from 'react-router-dom';

const LifeSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Life On Campus</h2>
      <h1 className={styles.headingPrimary}>Explore Life On Campus</h1>
      <div className={styles.contentWrapper}>
        <Link to="/life-on-campus" className={styles.imageWrapper}>
          <img
            src={LifeImage}
            alt="SmartCampus Students"
            className={styles.image}
          />
        </Link>
      </div>
    </div>
  );
};

export default LifeSection;
