import React from 'react';
import Navbar from '../Navbar/Navbar';
import Button from '../Button/Button';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  backgroundImage: string;
  headingText: string;
  showButton?: boolean;
  welcomeText?: string;
  imageOpacity?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  headingText,
  showButton = true,
  welcomeText,
}) => {
  return (
    <div
      className={styles.heroSection}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <Navbar />
      <div className={styles.content}>
        {welcomeText && <h2 className={styles.welcomeText}>{welcomeText}</h2>}
        <div className={styles.separatorContainer}>
          <hr className={`${styles.separator} ${styles.separatorLeft}`} />
          <h1 className={showButton ? styles.headingLarge : styles.headingSmall}>{headingText}</h1>
          <hr className={`${styles.separator} ${styles.separatorRight}`} />
        </div>
        {showButton && <Button href="/admissions/apply">Apply Now</Button>
        }
      </div>
    </div>
  );
};

export default HeroSection;
