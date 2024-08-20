import React from 'react';
import styles from './MajorCard.module.css';
import desk from '../../assets/images/desk.png';
import { Link } from 'react-router-dom';
import { Major } from '../../features/api/types';

type MajorCardProps = {
  major: Major;
};

const MajorCard: React.FC<MajorCardProps> = ({ major }) => {
  return (
    <div className={styles.card}>
      <img 
        src={desk} 
        alt="Major Image" 
        className={styles.image} 
      />
      <Link to={`/majors/${major.id}`}>
      <div className={styles.overlay}>
        <p className={styles.majorName}>{major.name}</p>
      </div>
      </Link>
    </div>
  );
};

export default MajorCard;
