import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './Centers.module.css';
import { useNavigate } from 'react-router-dom';
import StudentImage from '../../../assets/images/student.png';
import { useGetCentersQuery } from '../../../features/api/centersApi';

const Centers: React.FC = () => {
  const navigate = useNavigate();
  const { data: centers, error, isLoading } = useGetCentersQuery();

  const handleCenterClick = (id: number) => {
    navigate(`/admissions/centers/${id}`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading centers</p>;

  return (
    <AdmissionsLayout title="Centers">
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Explore</h2>
        <h1 className={styles.headingPrimary}>Our Centers</h1>
        <div className={styles.grid}>
          {centers?.map((center) => (
            <div
              key={center.id}
              className={styles.gridItem}
              onClick={() => handleCenterClick(center.id)}
            >
              <img src={StudentImage} alt={center.name} className={styles.gridImage} />
              <div className={styles.gridLabel}>{center.name}</div>
            </div>
          ))}
        </div>
      </div>
    </AdmissionsLayout>
  );
};

export default Centers;
