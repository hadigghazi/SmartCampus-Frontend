import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from '../AdmissionRequirements/AdmissionRequirements.module.css';
import { useParams } from 'react-router-dom';
import { useGetCenterByIdQuery } from '../../../features/api/centersApi';
import Spinner from '../../../components/Spinner/Spinner';

const CenterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: center, error, isLoading } = useGetCenterByIdQuery(Number(id));

  if (isLoading) return <Spinner />;
  if (error || !center) return <p>Error loading center details</p>;

  return (
    <AdmissionsLayout title={center?.name || "Center Details"}>
      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.headingSecondary}>- Overview</h2>
          <h1 className={styles.headingPrimary}>{center.name} Overview</h1>
          <p className={styles.text}>{center.overview}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.headingSecondary}>- Vision</h2>
          <h1 className={styles.headingPrimary}> {center.name} Vision</h1>
          <p className={styles.text}>{center.vision}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.headingSecondary}>- Mission</h2>
          <h1 className={styles.headingPrimary}> {center.name} Mission</h1>
          <p className={styles.text}>{center.mission}</p>
        </section>
      </div>
    </AdmissionsLayout>
  );
};

export default CenterPage;
