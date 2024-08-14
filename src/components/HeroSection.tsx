import React from 'react';
import Navbar from './Navbar';
import Button from './Button';
import heroImage from '../assets/images/Hero.png';

const HeroSection: React.FC = () => {
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full text-center text-[#123962]">
        <h1 className="text-6xl font-bold">SmartCampus</h1>
        <hr className="border-t-4 border-[#123962] w-32 my-4" />
        <Button>Apply Now</Button>
      </div>
    </div>
  );
};

export default HeroSection;
