import React from 'react';
import styles from '../ProfileCard.module.css';
import { User, Student } from '../../features/api/types';
import profileImage from '../../assets/images/profileImage.jpg';

interface ProfileCardProps {
  user: User;
  student: Student;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, student }) => {
  return (
    <div className={styles.profileCard}>
      <img
        src={user.profile_picture || profileImage}
        alt={`${user.first_name} ${user.last_name}`}
        className={styles.profilePicture}
      />
      <div className={styles.profileDetails}>
        <h2>{`${user.first_name} ${user.middle_name} ${user.last_name}`}</h2>
        <p>{student.id}</p>
        <p>{user.email}</p>
        <p>{user.phone_number}</p>
        <p>{student.dorm_residency ? 'Dorm Residency' : 'Non-Dorm Residency'}</p>
        <p>{student.native_language}</p>
        <p>{student.secondary_language}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
