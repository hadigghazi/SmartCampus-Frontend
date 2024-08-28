import React from 'react';
import styles from './AnnouncementsList.module.css';
import { Announcement } from '../../features/api/types';

interface AnnouncementsListProps {
  announcements: Announcement[];
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ announcements }) => {
  return (
    <div className={styles.announcementsContainer}>
      {announcements.map((announcement) => (
        <div key={announcement.id} className={styles.announcementItem}>
          {announcement.title}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsList;
