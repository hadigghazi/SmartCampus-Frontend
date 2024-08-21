import React from 'react';
import styles from './DeanCard.module.css';

interface DeanCardProps {
  image: string;
  name: string;
  description: string;
}

const DeanCard: React.FC<DeanCardProps> = ({ image, name, description }) => {
  return (
    <div className={styles.deanCard}>
      <img src={image} alt={`${name}`} className={styles.deanImage} />
      <h3 className={styles.deanName}>{name}</h3>
      <p className={styles.deanDescription}>{description}</p>
    </div>
  );
};

export default DeanCard;
