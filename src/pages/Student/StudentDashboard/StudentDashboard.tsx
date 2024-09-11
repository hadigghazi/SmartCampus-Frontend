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
import { useGetExamDetailsQuery } from '../../../features/api/examsApi';
import styles from './StudentDashboard.module.css';
import StudentLayout from '../StudentLayout';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../components/Spinner/Spinner';

const Dashboard: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: student } = useGetStudentByUserIdQuery(user?.id);
  const { data: announcements } = useGetAnnouncementsQuery();
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: registrations } = useGetRegistrationsByStudentQuery(student?.id);
  const { data: exams } = useGetExamDetailsQuery(student?.id);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 6;
  const filteredAnnouncements = announcements?.filter(
    (announcement) => announcement.visibility === 'Students' || announcement.visibility === 'General'
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

  const filteredRegistrations = registrations?.filter(
    (registration) => registration.semester_id === currentSemester?.id
  );

  const registrationColumns = [
       { header: 'Semester', accessor: 'semester_name' },
    { header: 'Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Instructor', accessor: 'instructor_name' },
    { header: 'Schedule', accessor: 'schedule' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Status', accessor: 'status' },
    { header: 'From', accessor: 'start_date' },
    { header: 'To', accessor: 'end_date' },
    { header: 'Grade', accessor: 'grade' }
  ];

  const examColumns = [
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Instructor', accessor: 'instructor_name' },
    { header: 'Room', accessor: (exam) => `${exam.campus_name}, ${exam.block_name}, ${exam.room_number}` }
  ];

  return (
    <StudentLayout>
      <div className={styles.dashboardContainer}>
        <div className={styles.profileSection}>
          <h2 className={styles.headingSecondary}>Profile</h2>
          {user && student ? <ProfileCard user={user} student={student} /> : <Spinner />}
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

      <div className={styles.content}>
        <h2 className={styles.headingPrimary}>Course Registrations</h2>
        {filteredRegistrations ? (
          <Table columns={registrationColumns} data={filteredRegistrations} />
        ) : (
          <Spinner />
        )}
        <button
            className={styles.registerButton}
            onClick={() => navigate('/registrations')}
          >
            Register Courses
          </button>

        <h2 className={styles.headingPrimary}>Exams</h2>
        {exams ? (
          <Table columns={examColumns} data={exams} />
        ) : (
          <p>No exams available</p>
        )}
      </div>
    </StudentLayout>
  );
};

export default Dashboard;
