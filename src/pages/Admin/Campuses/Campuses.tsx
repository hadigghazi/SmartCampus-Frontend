import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetCampusesQuery,
  useCreateCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
} from '../../../features/api/campusesApi';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import { toast } from 'react-toastify';
import Spinner from '../../../components/Spinner/Spinner';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';

const Campuses: React.FC = () => {
  const { data: campuses, isLoading, error, refetch } = useGetCampusesQuery();
  const [deleteCampus] = useDeleteCampusMutation();
  const [addCampus] = useCreateCampusMutation();
  const [updateCampus] = useUpdateCampusMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [campusData, setCampusData] = useState({
    id: 0,
    name: '',
    location: '',
    description: '',
  });

  const navigate = useNavigate();

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredCampuses = campuses.filter((campus) => {
    const campusName = campus.name.toLowerCase();
    return searchTerms.every(term => campusName.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCampuses.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCampuses.length / entriesPerPage);

  const handleDeleteCampus = async (campusId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteCampus(campusId).unwrap();
        toast.success('Campus deleted successfully!');
        refetch();
      } catch (err) {
        toast.error('Failed to delete campus.');
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

  const handleViewCampus = (campusId: number) => {
    navigate(`/admin/campuses/${campusId}`);
  };

  const handleAddCampusClick = () => {
    setShowModal(true);
    setCampusData({
      id: 0,
      name: '',
      location: '',
      description: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampusData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (campusData.id) {
        await updateCampus({ id: campusData.id, ...campusData }).unwrap();
        toast.success('Campus updated successfully!');
      } else {
        const newCampus = await addCampus(campusData).unwrap();
        toast.success('Campus added successfully!');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      toast.error('Failed to submit campus.');
    }
  };

  const handleEditCampus = (campus: typeof campusData) => {
    setCampusData({
      id: campus.id,
      name: campus.name || '',
      location: campus.location || '',
      description: campus.description || '',
    });
    setShowModal(true);
  };

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Campuses</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleAddCampusClick} className={styles.addButton}>Add Campus</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'Name', accessor: 'name' },
            { header: 'Location', accessor: 'location' },
            { header: 'Description', accessor: 'description' },
          ]}
          data={currentEntries || []}
          actions={(campus) => (
            <>
              <button onClick={() => handleViewCampus(campus.id)}>View</button>
              <button onClick={() => handleEditCampus(campus)}>Edit</button>
              <button onClick={() => handleDeleteCampus(campus.id)}>Delete</button>
            </>
          )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{campusData.id ? 'Edit Campus' : 'Add New Campus'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Campus Name:
                <input
                  type="text"
                  name="name"
                  value={campusData.name || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={campusData.location || ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={campusData.description || ''}
                  onChange={handleChange}
                />
              </label>
              <div className={styles.btnContainer}>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
                <button type="submit" className={styles.acceptBtn}>{campusData.id ? 'Update Campus' : 'Add Campus'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Campuses;
