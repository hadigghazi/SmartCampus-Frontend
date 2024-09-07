import React, { useState, useEffect } from 'react';
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

const Faculties: React.FC = () => {
  const { data: initialFaculties, isLoading, error } = useGetFacultiesQuery();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [addFaculty] = useCreateFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();

  const [faculties, setFaculties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [facultyData, setFacultyData] = useState({
    id: 0,
    name: '',
    description: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (initialFaculties) {
      setFaculties(initialFaculties);
    }
  }, [initialFaculties]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredFaculties = faculties.filter((faculty) => {
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
        setFaculties(faculties.filter(faculty => faculty.id !== facultyId));
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
        setFaculties(faculties.map(faculty => faculty.id === facultyData.id ? facultyData : faculty));
        toast.success('Faculty updated successfully!');
      } else {
        const newFaculty = await addFaculty(facultyData).unwrap();
        setFaculties([...faculties, newFaculty]);
        toast.success('Faculty added successfully!');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting faculty:', err);
      toast.error('Failed to submit faculty.');
    }
  };

  const handleEditFaculty = (faculty: typeof facultyData) => {
    setFacultyData({
      id: faculty.id,
      name: faculty.name || '',
      description: faculty.description || '',
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
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>{facultyData.id ? 'Update Faculty' : 'Add Faculty'}</button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Faculties;
