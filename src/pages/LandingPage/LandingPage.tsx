import React from 'react'
import HeroSection from '../../components/HeroSection/HeroSection'
import WelcomeSection from '../../components/WelcomeSection/WelcomeSection'
import NewsSection from '../../components/NewsSection/NewsSection'
import FacultiesSection from '../../components/FacultiesSection/FacultiesSection'
import MajorSuggestorSection from '../../components/MajorSuggestorSection/MajorSuggestorSection'
import EventList from '../../components/EventList/EventList'
import LifeSection from '../../components/LifeSection/LifeSection'
import Footer from '../../components/Footer/Footer'
import landingImage from '../../assets/images/cambridge.jpeg'

const LandingPage = () => {
  return (
    <div>
      <HeroSection
        backgroundImage={landingImage}
        headingText="SmartCampus"
        showButton={true}
      />
      <WelcomeSection />
      <NewsSection />
      <FacultiesSection />
      <MajorSuggestorSection />
      <EventList />
      <LifeSection />
      <Footer />
    </div>
  )
}

export default LandingPage