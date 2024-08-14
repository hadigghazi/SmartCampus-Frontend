import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#EEC0DD] font-metrophobic font-semibold text-[#123962] py-4 px-14 mt-5 rounded-lg text-2xl hover:bg-pink-300 transition-colors"
    >
      {children}
    </button>
  );
};

export default Button;
