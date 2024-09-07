import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetFacultiesQuery,
  useDeleteFacultyMutation,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
} from '../../../features/api/facultiesApi';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import Spinner from '../../../components/Spinner/Spinner';

const Faculties: React.FC = () => {
  const { data: faculties, isLoading, error, refetch } = useGetFacultiesQuery();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [addFaculty] = useCreateFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [facultyData, setFacultyData] = useState({
    id: 0,
    name: '',
    description: '',
    credit_price_usd: '',
  });

  const navigate = useNavigate();

  if (isLoading) return (<AdminLayout><Spinner /></AdminLayout>);
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredFaculties = faculties!.filter((faculty) => {
    const facultyName = faculty.name.toLowerCase();
    return searchTerms.every(term => facultyName.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredFaculties.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredFaculties.length / entriesPerPage);

  const handleDeleteFaculty = async (facultyId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteFaculty(facultyId).unwrap();
        refetch();
        toast.success('Faculty deleted successfully!');
      } catch (err) {
        console.error('Error deleting faculty:', err);
        toast.error('Failed to delete faculty.');
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

  const handleViewFaculty = (facultyId: number) => {
    navigate(`/admin/faculties/${facultyId}`);
  };

  const handleAddFacultyClick = () => {
    setShowModal(true);
    setFacultyData({
      id: 0,
      name: '',
      description: '',
      credit_price_usd: '', 
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFacultyData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (facultyData.id) {
        await updateFaculty({ id: facultyData.id, updatedFaculty: facultyData }).unwrap();
        toast.success('Faculty updated successfully!');
      } else {
        await addFaculty(facultyData).unwrap();
        toast.success('Faculty added successfully!');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error('Error submitting faculty:', err);
      toast.error('Failed to submit faculty.');
    }
  };

  const handleEditFaculty = (faculty: any) => {
    setFacultyData({
      id: faculty.id,
      name: faculty.name || '',
      description: faculty.description || '',
      credit_price_usd: faculty.credit_price_usd || '', 
    });
    setShowModal(true);
  };

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Faculties</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleAddFacultyClick} className={styles.addButton}>Add Faculty</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'Faculty Name', accessor: 'name' },
            { header: 'Description', accessor: 'description' },
            { header: 'Credit Price (USD)', accessor: 'credit_price_usd' }, 
          ]}
          data={currentEntries || []}
          actions={(faculty) => (
            <>
              <button onClick={() => handleViewFaculty(faculty.id)}>View</button>
              <button onClick={() => handleEditFaculty(faculty)}>Edit</button>
              <button onClick={() => handleDeleteFaculty(faculty.id)}>Delete</button>
            </>
          )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{facultyData.id ? 'Edit Faculty' : 'Add New Faculty'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Faculty Name:
                <input
                  type="text"
                  name="name"
                  value={facultyData.name || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={facultyData.description || ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Credit Price (USD):
                <input
                  type="number"
                  name="credit_price_usd"
                  value={facultyData.credit_price_usd || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>
                  {facultyData.id ? 'Update Faculty' : 'Add Faculty'}
                </button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Faculties;
