import React from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/Pagination/Pagination';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetAnnouncementsQuery } from '../../../features/api/announcementsApi';
import styles from './StudentDashboard.module.css';

const Dashboard: React.FC = () => {
  const storedUser = localStorage.getItem('user');
  const user_storage = storedUser ? JSON.parse(storedUser) : null;
  const userId = user_storage.id;
  const { data: user } = useGetUserByIdQuery(userId);
  const { data: student } = useGetStudentByUserIdQuery(userId);
  const { data: announcements } = useGetAnnouncementsQuery();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.profileSection}>
        {user && student && <ProfileCard user={user} student={student} />}
      </div>
      <div className={styles.announcementsSection}>
        {announcements && <AnnouncementsList announcements={announcements} />}
        <Pagination
          currentPage={1}
          totalPages={6}
          onPageChange={(page) => console.log('Page:', page)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
