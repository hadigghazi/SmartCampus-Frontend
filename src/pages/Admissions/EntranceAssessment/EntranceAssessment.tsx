import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from '../AdmissionRequirements/AdmissionRequirements.module.css';

const EntranceAssessment: React.FC = () => {
  return (
    <AdmissionsLayout title="Assessment">
    <div className={styles.container}>
    <h2 className={styles.headingSecondary}>- How To Get Accepted?</h2>
      <h1 className={styles.headingPrimary}>Undergraduate Programs</h1>
        <p className={styles.text}>
        To ensure that incoming students are well-prepared for the rigors of graduate study, SmartCampus requires all applicants to complete an entrance assessment specific to their chosen faculty. These assessments are designed to evaluate the applicant's proficiency in English and their readiness for the specialized coursework within their field of study.
      </p>

      <h3 className={styles.headingSecondary}>Entrance Assessments by Faculty</h3>
      <ul className={styles.list}>
        <li><strong>Faculty of Engineering:</strong></li>
        <ul className={styles.list}>
          <li>English Language Proficiency Test</li>
          <li>Mathematics and Engineering Fundamentals Exam</li>
        </ul>
        
        <li><strong>Faculty of Business Administration:</strong></li>
        <ul className={styles.list}>
          <li>English Language Proficiency Test</li>
          <li>Business and Management Knowledge Exam</li>
        </ul>

        <li><strong>Faculty of Arts and Sciences:</strong></li>
        <ul className={styles.list}>
          <li>English Language Proficiency Test</li>
          <li>Discipline-Specific Exam (e.g., Biology, Chemistry, Physics, depending on the program)</li>
        </ul>

        <li><strong>Faculty of Law:</strong></li>
        <ul className={styles.list}>
          <li>English Language Proficiency Test</li>
          <li>Law and Legal Studies Exam</li>
        </ul>

        <li><strong>Faculty of Health Sciences:</strong></li>
        <ul className={styles.list}>
          <li>English Language Proficiency Test</li>
          <li>Health Sciences Knowledge Exam (e.g., Biology, Anatomy, depending on the program)</li>
        </ul>
      </ul>

      <h2 className={styles.headingSecondary}>English Language Proficiency Test</h2>
      <p className={styles.text}>
        Prospective applicants must demonstrate their English language proficiency either by submitting scores from internationally recognized examinations (such as IELTS, TOEFL) or by taking the SmartCampus English Language Placement Test.
      </p>

      <h2 className={styles.headingSecondary}>Program-Specific Assessments</h2>
      <p className={styles.text}>
        Each faculty requires an additional exam tailored to the specific knowledge and skills necessary for the graduate program. This ensures that all students have a strong foundational understanding of their chosen field before beginning their advanced studies.
      </p>

      <h2 className={styles.headingSecondary} style={{marginTop: '5rem'}}>- How To Get Accepted?</h2>
      <h1 className={styles.headingPrimary}>Graduate Programs</h1>
        <p className={styles.text}>
        For graduate programs, the English assessment is required, plus an interview with taking your undergraduate grades into consideration.
      </p>

      <h2 className={styles.headingSecondary}>Download the PDF guidelines for your entrance assessments:</h2>
      <ul className={styles.list}>
        <li><a href="/path-to-pdf/engineering.pdf" className={styles.text}>Faculty of Engineering Entrance Exam Requirements</a></li>
        <li><a href="/path-to-pdf/business.pdf" className={styles.text}>Faculty of Business Administration Entrance Exam Requirements</a></li>
        <li><a href="/path-to-pdf/arts-sciences.pdf" className={styles.text}>Faculty of Arts and Sciences Entrance Exam Requirements</a></li>
        <li><a href="/path-to-pdf/law.pdf" className={styles.text}>Faculty of Law Entrance Exam Requirements</a></li>
        <li><a href="/path-to-pdf/health-sciences.pdf" className={styles.text}>Faculty of Health Sciences Entrance Exam Requirements</a></li>
      </ul>
    </div>
    </AdmissionsLayout>
  );
};

export default EntranceAssessment;
