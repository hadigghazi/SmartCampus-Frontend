import React, { useState, useEffect } from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/AnnouncementsPagination/AnnouncementsPagination';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetAnnouncementsQuery } from '../../../features/api/announcementsApi';
import styles from './StudentDashboard.module.css';
import { useGetUserQuery } from '../../../features/api/authApi';

const Dashboard: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: student } = useGetStudentByUserIdQuery(user!.id);
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
        <h2 className={styles.headingSecondary}>Profile</h2>
        {user && student && <ProfileCard user={user} student={student} />}
      </div>
      <div className={styles.announcementsSection}>
        <h2 className={styles.headingSecondary}>Announcements</h2>
        <div className={styles.announcementsList}>
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
    </div>
  );
};

export default Dashboard;
