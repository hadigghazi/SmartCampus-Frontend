import React, { useState, useEffect } from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/AnnouncementsPagination/AnnouncementsPagination';
import Table from '../../../components/Table/Table';
import { useGetInstructorByUserIdQuery } from '../../../features/api/instructorsApi';
import { useGetAnnouncementsQuery } from '../../../features/api/announcementsApi';
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi';
import { useGetExamInstructorDetailsQuery } from '../../../features/api/examsApi'; 
import styles from './InstructorDashboard.module.css';

const InstructorDashboard: React.FC = () => {
  const { data: user } = useGetUserQuery();
  const { data: instructor } = useGetInstructorByUserIdQuery(user?.id);
  const { data: announcements } = useGetAnnouncementsQuery();
  const { data: coursesAssigned } = useGetCoursesAssignedToInstructorQuery(instructor?.id);
  const { data: currentSemester } = useGetCurrentSemesterQuery();
  const { data: exams } = useGetExamInstructorDetailsQuery(instructor?.id); 

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

  const filteredCoursesAssigned = coursesAssigned?.filter(
    (course) => course.semester_id === currentSemester?.id
  );

  const courseColumns = [
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Room', accessor: (course) => `${course.campus_name}, ${course.room}` },
    { header: 'From', accessor: 'from_date' },
    { header: 'To', accessor: 'to_date' },
    { header: 'Schedule', accessor: 'schedule' },
    { header: 'Students', accessor: (course) => `${course.number_of_students}/${course.available_seats}` }
  ];

  const examColumns = [
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Room', accessor: (exam) => `${exam.campus_name}, ${exam.block_name}, ${exam.room_number}` }
  ];

  return (
    <div>
      <div className={styles.dashboardContainer}>
        <div className={styles.profileSection}>
          <h2 className={styles.headingSecondary}>Profile</h2>
          {user && instructor ? <ProfileCard user={user} student={instructor} /> : <p>Loading profile...</p>}
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
              <p>Loading announcements...</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.headingPrimary}>Assigned Courses</h2>
        {filteredCoursesAssigned ? (
          <Table columns={courseColumns} data={filteredCoursesAssigned} />
        ) : (
          <p>Loading assigned courses...</p>
        )}

        <h2 className={styles.headingPrimary}>Exams</h2>
        {exams ? (
          <Table columns={examColumns} data={exams} />
        ) : (
          <p>Loading exam details...</p>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
