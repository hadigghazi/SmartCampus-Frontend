import React from 'react';
import LifeImage from '../../assets/images/life.jpg';
import styles from './LifeSection.module.css'; 

const LifeSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Life On Campus</h2>
      <h1 className={styles.headingPrimary}>Explore Life On Campus</h1>
      <div className={styles.contentWrapper}>
          <img
            src={LifeImage}
            alt="SmartCampus Students"
            className={styles.image}
          />
      </div>
    </div>
  );
};

export default LifeSection;
