import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import NewsSection from './components/NewsSection/NewsSection';
import FacultiesSection from './components/FacultiesSection/FacultiesSection';
import MajorSuggestorSection from './components/MajorSuggestorSection/MajorSuggestorSection';

const App: React.FC = () => {
  return (
    <div className="App">
      <HeroSection />
      <WelcomeSection />
      <NewsSection />
      <FacultiesSection />
      <MajorSuggestorSection />
    </div>
  );
};

export default App;
