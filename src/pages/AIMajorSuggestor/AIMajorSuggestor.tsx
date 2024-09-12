import React, { useState } from 'react';
import axios from 'axios';
import headerImage from '../../assets/images/Pages_header.jpg';
import styles from './AIMajorSuggestor.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
const apiUrl = import.meta.env.VITE_BASE_URL;

const AIMajorSuggestor: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [preferences, setPreferences] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/suggest-major`, {
        interests,
        skills,
        preferences
      });

      let formattedSuggestion = response.data.suggested_major;
      formattedSuggestion = formattedSuggestion
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/### (.*?)\n/g, '<h3>$1</h3>') 
        .replace(/\n/g, '<br/>'); 

      setSuggestion(formattedSuggestion);
    } catch (error) {
      console.error('Error suggesting major:', error);
      setSuggestion('An error occurred while suggesting a major. Please try again.');
    }
  };

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="AI Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>AI Major Suggestions</h1>
      </div>
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Get Major Suggestions</h2>
        <h1 className={styles.headingPrimary}>Our AI Major Suggestor</h1>
        <p className={styles.text}>
          Our AI Major Suggestion system is designed to recommend academic majors based on your
          interests, skills, and career goals. By analyzing your preferences and inputs, the AI
          suggests suitable fields of study that align with your strengths and aspirations, helping
          you make informed decisions about your educational and professional paths.
        </p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="interests">Interests</label>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              required
              placeholder="Enter your interests"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="skills">Skills</label>
            <input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              placeholder="Enter your skills"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="preferences">Preferences (optional)</label>
            <input
              type="text"
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Enter any preferences"
            />
          </div>
          <button type="submit" className={styles.submitButton}>Get Suggestion</button>
        </form>

        {suggestion && (
          <div className={styles.suggestion}>
            <h2>Suggested Major:</h2>
            <div dangerouslySetInnerHTML={{ __html: suggestion }} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AIMajorSuggestor;
