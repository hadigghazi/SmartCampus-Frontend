import React from 'react';
import Welcome1 from '../../assets/images/MajorSuggestor.png';
import Button from '../Button/Button';
import styles from './MajorSuggestorSection.module.css'; 

const MajorSuggestorSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- AI Powered Major Suggestion</h2>
      <h1 className={styles.headingPrimary}>Try Our AI Major Suggestor</h1>
      <div className={styles.contentWrapper}>
        <div className={styles.imageWrapper}>
          <img
            src={Welcome1}
            alt="SmartCampus Building"
            className={styles.image}
          />
        </div>
        <div className={styles.textWrapper}>
          <p className={styles.paragraph}>
            Our AI Major Suggestor is a smart tool designed to help students choose the right major based on their interests, strengths, and career goals. By leveraging advanced algorithms and machine learning, it provides personalized recommendations, guiding students toward the most suitable academic path and ensuring a successful and fulfilling educational journey.
          </p>
          <div className={styles.buttonContainer}>
            <Button>Try It Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MajorSuggestorSection;
