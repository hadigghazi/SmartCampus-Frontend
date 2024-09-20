import React from 'react';
import AcademicsLayout from '../AcademicsLayout';
import styles from './GradingSystem.module.css';

const GradingSystem: React.FC = () => {
  return (
    <AcademicsLayout title="Grading System">
      <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Here’s How We Measure Your Grades</h2>
      <h1 className={styles.headingPrimary}>Our Grading System</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Letter Grade</th>
              <th>GPA</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>4</td>
              <td>Over 90%</td>
            </tr>
            <tr>
              <td>B</td>
              <td>3</td>
              <td>Over 80%</td>
            </tr>
            <tr>
              <td>C</td>
              <td>2</td>
              <td>Over 70%</td>
            </tr>
            <tr>
              <td>D</td>
              <td>1</td>
              <td>Over 60%</td>
            </tr>
            <tr>
              <td>F</td>
              <td>0</td>
              <td>Below 60%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AcademicsLayout>
  );
};

export default GradingSystem;
