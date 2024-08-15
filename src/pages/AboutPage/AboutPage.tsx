import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import aboutImage from '../../assets/images/Hero_about.jpg';
import VisionMission from '../../components/VisionMission/VisionMission';
import Footer from '../../components/Footer/Footer';
import Opening from '../../components/Opening/Opening';
import AboutText from '../../components/AboutText/AboutText';

const AboutPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        backgroundImage={aboutImage}
        headingText="SmartCampus"
        showButton={false}
        welcomeText="Welcome to"
      />
      <AboutText />
      <VisionMission />
      <Opening />
      <Footer />
    </div>
  );
};

export default AboutPage;
