import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './FinancialAidAndScholarships.module.css';

const FinancialAidAndScholarships: React.FC = () => {
  return (
    <AdmissionsLayout title="Financial Aid And Scholarships">
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Apply For</h2>
      <h1 className={styles.headingPrimary}>Financial Aid Or Scholarship</h1>
         <p className={styles.text}>
        At SmartCampus, we believe that financial constraints should not be a barrier to accessing quality education. To support our students in achieving their academic goals, we offer a variety of financial aid options and scholarships.
      </p>
      
      <h2 className={styles.headingSecondary}>Types of Financial Aid</h2>
      <ul className={styles.list}>
        <li><strong>Need-Based Financial Aid:</strong> Designed for students who demonstrate significant financial need. Aid packages may cover tuition, fees, and other educational expenses.</li>
        <li><strong>Merit-Based Scholarships:</strong> Awarded to students with exceptional academic achievements, leadership qualities, and extracurricular involvement.</li>
        <li><strong>Graduate Assistantships:</strong> Opportunities for graduate students to work on campus in exchange for tuition remission and a stipend.</li>
        <li><strong>Special Scholarships:</strong> Targeted scholarships for students in specific programs, fields of study, or demographic groups.</li>
      </ul>

      <h2 className={styles.headingSecondary}>How to Apply?</h2>
      <ol className={styles.list}>
        <li>Complete the Financial Aid Application: Fill out the SmartCampus Financial Aid Application form, available on our website <a href="/financial-aid-application" className={styles.text}>here</a>.</li>
        <li>Submit Supporting Documents: Provide necessary documentation to demonstrate financial need, such as tax returns, income statements, and other relevant financial information.</li>
        <li>Scholarship Applications: Some scholarships may require additional applications or essays. Check specific scholarship details for requirements and deadlines.</li>
      </ol>

      <h2 className={styles.headingSecondary}>Application Deadlines</h2>
      <ul className={styles.list}>
        <li>Fall Semester: July 31</li>
        <li>Spring Semester: December 15</li>
      </ul>

      <h2 className={styles.headingSecondary}>Important Notes</h2>
      <ul className={styles.list}>
        <li>Renewal Requirements: Many financial aid packages and scholarships require students to maintain a certain GPA or meet other criteria to renew aid each year.</li>
        <li>Combination of Aid: Students may be eligible for multiple forms of financial aid and scholarships. Our Financial Aid Office will work with you to create a comprehensive aid package.</li>
        <li>Confidentiality: All financial aid applications and supporting documents are kept confidential and are only used for the purpose of determining aid eligibility.</li>
      </ul>

      <p className={styles.text}>
        For more information and to download application forms, please visit the SmartCampus Financial Aid Office or contact us on this email <a href="mailto:aid@gmail.com" className={styles.text}>aid@gmail.com</a> directly. We are here to help you navigate the financial aid process and ensure you have the resources you need to succeed.
      </p>
    </div>
    </AdmissionsLayout>
  );
};

export default FinancialAidAndScholarships;
