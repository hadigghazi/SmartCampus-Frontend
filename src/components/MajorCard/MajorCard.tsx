import styles from './MajorCard.module.css';

const MajorCard = ({ major }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{major.name}</h3>
      <p className={styles.description}>{major.description}</p>
      <p className={styles.faculty}>Faculty ID: {major.faculty_id}</p>
    </div>
  );
};

export default MajorCard;
