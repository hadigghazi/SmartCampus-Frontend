import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './FloatingButton.module.css'; 

interface FloatingButtonProps {
  linkTo: string;
  icon: any; 
  ariaLabel: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ linkTo, icon, ariaLabel }) => {
  return (
    <Link to={linkTo} className={styles.floatingButton} aria-label={ariaLabel}>
      <FontAwesomeIcon icon={icon} size="2x" />
    </Link>
  );
};

export default FloatingButton;
