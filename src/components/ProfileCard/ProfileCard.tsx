import styles from './ProfileCard.module.css';
import { User, Student } from '../../features/api/types';
import profileImage from '../../assets/images/profileImage.jpg';
import { useGetMajorByIdQuery } from '../../features/api/majorsApi';
import { useGetCurrentSemesterQuery } from '../../features/api/semestersApi';

type ProfileCardProps = {
  user: User;
  student: Student;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, student }) => {
  const { data: major } = useGetMajorByIdQuery(student.major_id);
  const { data: currentSemester } = useGetCurrentSemesterQuery();

  return (
    <div className={styles.profileCard}>
      <img
        src={user.profile_picture || profileImage}
        alt={`${user.first_name} ${user.last_name}`}
        className={styles.profilePicture}
      />
      <div className={styles.profileDetails}>
        <h2>{`${user.first_name} ${user.middle_name} ${user.last_name}`}</h2>
        <p>Student ID: {student.id}</p>
        <p>{user.email}</p>
        <p>{user.phone_number}</p>
        {major && <p>{major.name} - {student.secondary_language}</p>}
        {currentSemester && <p>{currentSemester.name}</p>}
      </div>
    </div>
  );
};

export default ProfileCard;
