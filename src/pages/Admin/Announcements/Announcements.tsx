import React, { useState, useEffect } from 'react';
import { useGetAnnouncementsQuery, useDeleteAnnouncementMutation, useCreateAnnouncementMutation, useUpdateAnnouncementMutation } from '../../../features/api/announcementsApi';
import { useGetUserQuery } from '../../../features/api/authApi';
import Table from '../../../components/Table/Table'; 
import Pagination from '../../../components/Pagination/Pagination'; 
import SearchInput from '../../../components/SearchInput/SearchInput'; 
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage'; 
import styles from './Announcements.module.css'; 
import { Announcement } from '../../../features/api/types';
import AdminLayout from '../AdminLayout';

const visibilityOptions = ['General', 'Instructors', 'Students', 'Admins'];
const categoryOptions = ['General', 'Urgent', 'Event'];

const Announcements: React.FC = () => {
  const { data: announcements = [] } = useGetAnnouncementsQuery();
  const { data: user } = useGetUserQuery();
  const [deleteAnnouncement] = useDeleteAnnouncementMutation();
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [updateAnnouncement] = useUpdateAnnouncementMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    visibility: '',
    category: '',
  });

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVisibility, setSelectedVisibility] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (editingAnnouncement) {
      setFormValues({
        title: editingAnnouncement.title,
        content: editingAnnouncement.content,
        visibility: editingAnnouncement.visibility,
        category: editingAnnouncement.category,
      });
    } else {
      setFormValues({
        title: '',
        content: '',
        visibility: '',
        category: '',
      });
    }
  }, [editingAnnouncement]);

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

  const handleSaveAnnouncement = async () => {
    try {
      if (editingAnnouncement) {
        await updateAnnouncement({
          ...editingAnnouncement,
          ...formValues,
          updated_at: new Date().toISOString(),
        }).unwrap();
        console.log('Announcement updated successfully');
      } else {
        await createAnnouncement({
          ...formValues,
          author_id: user?.id || 0,
          published_date: new Date().toISOString().split('T')[0], 
        }).unwrap();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
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
    <AdminLayout  requiredAdminType='Super Admin'>
    <div className={styles.container}>
    <h1 className={styles.headingPrimary}>Announcements</h1>
      <div className={styles.filters}>
        <SearchInput value={searchText} onChange={handleSearch} />
        <select
          value={selectedVisibility}
          onChange={handleVisibilityChange}
          className={styles.selectField}
        >
          <option value="All">All Visibility</option>
          {visibilityOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.selectField}
        >
          <option value="All">All Categories</option>
          {categoryOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button onClick={handleAddAnnouncement} className={styles.addButton}>Add Announcement</button>
      </div>
      <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{editingAnnouncement ? 'Edit Announcement' : 'Add Announcement'}</h2>
            <form className={styles.form}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Content:
                <textarea
                  name="content"
                  value={formValues.content}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </label>
              <label>
                Visibility:
                <select
                  name="visibility"
                  value={formValues.visibility}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">Select visibility</option>
                  {visibilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label>
                Category:
                <select
                  name="category"
                  value={formValues.category}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <div>
                <button type="button" className={styles.addButton} onClick={handleSaveAnnouncement}>
                  Save
                </button>
                <button type="button" className={styles.addButton} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Announcements;
