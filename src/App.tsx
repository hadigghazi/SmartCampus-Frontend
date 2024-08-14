import React from 'react';
import HeroSection from './components/HeroSection';
import WelcomeSection from './components/WelcomeSection';

const App: React.FC = () => {
  return (
    <div className="App">
      <HeroSection />
      <WelcomeSection />
    </div>
  );
};

export default App;
