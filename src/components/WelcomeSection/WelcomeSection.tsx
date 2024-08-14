import React from 'react';
import Welcome1 from '../../assets/images/Welcome1.png';
import Button from '../Button/Button';
import styles from './WelcomeSection.module.css';

const WelcomeSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageContainer}>
          <img
            src={Welcome1}
            alt="SmartCampus Building"
            className={styles.image1}
          />
        </div>

        <div className={styles.textContainer}>
          <h2 className={styles.headingSecondary}>- Welcome To</h2>
          <h1 className={styles.headingPrimary}>SmartCampus</h1>
          <p className={styles.paragraph}>
            At SmartCampus, our values of Modernity, Smart Solutions, and Forward Thinking drive everything we do. Established in 2024, SmartCampus has rapidly emerged as one of the leading higher education institutions in the country, known for its innovative programs and cutting-edge approach to education.
          </p>
          <p className={styles.paragraph}>
            Our mission is to empower students with the skills and knowledge needed to excel in a competitive global market. We prioritize educational equity, ensuring that quality education is accessible to all, and fostering a diverse and inclusive learning environment. At SmartCampus, we prepare our students to become future leaders and innovators, ready to make a meaningful impact on the world.
          </p>

          <div className={styles.buttonContainer}>
            <Button>Read More</Button>
            <Button>Apply Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
