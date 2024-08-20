import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCampusByIdQuery } from '../../features/api/campusesApi';
import headerImage from '../../assets/images/Pages_header.jpg';
import styles from './CampusDetails.module.css';
import Navbar from '../../components/Navbar/Navbar';

const CampusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campus, isLoading, error } = useGetCampusByIdQuery(Number(id));

  if (isLoading) return <p>Loading...</p>;
  if (error || !campus) return <p>Error loading campus details</p>;
  
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Campuses Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>{campus.name}</h1>
      </div>
    <div className={styles.container}>
    <h2 className={styles.headingSecondary}>- About The Campus</h2>
      <h1 className={styles.headingPrimary}>{campus.name}</h1>
      <p className={styles.text}>{campus.location}</p>
        <p className={styles.text}>{campus.description}</p>
    </div>
    </div>
  );
};

export default CampusDetails;
