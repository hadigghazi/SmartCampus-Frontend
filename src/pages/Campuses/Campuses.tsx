import React from 'react';
import styles from './Campuses.module.css';
import headerImage from '../../assets/images/Pages_header.jpg';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Campuses: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Campuses Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>Campuses</h1>
      </div>
      <div className={styles.content}>
        
      </div>
      <Footer />
    </div>
  );
};

export default Campuses;
