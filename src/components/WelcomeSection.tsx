import React from 'react';
import Welcome1 from '../assets/images/Welcome1.png';
import Welcome2 from '../assets/images/Welcome2.png';
import Button from './Button';

const WelcomeSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 mt-28">
      <div className="flex flex-col md:flex-row items-start justify-center">
        <div className="relative">
          <img
            src={Welcome2}
            alt="SmartCampus Building"
            className="w-[2000px] mt-8 ml-8 h-auto rounded-sm shadow-lg"
          />
          <img
            src={Welcome1}
            alt="SmartCampus Building"
            className="absolute mt-8 ml-8 top-52 left-48 w-[2000px] h-auto rounded-sm shadow-lg"
          />
        </div>

        <div className="mt-8 md:mt-0 md:ml-[300px]">
          <h2 className="text-bluePrimary text-2xl font-semibold mb-4 font-sans">- Welcome To</h2>
          <h1 className="text-bluePrimary text-4xl font-bold mb-4 font-sans">SmartCampus</h1>
          <p className="text-bluePrimary text-xl mb-4 font-metrophobic">
            At SmartCampus, our values of Modernity, Smart Solutions, and Forward Thinking drive everything we do. Established in 2024, SmartCampus has rapidly emerged as one of the leading higher education institutions in the country, known for its innovative programs and cutting-edge approach to education.
          </p>
          <p className="text-bluePrimary text-xl mb-6 font-metrophobic">
            Our mission is to empower students with the skills and knowledge needed to excel in a competitive global market. We prioritize educational equity, ensuring that quality education is accessible to all, and fostering a diverse and inclusive learning environment. At SmartCampus, we prepare our students to become future leaders and innovators, ready to make a meaningful impact on the world.
          </p>

          <div className="flex space-x-4">
            <Button>Read More</Button>
            <Button>Apply Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
