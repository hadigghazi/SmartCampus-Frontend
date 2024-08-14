import React from 'react';
import styles from './Button.module.css'; // Import the CSS Module

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={styles.button} // Apply CSS Module class
    >
      {children}
    </button>
  );
};

export default Button;
