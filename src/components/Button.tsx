import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#EEC0DD] text-[#123962] py-2 px-6 rounded-full text-lg hover:bg-pink-300 transition-colors"
    >
      {children}
    </button>
  );
};

export default Button;
