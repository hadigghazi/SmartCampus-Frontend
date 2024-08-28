import React, { useState, useEffect } from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/AnnouncementsPagination/AnnouncementsPagination';
import Table from '../../../components/Table/Table';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetAnnouncementsQuery } from '../../../features/api/announcementsApi';
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetRegistrationsByStudentQuery } from '../../../features/api/registrationsApi';
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi';
import styles from './StudentDashboard.module.css';

const Dashboard: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: student } = useGetStudentByUserIdQuery(user?.id);
  const { data: announcements } = useGetAnnouncementsQuery();
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: registrations } = useGetRegistrationsByStudentQuery(student?.id);

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

  const filteredRegistrations = registrations?.filter(
    (registration) => registration.semester_id === currentSemester?.id
  );

  const columns = [
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Course Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Instructor', accessor: 'instructor_name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Status', accessor: 'status' },
    { header: 'From Date', accessor: 'start_date' },
    { header: 'To Date', accessor: 'end_date' }
  ];

  return (
    <div>
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
      
      <div className={styles.content}>
        <h2 className={styles.headingPrimary}>Course Registrations</h2>
        {filteredRegistrations && (
          <Table columns={columns} data={filteredRegistrations} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
