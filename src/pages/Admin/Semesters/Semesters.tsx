import React, { useState, useEffect } from 'react';
import { useGetSemestersQuery, useCreateSemesterMutation, useUpdateSemesterMutation, useDeleteSemesterMutation } from '../../../features/api/semestersApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css'; 
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

const Semesters: React.FC = () => {
  const { data: semesters, isLoading, error } = useGetSemestersQuery();
  const [createSemester] = useCreateSemesterMutation();
  const [updateSemester] = useUpdateSemesterMutation();
  const [deleteSemester] = useDeleteSemesterMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [semesterData, setSemesterData] = useState({
    id: 0,
    name: '',
    start_date: '',
    end_date: '',
    is_current: false,
  });

  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredSemesters = semesters?.filter((semester) => {
    const semesterName = semester.name.toLowerCase();
    return searchTerms.every(term => semesterName.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredSemesters?.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil((filteredSemesters?.length || 0) / entriesPerPage);

  const handleDeleteSemester = async (semesterId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteSemester(semesterId).unwrap();
        toast.success('Semester deleted successfully!');
      } catch (err) {
        console.error('Error deleting semester:', err);
        toast.error('Failed to delete semester.');
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleAddSemesterClick = () => {
    setIsEditing(false);
    setShowModal(true);
    setSemesterData({
      id: 0,
      name: '',
      start_date: '',
      end_date: '',
      is_current: false,
    });
  };

  const handleEditSemesterClick = (semester: typeof semesterData) => {
    setIsEditing(true);
    setShowModal(true);
    setSemesterData(semester);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setSemesterData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateSemester(semesterData).unwrap();
        toast.success('Semester updated successfully!');
      } else {
        await createSemester(semesterData).unwrap();
        toast.success('Semester added successfully!');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving semester:', err);
      toast.error('Failed to save semester.');
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Semesters</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleAddSemesterClick} className={styles.addButton}>Add Semester</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Start Date', accessor: 'start_date' },
            { header: 'End Date', accessor: 'end_date' },
            { header: 'Current Semester', accessor: 'is_current', render: (value) => (value ? 'Yes' : 'No') },
          ]}
          data={currentEntries || []}
          actions={(semester) => (
            <>
              <button onClick={() => handleEditSemesterClick(semester)}>Edit</button>
              <button onClick={() => handleDeleteSemester(semester.id)}>Delete</button>
            </>
          )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{isEditing ? 'Edit Semester' : 'Add New Semester'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={semesterData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  name="start_date"
                  value={semesterData.start_date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  name="end_date"
                  value={semesterData.end_date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Current Semester:
                <input
                  type="checkbox"
                  name="is_current"
                  checked={semesterData.is_current}
                  onChange={handleChange}
                />
              </label>
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>{isEditing ? 'Update Semester' : 'Add Semester'}</button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Semesters;
