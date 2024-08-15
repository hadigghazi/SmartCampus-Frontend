import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import aboutImage from '../../assets/images/Hero_about.jpg';
import presidentImage from '../../assets/images/president.jpg'; 
import styles from './AboutPage.module.css'; 

const AboutPage: React.FC = () => {
  return (
    <div>
      <HeroSection
        backgroundImage={aboutImage}
        headingText="SmartCampus"
        showButton={false}
        welcomeText="Welcome to"
      />
      <div className={styles.container}>
        <p className={styles.text}>
          At SmartCampus, our values of Modernity, Smart Solutions, and Forward Thinking drive everything we do. Established in 2024, SmartCampus has rapidly emerged as one of the leading higher education institutions in the country, known for its innovative programs and cutting-edge approach to education.
        </p>

        <p className={styles.text}>
          Our mission is to empower students with the skills and knowledge needed to excel in a competitive global market. We prioritize educational equity, ensuring that quality education is accessible to all, and fostering a diverse and inclusive learning environment. At SmartCampus, we prepare our students to become future leaders and innovators, ready to make a meaningful impact on the world.
        </p>

        <h2 className={styles.headingSecondary}>- Our President</h2>
        <h1 className={styles.headingPrimary}>A Welcome Message From Our President</h1>

        <div className={styles.imageContainer}>
          <img
            src={presidentImage}
            alt="President of SmartCampus"
            className={styles.image}
          />
        </div>

        <p className={styles.additionalText}>
          Welcome to SmartCampus, where modern education meets innovation and forward thinking. Since our founding in 2024, we have dedicated ourselves to creating an environment that fosters academic excellence, inclusivity, and cutting-edge learning.
          <br /><br />
          At SmartCampus, we believe in equipping our students with the skills and knowledge they need to thrive in a rapidly evolving world. Our commitment to educational equity ensures that every student has access to quality education, empowering them to become future leaders and innovators.
          <br /><br />
          I am proud of our diverse community of students, faculty, and staff who contribute to making SmartCampus a dynamic and inspiring place to learn and grow. Together, we are shaping the future of education, one smart solution at a time.
          <br /><br />
          Thank you for Taking Interest in SmartCampus.
          <br /><br />
          Hadi Ghazi President, SmartCampus
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
