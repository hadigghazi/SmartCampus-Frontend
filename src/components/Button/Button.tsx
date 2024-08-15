import React from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom'; 

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string; 
}

const Button: React.FC<ButtonProps> = ({ children, onClick, href }) => {
  if (href) {
    return (
      <Link to={href} className={styles.button}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
