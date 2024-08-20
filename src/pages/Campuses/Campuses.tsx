import React from 'react';
import styles from './Campuses.module.css';
import headerImage from '../../assets/images/Pages_header.jpg';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import CampusCard from '../../components/CampusCard/CampusCard';
import { useGetCampusesQuery } from '../../features/api/campusesApi';

const Campuses: React.FC = () => {
  const { data: campuses, error, isLoading } = useGetCampusesQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading campuses</p>;

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Campuses Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>Campuses</h1>
      </div>
      <div className={styles.content}>
      <h2 className={styles.headingSecondary}>- Our Campuses</h2>
      <h1 className={styles.headingPrimary}>Explore Campuses</h1>
      <div className={styles.campuses}>
        {campuses?.map((campus) => (
          <CampusCard
            key={campus.id}
            id={campus.id}
            name={campus.name}
            image={headerImage} 
          />
        ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Campuses;
