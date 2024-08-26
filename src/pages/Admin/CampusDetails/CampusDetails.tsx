import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useGetCampusByIdQuery, 
  useGetFacultiesByCampusQuery,
  useAttachFacultyToCampusMutation,
  useDetachFacultyFromCampusMutation
} from '../../../features/api/campusesApi';
import { useGetFacultiesQuery } from '../../../features/api/facultiesApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Pagination from '../../../components/Pagination/Pagination';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import styles from '../CourseDetails/CourseDetails.module.css';
import { Faculty } from '../../../features/api/types';

const CampusDetails: React.FC = () => {
  const { id: campusId } = useParams<{ id: string }>();
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(Number(campusId));
  const { data: initialFaculties, isLoading: facultiesLoading, error: facultiesError } = useGetFacultiesByCampusQuery(Number(campusId));
  const { data: allFaculties } = useGetFacultiesQuery(); 

  const [faculties, setFaculties] = useState<Faculty[]>(initialFaculties || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);

  const [attachFacultyToCampus] = useAttachFacultyToCampusMutation();
  const [detachFacultyFromCampus] = useDetachFacultyFromCampusMutation();

  useEffect(() => {
    if (initialFaculties) {
      setFaculties(initialFaculties);
    }
  }, [initialFaculties]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFacultyId(null);
  };

  const handleAttachFaculty = async () => {
    if (selectedFacultyId) {
      try {
        await attachFacultyToCampus({
          campusId: Number(campusId),
          faculty_id: selectedFacultyId, 
        }).unwrap(); 

        const faculty = allFaculties?.find(f => f.id === selectedFacultyId);
        if (faculty) {
          setFaculties([...faculties, faculty]);
        }
        handleCloseModal();
      } catch (error) {
        console.error("Failed to attach faculty:", error);
      }
    }
  };  

  const handleDetachFaculty = async (facultyId: number) => {
    try {
      await detachFacultyFromCampus({ campusId: Number(campusId), facultyId }).unwrap();
      setFaculties(faculties.filter(f => f.id !== facultyId));
    } catch (error) {
      console.error("Failed to detach faculty:", error);
    }
  };

  const filteredFaculties = faculties.filter(faculty =>
    faculty?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFaculty = currentPage * entriesPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - entriesPerPage;
  const currentFaculties = filteredFaculties.slice(indexOfFirstFaculty, indexOfLastFaculty);
  const totalPages = Math.ceil(filteredFaculties.length / entriesPerPage);

  const columns = [
    { header: 'Faculty Name', accessor: 'name' as keyof Faculty },
    { header: 'Description', accessor: 'description' as keyof Faculty },
    {
      header: 'Actions',
      accessor: (faculty: Faculty) => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/admin/campuses/${campusId}/faculties/${faculty.id}`}>View</Link>
          <button onClick={() => handleDetachFaculty(faculty.id)}>Remove</button>
        </div>
      ),
    },
  ];

  const availableFaculties = allFaculties?.filter(
    faculty => !faculties.some(f => f.id === faculty.id)
  );

  if (campusLoading || facultiesLoading) return <p>Loading...</p>;
  if (campusError || facultiesError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      {campus && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{campus?.name}</h1>
          <p className={styles.text}>{campus?.description}</p>

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>Available Faculties</h2>
          <button onClick={handleOpenModal}>Add Faculty</button>

          <div style={{ display: "flex", gap: "1.5rem", marginTop: '1rem' }}>
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          </div>
          {currentFaculties.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Table
                columns={columns}
                data={currentFaculties}
              />
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <p>No faculties available for this campus</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add Faculty</h2>
            <select
              value={selectedFacultyId || ''}
              onChange={(e) => setSelectedFacultyId(Number(e.target.value))}
            >
              <option value="" disabled>Select a faculty</option>
              {availableFaculties?.map(faculty => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
            <button onClick={handleAttachFaculty}>Add</button>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CampusDetails;
