import React from 'react';
import NavbarLogo from '../assets/images/NavBar_logo.png';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-6 absolute w-full top-0 left-0 z-10 bg-transparent font-sans">
      <img src={NavbarLogo} alt="header_logo" className="transform -translate-y-2 -translate-x-2" />
      <ul className="flex-1 flex justify-around items-center text-[#123962]">
        <li className="text-2xl font-bold hover:text-blue-900"><a href="#admissions">Admissions</a></li>
        <li className="text-2xl font-bold hover:text-blue-900"><a href="#academics">Academics</a></li>
        <li className="text-2xl font-bold hover:text-blue-900"><a href="#campuses">Campuses</a></li>
        <li className="text-2xl font-bold hover:text-blue-900"><a href="#library">Library</a></li>
        <li className="text-2xl font-bold hover:text-blue-900"><a href="#portal">Portal</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
