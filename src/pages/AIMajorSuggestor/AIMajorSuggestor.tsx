import React from 'react';
import headerImage from '../../assets/images/Pages_header.jpg';
import styles from './AIMajorSuggestor.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const AIMajorSuggestor: React.FC = () => {
 
  return <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="AI Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>AI Major Suggestions</h1>
      </div>
    <div className={styles.container}>
    <h2 className={styles.headingSecondary}>- Get Major Suggestions</h2>
    <h1 className={styles.headingPrimary}>Our AI Major Suggestor</h1>
    <p className={styles.text}>Our AI Major Suggestion is a system designed to recommend academic majors based on your interests, skills, and career goals. By analyzing your preferences and inputs, the AI suggests suitable fields of study that align with your strengths and aspirations, helping you making informed decisions about your educational and professional paths.</p>
    </div>
    <Footer />
  </div>
}

export default AIMajorSuggestor