import React from 'react';
import { useParams } from 'react-router-dom';
import styles from '../CourseDetails/CourseDetails.module.css';
import { useGetCenterByIdQuery } from '../../../features/api/centersApi';
import AdminLayout from '../AdminLayout';
import Spinner from '../../../components/Spinner/Spinner';

const CenterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: center, error, isLoading } = useGetCenterByIdQuery(Number(id));

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (error) return <div>Error loading center details</div>;
  if (!center) return <div>Center not found</div>;

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.content}>
        <h1 className={styles.headingPrimary}>{center.name}</h1>
        <h2 className={styles.headingSecondary} style={{marginTop: "3rem"}}>- Overview</h2>
        <p className={styles.text}>{center.overview}</p>
        <h2 className={styles.headingSecondary} style={{marginTop: "3rem"}}>- Vision</h2>
        <p className={styles.text}>{center.vision}</p>
        <h2 className={styles.headingSecondary} style={{marginTop: "3rem"}}>- Mission</h2>
        <p className={styles.text}>{center.mission}</p>
      </div>
    </AdminLayout>
  );
};

export default CenterDetails;
