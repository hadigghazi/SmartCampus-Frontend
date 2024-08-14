import React from 'react';
import Navbar from './Navbar';
import Button from './Button';
import heroImage from '../assets/images/Hero.png';

const HeroSection: React.FC = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-end h-full text-center text-[#123962] pb-16 transform translate-y-8">
        <div className="flex items-center justify-center w-full px-8">
          <hr className="border-t-[10px] border-[#123962] flex-grow opacity-85 transform -translate-x-8" style={{ height: '10px' }} />
          <h1 className="text-7xl font-bold opacity-85">SmartCampus</h1>
          <hr className="border-t-[10px] border-[#123962] flex-grow opacity-85 transform translate-x-8" style={{ height: '10px' }} />
        </div>
        <Button className="mt-8 opacity-85">Apply Now</Button>
      </div>
    </div>
  );
};

export default HeroSection;
