import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import WelcomeSection from './components/WelcomeSection/WelcomeSection';
import NewsSection from './components/NewsSection/NewsSection';

const App: React.FC = () => {
  return (
    <div className="App">
      <HeroSection />
      <WelcomeSection />
      <NewsSection />
    </div>
  );
};

export default App;
