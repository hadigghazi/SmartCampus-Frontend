import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CampusCard.module.css';

interface CampusCardProps {
  id: number;
  name: string;
  image: string;
}

const CampusCard: React.FC<CampusCardProps> = ({ id, name, image }) => {
  return (
    <Link to={`/campuses/${id}`} className={styles.card}>
      <img src={image} alt={name} className={styles.image} />
      <div className={styles.overlay}>
        <p className={styles.name}>{name}</p>
      </div>
    </Link>
  );
};

export default CampusCard;
