import React from 'react';
import ProfileCard from '../../../components/ProfileCard/ProfileCard';
import AnnouncementsList from '../../../components/AnnouncementsList/AnnouncementsList';
import Pagination from '../../../components/Pagination/Pagination';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetAnnouncementsQuery } from '../../../features/api/announcementsApi';

const Dashboard: React.FC = () => {
  const { data: user } = useGetUserByIdQuery(1); 
  const { data: student } = useGetStudentByUserIdQuery(1); 
  const { data: announcements } = useGetAnnouncementsQuery();

  return (
    <div className="dashboardContainer">
      {user && student && <ProfileCard user={user} student={student} />}
      <div className="announcementsSection">
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
