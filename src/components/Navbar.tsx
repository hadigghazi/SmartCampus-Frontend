import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center p-6 absolute w-full top-0 left-0 z-10 bg-transparent">
      <div className="text-2xl font-bold text-[#123962]">🏛️</div>
      <ul className="flex space-x-8 text-[#123962]">
        <li><a href="#admissions" className="hover:text-blue-900">Admissions</a></li>
        <li><a href="#academics" className="hover:text-blue-900">Academics</a></li>
        <li><a href="#campuses" className="hover:text-blue-900">Campuses</a></li>
        <li><a href="#library" className="hover:text-blue-900">Library</a></li>
        <li><a href="#portal" className="hover:text-blue-900">Portal</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
