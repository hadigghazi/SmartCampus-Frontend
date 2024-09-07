import AcademicsLayout from "../AcademicsLayout";
import styles from './Faculties.module.css';
import FacultiesCard from '../../../components/FacultiesCard/FacultiesCard';
import { useGetFacultiesQuery } from '../../../features/api/facultiesApi';
import Spinner from "../../../components/Spinner/Spinner";

const Faculties = () => {
  const { data: faculties, error, isLoading } = useGetFacultiesQuery();

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading faculties</p>;

  return (
    <AcademicsLayout title="Faculties">
      <div className={styles.container}>
        <h2 className={styles.headingSecondary}>- Our Faculties</h2>
        <h1 className={styles.headingPrimary}>Explore Faculties</h1>
        <div className={styles.grid}>
          {faculties?.map((faculty) => (
            <FacultiesCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      </div>
    </AcademicsLayout>
  );
};

export default Faculties;
