import React from 'react';
import { Major } from '../../features/api/types';
import styles from './MajorCard.module.css';

interface MajorCardProps {
  major: Major;
}

const MajorCard: React.FC<MajorCardProps> = ({ major }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{major.name}</h3>
      <p className={styles.description}>{major.description}</p>
    </div>
  );
};

export default MajorCard;
