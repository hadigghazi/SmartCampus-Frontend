import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './CenterPage.module.css';

const CenterPage: React.FC = () => {
  return (
    <AdmissionsLayout title="Language Center">
      <div className={styles.container}>
        <section className={styles.section}>
        <h2 className={styles.headingSecondary}>- Languages Center</h2>
      <h1 className={styles.headingPrimary}>Overview</h1>
       <p className={styles.text}>
            The Language Center at [University Name] is dedicated to fostering linguistic excellence and cultural understanding among our diverse student body. We offer a wide range of language courses, resources, and immersive experiences designed to help students master new languages and gain a deeper appreciation for global cultures. Our center is equipped with state-of-the-art language labs, interactive learning tools, and a team of experienced instructors committed to helping students achieve fluency and confidence in their chosen languages. Whether you're a beginner or seeking advanced proficiency, the Language Center is your gateway to a world of opportunities.
          </p>
        </section>

        <section className={styles.section}>
        <h2 className={styles.headingSecondary}>- Languages Center</h2>
      <h1 className={styles.headingPrimary}>Vision</h1>
       <p className={styles.text}>
            To be a leading center of language learning and cultural exchange, empowering students to become global citizens who are linguistically proficient and culturally aware. We envision a world where language is not a barrier but a bridge that connects people, promotes understanding, and fosters meaningful communication across diverse communities.
          </p>
        </section>

        <section className={styles.section}>
        <h2 className={styles.headingSecondary}>- Languages Center</h2>
      <h1 className={styles.headingPrimary}>Mission</h1>
       <p className={styles.text}>
            Our mission is to provide high-quality language education that equips students with the skills and knowledge necessary to thrive in a globalized world. We are committed to:
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Offering a comprehensive curriculum that covers a wide range of languages and levels of proficiency.</li>
            <li className={styles.listItem}>Providing a supportive and inclusive learning environment that encourages active participation and cultural immersion.</li>
            <li className={styles.listItem}>Promoting intercultural competence through language learning, enabling students to engage respectfully and effectively with people from diverse backgrounds.</li>
            <li className={styles.listItem}>Utilizing innovative teaching methods and technology to enhance language acquisition and make learning accessible to all students.</li>
          </ul>
        </section>
      </div>
    </AdmissionsLayout>
  );
};

export default CenterPage;
