import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetCentersQuery, 
  useDeleteCenterMutation, 
  useCreateCenterMutation, 
  useUpdateCenterMutation 
} from '../../../features/api/centersApi';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import { toast } from 'react-toastify';
import Spinner from '../../../components/Spinner/Spinner';

const Centers: React.FC = () => {
  const { data: centers, isLoading, error } = useGetCentersQuery();
  const [deleteCenter] = useDeleteCenterMutation();
  const [addCenter] = useCreateCenterMutation();
  const [updateCenter] = useUpdateCenterMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [centerData, setCenterData] = useState({
    id: undefined,
    name: '',
    vision: '',
    mission: '',
    overview: '',
  });

  const navigate = useNavigate();

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredCenters = centers?.filter((center) => {
    const centerName = center.name.toLowerCase();
    return searchTerms.every(term => centerName.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCenters?.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil((filteredCenters?.length || 0) / entriesPerPage);

  const handleDeleteCenter = async (centerId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteCenter(centerId).unwrap();
        toast.success('Center deleted successfully!');
      } catch (err) {
        console.error('Error deleting center:', err);
        toast.error('Failed to delete center.');
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

  const handleViewCenter = (centerId: number) => {
    navigate(`/admin/centers/${centerId}`);
  };

  const handleAddCenterClick = () => {
    setShowModal(true);
    setCenterData({
      id: undefined,
      name: '',
      vision: '',
      mission: '',
      overview: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCenterData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (centerData.id) {
        await updateCenter(centerData).unwrap();
        toast.success('Center updated successfully!');
      } else {
        await addCenter(centerData).unwrap();
        toast.success('Center added successfully!');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting center:', err);
      toast.error('Failed to submit center.');
    }
  };

  const handleEditCenter = (center: typeof centerData) => {
    setCenterData({
      id: center.id,
      name: center.name || '',
      vision: center.vision || '',
      mission: center.mission || '',
      overview: center.overview || '',
    });
    setShowModal(true);
  };

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Centers</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleAddCenterClick} className={styles.addButton}>Add Center</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'Center Name', accessor: 'name' },
          ]}
          data={currentEntries || []}
          actions={(center) => (
            <>
              <button onClick={() => handleViewCenter(center.id)}>View</button>
              <button onClick={() => handleEditCenter(center)}>Edit</button>
              <button onClick={() => handleDeleteCenter(center.id)}>Delete</button>
            </>
          )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{centerData.id ? 'Edit Center' : 'Add New Center'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Center Name:
                <input
                  type="text"
                  name="name"
                  value={centerData.name || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Vision:
                <textarea
                  name="vision"
                  value={centerData.vision || ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Mission:
                <textarea
                  name="mission"
                  value={centerData.mission || ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Overview:
                <textarea
                  name="overview"
                  value={centerData.overview || ''}
                  onChange={handleChange}
                />
              </label>
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>{centerData.id ? 'Edit Center' : 'Add Center'}</button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Centers;
