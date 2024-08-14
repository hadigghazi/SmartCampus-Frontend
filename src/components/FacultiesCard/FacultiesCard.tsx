import React from 'react';
import styles from './FacultiesCard.module.css'; 
import Welcome2 from '../../assets/images/Welcome2.png';

const FacultiesCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <img 
        src={Welcome2}
        alt="Faculty Image" 
        className={styles.image} 
      />
      <div className={styles.overlay}>
        <p className={styles.facultyName}>Faculty Of Sciences</p>
      </div>
    </div>
  );
};

export default FacultiesCard;
