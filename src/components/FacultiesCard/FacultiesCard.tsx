import React from 'react';
import styles from './FacultiesCard.module.css'; 
import Welcome2 from '../../assets/images/Welcome2.png'; 
import { Link } from 'react-router-dom';

type FacultiesCardProps = {
  faculty: {
    id: number;
    name: string;
    description: string | null;
  };
}

const FacultiesCard: React.FC<FacultiesCardProps> = ({ faculty }) => {
  return (
    <div className={styles.card}>
      <img 
        src={Welcome2} 
        alt="Faculty Image" 
        className={styles.image} 
      />
      <Link to={`/faculties/${faculty.id}`}>
      <div className={styles.overlay}>
        <p className={styles.facultyName}>{faculty.name}</p>
      </div>
      </Link>
    </div>
  );
};

export default FacultiesCard;
