import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import aboutImage from '../../assets/images/Hero_about.jpg';

const AboutPage: React.FC = () => {
  return (
    <div>
       <HeroSection
        backgroundImage={aboutImage}
        headingText="SmartCampus"
        showButton={false}
        welcomeText="Welcome to"
      />
    </div>
  );
};

export default AboutPage;
