import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCampusByIdQuery } from '../../features/api/campusesApi';
import { useGetDeansByCampusQuery } from '../../features/api/deansApi';
import headerImage from '../../assets/images/Pages_header.jpg';
import styles from './CampusDetails.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const CampusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(Number(id));
  const { data: deans, isLoading: deansLoading, error: deansError } = useGetDeansByCampusQuery(Number(id));

  const [facultyNames, setFacultyNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (deans && deans.length > 0) {
      const fetchFacultyNames = async () => {
        const names: Record<number, string> = {};

        for (const dean of deans) {
          const { data: facultyData } = useGetFacultyNameByDeanQuery(dean.id); // Fetch by dean ID
          if (facultyData) {
            names[dean.faculty_id] = facultyData.faculty_name;
          }
        }

        setFacultyNames(names);
      };

      fetchFacultyNames();
    }
  }, [deans]);

  if (campusLoading || deansLoading) return <p>Loading...</p>;
  if (campusError || !campus) return <p>Error loading campus details</p>;
  if (deansError) return <p>Error loading deans</p>;

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Campus Header" className={styles.headerImage} />
        <h1 className={styles.pageTitle}>{campus.name}</h1>
      </div>
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- About The Campus</h2>
        <h1 className={styles.headingPrimary}>{campus.name}</h1>
        <p className={styles.text}>{campus.location}</p>
        <p className={styles.text}>{campus.description}</p>
        
        <h2 className={styles.headingSecondary}>- Deans of This Campus</h2>
        {deans && deans.length > 0 ? (
          <div className={styles.deanList}>
            {deans.map((dean) => (
              <div key={dean.id} className={styles.deanCard}>
                <h3 className={styles.deanName}>{facultyNames[dean.faculty_id] || 'Loading...'}</h3>
                <p className={styles.deanRole}>{dean.role_description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No deans found for this campus.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CampusDetails;
