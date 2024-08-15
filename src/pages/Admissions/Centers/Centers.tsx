import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './Centers.module.css';
import { useNavigate } from 'react-router-dom';
import StudentImage from '../../../assets/images/student.png';

const Centers: React.FC = () => {
  const navigate = useNavigate();

  const handleCenterClick = (path: string) => {
    navigate(path);
  };

  return (
    <AdmissionsLayout title="Centers">
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Explore</h2>
        <h1 className={styles.headingPrimary}>Our Centers</h1>
        <div className={styles.grid}>
          <div className={styles.gridItem} onClick={() => handleCenterClick('/admissions/centers/languages-center')}>
            <img src={StudentImage} alt="Languages Center" className={styles.gridImage} />
            <div className={styles.gridLabel}>Languages Center</div>
          </div>
          <div className={styles.gridItem} onClick={() => handleCenterClick('/admissions/centers/human-rights-center')}>
            <img src={StudentImage} alt="Human Rights Center" className={styles.gridImage} />
            <div className={styles.gridLabel}>Human Rights Center</div>
          </div>
          <div className={styles.gridItem} onClick={() => handleCenterClick('/admissions/centers/alumni-center')}>
            <img src={StudentImage} alt="Alumni Center" className={styles.gridImage} />
            <div className={styles.gridLabel}>Alumni Center</div>
          </div>
          <div className={styles.gridItem} onClick={() => handleCenterClick('/admissions/centers/research-center')}>
            <img src={StudentImage} alt="Research Center" className={styles.gridImage} />
            <div className={styles.gridLabel}>Research Center</div>
          </div>
        </div>
      </div>
    </AdmissionsLayout>
  );
};

export default Centers;
