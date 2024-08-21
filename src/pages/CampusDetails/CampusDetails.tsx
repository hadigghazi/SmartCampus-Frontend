import { useParams } from 'react-router-dom';
import { useGetCampusByIdQuery } from '../../features/api/campusesApi';
import { useGetDeansByCampusQuery } from '../../features/api/deansApi';
import headerImage from '../../assets/images/Pages_header.jpg';
import styles from './CampusDetails.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DeanCard from '../../components/DeanCard/DeanCard';  
import profileImage from '../../assets/images/profileImage.jpg'

const CampusDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(Number(id));
  const { data: deans, isLoading: deansLoading, error: deansError } = useGetDeansByCampusQuery(Number(id));


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
        
        <h2 className={styles.headingSecondary} style={{marginTop: '7rem'}}>- Deans Of Faculties</h2>
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
      </div>
      <Footer />
    </div>
  );
};

export default CampusDetails;
