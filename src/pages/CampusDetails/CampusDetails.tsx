import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCampusByIdQuery } from '../../features/api/campusesApi';
import { useGetDeansByCampusQuery } from '../../features/api/deansApi';
import { useGetFacultiesByCampusQuery } from '../../features/api/campusesApi';
import headerImage from '../../assets/images/Pages_header.jpg';
import styles from './CampusDetails.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DeanCard from '../../components/DeanCard/DeanCard';
import profileImage from '../../assets/images/profileImage.jpg';
import FacultyAccordion from '../../components/FacultyAccordion/FacultyAccordion';
import Spinner from '../../components/Spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const CampusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(Number(id));
  const { data: deans, isLoading: deansLoading, error: deansError } = useGetDeansByCampusQuery(Number(id));
  const { data: faculties, isLoading: facultiesLoading, error: facultiesError } = useGetFacultiesByCampusQuery(Number(id));

  if (campusLoading || deansLoading || facultiesLoading) return <Spinner />;
  if (campusError || !campus) return <p>Error loading campus details</p>;
  if (deansError) return <p>Error loading deans</p>;
  if (facultiesError) return <p>Error loading faculties</p>;

  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.header}>
        <img src={headerImage} alt="Campus Header" className={styles.headerImage} />
      </div>
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- About The Campus</h2>
        <h1 className={styles.headingPrimary}>{campus.name}</h1>
        <p className={styles.text}><FontAwesomeIcon style={{fontSize: "1rem", marginRight: "0.5rem", marginBottom: "0.2rem"}} icon={faMapMarkerAlt} />{campus.location}</p>
        <p className={styles.text}>{campus.description}</p>

        <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}> - Deans Of Faculties</h2>
        <h1 className={styles.headingPrimary}>Meet The Team</h1>
        {deans && deans.length > 0 ? (
          <div className={styles.deanList}>
            {deans.map((dean) => (
              <DeanCard 
                key={dean.id}
                image={profileImage}  
                name={dean.name}
                description={dean.role_description}
              />
            ))}
          </div>
        ) : (
          <p>No deans found for this campus.</p>
        )}

<h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}> - Available Majors</h2>
        <h1 className={styles.headingPrimary}>Majors In {campus.name}</h1>
        {faculties && faculties.length > 0 ? (
          faculties.map((faculty) => (
            <FacultyAccordion
              key={faculty?.id}
              facultyId={faculty?.id}
              facultyName={faculty?.name}
              campusId={Number(id)}
            />
          ))
        ) : (
          <p>No faculties found for this campus.</p>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default CampusDetails;
