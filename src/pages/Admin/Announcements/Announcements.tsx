import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetAnnouncementsQuery, useDeleteAnnouncementMutation, useCreateAnnouncementMutation, useUpdateAnnouncementMutation } from '../../../features/api/announcementsApi';
import { useGetUserQuery } from '../../../features/api/authApi';
import Table from '../../../components/Table/Table'; 
import Pagination from '../../../components/Pagination/Pagination'; 
import SearchInput from '../../../components/SearchInput/SearchInput'; 
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage'; 
import AnnouncementModal from '../../../components/AnnouncementModal/AnnouncementModal';
import styles from './Announcements.module.css'; 
import { Announcement } from '../../../features/api/types';

const visibilityOptions = ['Public', 'Private', 'Restricted']; // Example options
const categoryOptions = ['General', 'Urgent', 'Event']; // Example options

const Announcements: React.FC = () => {
  const dispatch = useDispatch();
  const { data: announcements = [], isLoading } = useGetAnnouncementsQuery();
  const { data: user } = useGetUserQuery();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVisibility, setSelectedVisibility] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleAddAnnouncement = () => {
    setEditingAnnouncement(null);
    setShowModal(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowModal(true);
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      await deleteAnnouncement(id).unwrap();
      console.log('Announcement deleted successfully');
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const handleSaveAnnouncement = async (announcement: Announcement) => {
    try {
      if (announcement.id) {
        await updateAnnouncement(announcement).unwrap();
        console.log('Announcement updated successfully');
      } else {
        await createAnnouncement({ ...announcement, author_id: user?.id }).unwrap();
        console.log('Announcement created successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVisibility(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const filteredAnnouncements = announcements
    .filter(a =>
      a.title.toLowerCase().includes(searchText.toLowerCase()) &&
      (selectedVisibility === 'All' || a.visibility === selectedVisibility) &&
      (selectedCategory === 'All' || a.category === selectedCategory)
    );

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / pageSize);

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Content', accessor: 'content' },
    { header: 'Published Date', accessor: 'published_date' },
    { header: 'Visibility', accessor: 'visibility' },
    { header: 'Category', accessor: 'category' },
  ];

  const actions = (announcement: Announcement) => (
    <div className={styles.actions}>
      <button onClick={() => handleEditAnnouncement(announcement)}>Edit</button>
      <button onClick={() => handleDeleteAnnouncement(announcement.id)}>Delete</button>
    </div>
  );

  return (
    <div className={styles.container}>
      <button onClick={handleAddAnnouncement} className={styles.addButton}>Add Announcement</button>
      <div className={styles.filters}>
        <SearchInput value={searchText} onChange={handleSearch} />
        <select
          value={selectedVisibility}
          onChange={handleVisibilityChange}
          className={styles.filterSelect}
        >
          <option value="All">All Visibility</option>
          {visibilityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.filterSelect}
        >
          <option value="All">All Categories</option>
          {categoryOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
      </div>
      <div className={styles.wrapper}>
        <Table
          columns={columns}
          data={paginatedAnnouncements}
          actions={actions}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {showModal && (
        <AnnouncementModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAnnouncement}
          announcement={editingAnnouncement}
          authorName={user?.name || ''}
          visibilityOptions={visibilityOptions}
          categoryOptions={categoryOptions}
        />
      )}
    </div>
  );
};

export default Announcements;
