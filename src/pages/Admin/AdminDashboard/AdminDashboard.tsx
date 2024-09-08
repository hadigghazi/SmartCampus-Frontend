import React, { useState, useEffect } from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/AnnouncementsPagination/AnnouncementsPagination';
import { useGetAnnouncementsQuery } from '../../../features/api/announcementsApi';
import { useGetUserQuery } from '../../../features/api/authApi';
import styles from '../../Instructor/InstructorDashboard/InstructorDashboard.module.css';
import Spinner from '../../../components/Spinner/Spinner';
import AdminLayout from '../AdminLayout';
import { useGetAdminByUserIdQuery } from '../../../features/api/adminsApi';

const InstructorDashboard: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: admin } = useGetAdminByUserIdQuery(user?.id);
  const { data: announcements } = useGetAnnouncementsQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 6;
  const filteredAnnouncements = announcements?.filter(
    (announcement) => announcement.visibility === 'Admins' || announcement.visibility === 'General'
  )
  .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());


  const totalPages = announcements ? Math.ceil(announcements.length / announcementsPerPage) : 1;

  const currentAnnouncements = filteredAnnouncements
    ? filteredAnnouncements.slice(
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
    <AdminLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.profileSection}>
          <h2 className={styles.headingSecondary}>Profile</h2>
          {user && admin ? <ProfileCard user={user} student={admin} /> : <Spinner />}
        </div>
        <div className={styles.announcementsSection}>
          <h2 className={styles.headingSecondary}>Announcements</h2>
          <div className={styles.announcementsList}>
            {announcements ? (
              <>
                <AnnouncementsList announcements={currentAnnouncements} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorDashboard;
