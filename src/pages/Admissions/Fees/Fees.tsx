import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './Fees.module.css';

const Fees: React.FC = () => {
  return (
    <AdmissionsLayout title="Fees">
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Fees</h2>
      <h1 className={styles.headingPrimary}>Undergraduate Programs</h1>
        <p className={styles.text}>
        SmartCampus is committed to providing a high-quality education at a competitive cost. Our fee structure is designed to be transparent and straightforward, ensuring that students and their families can plan their finances effectively. Below are the details of the fees for our undergraduate programs, including the price per credit hour for each faculty.
      </p>

      <h3 className={styles.headingSecondary}>General Fee</h3>
      <ul className={styles.list}>
        <li>Application Fee: 1,000,000 LBP (non-refundable, covers the application, program-specific assessments, and the English Language Placement Test)</li>
        <li>Registration Fee: 500,000 LBP per semester</li>
        <li>Library Fee: 200,000 LBP per semester</li>
        <li>Lab Fee: 300,000 LBP per semester (if applicable)</li>
      </ul>

      <h3 className={styles.headingSecondary}>Tuition Fees per Credit</h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <caption>Undergraduate Programs Tuition Fees</caption>
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Price per Credit Hour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Engineering</td>
              <td>1,500,000 LBP</td>
            </tr>
            <tr>
              <td>Business</td>
              <td>1,200,000 LBP</td>
            </tr>
            <tr>
              <td>Arts and Humanities</td>
              <td>1,000,000 LBP</td>
            </tr>
            <tr>
              <td>Science</td>
              <td>1,300,000 LBP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className={styles.headingSecondary}>Payment Plans</h3>
      <p className={styles.text}>
        SmartCampus offers flexible payment plans to help manage your education expenses. For more information on available payment plans and to set up a plan that suits your needs, please contact our Financial Services Office.
      </p>

      <h3 className={styles.headingSecondary}>Financial Aid and Scholarships</h3>
      <p className={styles.text}>
        We understand that financing your education can be challenging. SmartCampus offers various financial aid options and scholarships to help make education accessible to all. For more information on eligibility and application procedures, please visit our Financial Aid Office or check our website.
      </p>

      <h3 className={styles.headingSecondary}>Important Notes</h3>
      <ul className={styles.list}>
        <li>Fees are subject to change; please check our website for the most up-to-date information.</li>
        <li>All fees must be paid by the specified deadlines to avoid late payment penalties.</li>
        <li>Refund policies are outlined in the Student Handbook; please refer to it for more details.</li>
      </ul>

      <h2 className={styles.headingSecondary} style={{marginTop: "10rem"}}>- Fees</h2>
      <h1 className={styles.headingPrimary}>Graduate Programs</h1>
        <p className={styles.text}>
        SmartCampus is committed to providing a high-quality education at a competitive cost. Our fee structure is designed to be transparent and straightforward, ensuring that students and their families can plan their finances effectively. Below are the details of the fees for our graduate programs, including the price per credit hour for each faculty.
      </p>

      <h3 className={styles.headingSecondary}>General Fee</h3>
      <ul className={styles.list}>
        <li>Application Fee: 1,200,000 LBP (non-refundable, covers the application, program-specific assessments, and the English Language Placement Test)</li>
        <li>Registration Fee: 800,000 LBP per semester</li>
        <li>Library Fee: 300,000 LBP per semester</li>
        <li>Lab Fee: 500,000 LBP per semester (if applicable)</li>
      </ul>

      <h3 className={styles.headingSecondary}>Tuition Fees per Credit</h3>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <caption>Graduate Programs Tuition Fees</caption>
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Price per Credit Hour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Engineering</td>
              <td>1,800,000 LBP</td>
            </tr>
            <tr>
              <td>Business</td>
              <td>1,500,000 LBP</td>
            </tr>
            <tr>
              <td>Arts and Humanities</td>
              <td>1,200,000 LBP</td>
            </tr>
            <tr>
              <td>Science</td>
              <td>1,600,000 LBP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className={styles.headingSecondary}>Payment Plans</h3>
      <p className={styles.text}>
        SmartCampus offers flexible payment plans to help manage your education expenses. For more information on available payment plans and to set up a plan that suits your needs, please contact our Financial Services Office.
      </p>

      <h3 className={styles.headingSecondary}>Financial Aid and Scholarships</h3>
      <p className={styles.text}>
        We understand that financing your education can be challenging. SmartCampus offers various financial aid options and scholarships to help make education accessible to all. For more information on eligibility and application procedures, please visit our Financial Aid Office or check our website.
      </p>

      <h3 className={styles.headingSecondary}>Important Notes</h3>
      <ul className={styles.list}>
        <li>Fees are subject to change; please check our website for the most up-to-date information.</li>
        <li>All fees must be paid by the specified deadlines to avoid late payment penalties.</li>
        <li>Refund policies are outlined in the Student Handbook; please refer to it for more details.</li>
      </ul>

      <p className={styles.text}>
        For any questions or further assistance, please contact the SmartCampus Admissions Office.
      </p>
    </div>
    </AdmissionsLayout>
  );
};

export default Fees;
