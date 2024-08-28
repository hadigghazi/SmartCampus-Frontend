import React, { useState, useEffect } from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/AnnouncementsPagination/AnnouncementsPagination';
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

  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 6;

  const totalPages = announcements ? Math.ceil(announcements.length / announcementsPerPage) : 1;

  const currentAnnouncements = announcements
    ? announcements.slice(
        (currentPage - 1) * announcementsPerPage,
        currentPage * announcementsPerPage
      )
    : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [announcements]);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.profileSection}>
        {user && student && <ProfileCard user={user} student={student} />}
      </div>
      <div className={styles.announcementsSection}>
        {currentAnnouncements && <AnnouncementsList announcements={currentAnnouncements} />}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
