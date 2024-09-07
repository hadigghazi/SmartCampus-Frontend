import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetMajorsQuery, 
  useDeleteMajorMutation, 
  useCreateMajorMutation, 
  useUpdateMajorMutation 
} from '../../../features/api/majorsApi';
import { useGetFacultiesQuery } from '../../../features/api/facultiesApi';
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

const Majors: React.FC = () => {
  const { data: majors, isLoading, error, refetch } = useGetMajorsQuery();
  const { data: faculties } = useGetFacultiesQuery();

  const [deleteMajor] = useDeleteMajorMutation();
  const [addMajor] = useCreateMajorMutation();
  const [updateMajor] = useUpdateMajorMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<number | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [majorData, setMajorData] = useState({
    id: undefined,
    name: '',
    description: '',
    faculty_id: 'all',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFacultyFilter !== 'all') {
      setMajorData((prevData) => ({
        ...prevData,
        faculty_id: selectedFacultyFilter,
      }));
    }
  }, [selectedFacultyFilter]);

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredMajors = majors?.filter((major) => {
    const matchesFaculty = selectedFacultyFilter === 'all' || major.faculty_id === selectedFacultyFilter;
    const majorName = major.name.toLowerCase();
    const matchesSearchTerm = searchTerms.every(term => majorName.includes(term));
    return matchesFaculty && matchesSearchTerm;
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredMajors?.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil((filteredMajors?.length || 0) / entriesPerPage);

  const handleDeleteMajor = async (majorId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteMajor(majorId).unwrap();
        toast.success('Major deleted successfully!');
        refetch();
      } catch (err) {
        console.error('Error deleting major:', err);
        toast.error('Failed to delete major.');
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

  const handleViewMajor = (majorId: number) => {
    navigate(`/admin/majors/${majorId}`);
  };

  const handleAddMajorClick = () => {
    setShowModal(true);
    setMajorData({
      id: undefined,
      name: '',
      description: '',
      faculty_id: 'all',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMajorData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (majorData.id) {
        await updateMajor(majorData).unwrap();
        toast.success('Major updated successfully!');
      } else {
        await addMajor(majorData).unwrap();
        toast.success('Major added successfully!');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error('Error submitting major:', err);
      toast.error('Failed to submit major.');
    }
  };

  const handleEditMajor = (major: typeof majorData) => {
    setMajorData({
      id: major.id,
      name: major.name || '',
      description: major.description || '',
      faculty_id: major.faculty_id || 'all',
    });
    setShowModal(true);
  };

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Majors</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select
            value={selectedFacultyFilter}
            className={styles.selectField}
            onChange={(e) => setSelectedFacultyFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All Faculties</option>
            {faculties?.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddMajorClick} className={styles.addButton}>Add Major</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'Major Name', accessor: 'name' },
            { header: 'Faculty Name', accessor: (major) => faculties?.find(f => f.id === major.faculty_id)?.name || 'N/A' },
          ]}
          data={currentEntries || []}
          actions={(major) => (
            <>
              <button onClick={() => handleViewMajor(major.id)}>View</button>
              <button onClick={() => handleEditMajor(major)}>Edit</button>
              <button onClick={() => handleDeleteMajor(major.id)}>Delete</button>
            </>
          )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{majorData.id ? 'Edit Major' : 'Add New Major'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Major Name:
                <input
                  type="text"
                  name="name"
                  value={majorData.name || ''}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={majorData.description || ''}
                  onChange={handleChange}
                />
              </label>
              <label>
                Faculty:
                <select
                  name="faculty_id"
                  value={majorData.faculty_id || 'all'}
                  onChange={handleChange}
                  required
                >
                  <option value="all">Select Faculty</option>
                  {faculties?.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.btnContainer}>
              <button type="submit" className={styles.acceptBtn}>{majorData.id ? 'Update Major' : 'Add Major'}</button>
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

export default Majors;
