import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './AdmissionRequirements.module.css';

const AdmissionRequirements: React.FC = () => {
  return (
    <AdmissionsLayout title="Requirements">
      <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Requirements</h2>
      <h1 className={styles.headingPrimary}>Undergraduate Programs</h1>
        <p className={styles.text}>
          SmartCampus offers a range of undergraduate programs across various disciplines, providing students with diverse academic opportunities. Supported by experienced faculty and state-of-the-art facilities, our programs emphasize hands-on learning and critical thinking, preparing students for successful careers and further academic pursuits.
        </p>

        <h2 className={styles.headingSecondary}>Application Requirements</h2>
        <ul className={styles.list}>
          <li>One passport-sized photo.</li>
          <li>A copy of your identity card or passport.</li>
          <li>Your official high school diploma or its recognized equivalent.</li>
          <li>Official scores for internationally recognized English language proficiency examinations (IELTS, TOEFL), if available. Alternatively, you can take the SmartCampus Undergraduate English Language Placement Test.</li>
          <li>A non-refundable application fee of 1,000,000 LBP, covering the application, major-specific placement tests, and the English Language Placement Test.</li>
        </ul>

        <h2 className={styles.headingSecondary}>Admissions Review</h2>
        <p className={styles.text}>
          The Admissions Committee at SmartCampus will conduct a comprehensive review of each application, considering the following factors:
        </p>
        <ul className={styles.list}>
          <li>Results from major-specific placement tests, required for each major applied for.</li>
          <li>English Language Placement Test results.</li>
          <li>High school diploma or its recognized equivalent by the relevant educational authority.</li>
        </ul>

        <h2 className={styles.headingSecondary}>English Language Proficiency</h2>
        <p className={styles.text}>
          Prospective applicants to SmartCampus must meet the university's undergraduate English language proficiency requirements. This can be done by either taking the SmartCampus Undergraduate English Language Placement Test or by submitting results from internationally recognized English language proficiency examinations (such as IELTS, TOEFL).
        </p>

        <h2 className={styles.headingSecondary} style={{marginTop: '10rem'}}>- Requirements</h2>
      <h1 className={styles.headingPrimary}>Graduate Programs</h1>
        
        <p className={styles.text}>
          SmartCampus offers an array of graduate programs designed to advance your knowledge and expertise in various fields. Our graduate programs are supported by distinguished faculty and state-of-the-art facilities, emphasizing research, innovation, and real-world application. We aim to prepare our students for leadership roles and impactful careers in their chosen disciplines.
        </p>

        <h2 className={styles.headingSecondary}>Application Requirements</h2>
        <ul className={styles.list}>
          <li>One passport-sized photo.</li>
          <li>A copy of your identity card or passport.</li>
          <li>Official transcripts from all post-secondary institutions attended.</li>
          <li>Your bachelor’s degree certificate or its recognized equivalent.</li>
          <li>A statement of purpose detailing your academic and career goals.</li>
          <li>Two letters of recommendation from academic or professional references.</li>
          <li>Official scores for internationally recognized English language proficiency examinations (IELTS, TOEFL, GRE), if available. Alternatively, you can take the SmartCampus Graduate English Language Placement Test.</li>
          <li>A non-refundable application fee of 1,200,000 LBP, covering the application, program-specific assessments, and the English Language Placement Test.</li>
        </ul>

        <h2 className={styles.headingSecondary}>Admissions Review</h2>
        <p className={styles.text}>
          The Admissions Committee at SmartCampus will conduct a comprehensive review of each application, considering the following factors:
        </p>
        <ul className={styles.list}>
          <li>Academic transcripts from all post-secondary institutions.</li>
          <li>Results from program-specific assessments, required for each program applied for.</li>
          <li>English Language Placement Test results.</li>
          <li>Bachelor’s degree certificate or its recognized equivalent.</li>
          <li>Statement of purpose.</li>
          <li>Letters of recommendation.</li>
        </ul>

        <h2 className={styles.headingSecondary}>Transferring from Another University</h2>
        <p className={styles.text}>
          SmartCampus welcomes applicants transferring from other universities. To ensure a smooth transition, please include the following additional documents:
        </p>
        <ul className={styles.list}>
          <li>Official transcripts from all previously attended universities.</li>
          <li>Course syllabi and descriptions for evaluation of transferable credits.</li>
        </ul>

        <h2 className={styles.headingSecondary}>English Language Proficiency</h2>
        <p className={styles.text}>
          Prospective applicants to SmartCampus must meet the university's graduate English language proficiency requirements. This can be done by either taking the SmartCampus Graduate English Language Placement Test or by submitting results from internationally recognized English language proficiency examinations (such as IELTS, TOEFL).
        </p>
      </div>
    </AdmissionsLayout>
  );
};

export default AdmissionRequirements;
