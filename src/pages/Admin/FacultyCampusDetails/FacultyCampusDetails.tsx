import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFacultyByIdQuery } from '../../../features/api/facultiesApi';
import { useGetMajorsByFacultyAndCampusQuery, useAttachMajorToFacultyCampusMutation, useDetachMajorFromFacultyCampusMutation } from '../../../features/api/campusesApi';
import { useGetMajorsByFacultyQuery } from '../../../features/api/majorsApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Pagination from '../../../components/Pagination/Pagination';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import styles from '../CourseDetails/CourseDetails.module.css';
import { Major } from '../../../features/api/types';
import { useGetFacultyCampusIdQuery } from '../../../features/api/campusesApi';

const FacultyCampusDetails: React.FC = () => {
  const { campusId, id: facultyId } = useParams<{ campusId: string, id: string }>();
  const [facultyCampusId, setFacultyCampusId] = useState<number | null>(null);
  const { data: faculty, isLoading: facultyLoading, error: facultyError } = useGetFacultyByIdQuery(Number(facultyId));
  const { data: initialMajors, isLoading: majorsLoading, error: majorsError } = useGetMajorsByFacultyAndCampusQuery({
    facultyId: Number(facultyId),
    campusId: Number(campusId)
  });
  const { data: availableMajors } = useGetMajorsByFacultyQuery(Number(facultyId));
  const [attachMajorToFacultyCampus] = useAttachMajorToFacultyCampusMutation();
  const [detachMajorFromFacultyCampus] = useDetachMajorFromFacultyCampusMutation();
  const { data: facultyCampusData } = useGetFacultyCampusIdQuery({ facultyId: Number(facultyId), campusId: Number(campusId) });

  const [majors, setMajors] = useState<Major[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<number | ''>('');

  useEffect(() => {
    if (initialMajors) {
      const mappedMajors = initialMajors.map((major: any) => ({
        id: major.major_id,
        name: major.major_name,
      }));
      setMajors(mappedMajors);
    }
  }, [initialMajors]);

  useEffect(() => {
    if (facultyCampusData) {
      setFacultyCampusId(facultyCampusData.faculty_campus_id);
    }
  }, [facultyCampusData]);

  const getAvailableMajors = () => {
    if (!availableMajors || !initialMajors) return [];

    const assignedMajorIds = initialMajors.map((major: any) => major.major_id);
    return availableMajors.filter((major) => !assignedMajorIds.includes(major.id));
  };

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

  const handleAttachMajor = async () => {
    if (selectedMajor && facultyCampusId !== null) {
      try {
        await attachMajorToFacultyCampus({
          major_id: Number(selectedMajor),
          faculty_campus_id: facultyCampusId,
        }).unwrap();

        const major = availableMajors?.find(m => m.id === Number(selectedMajor));
        if (major) {
          setMajors([...majors, major]);
        }
        setModalOpen(false);
        setSelectedMajor('');
      } catch (error) {
        console.error("Failed to attach major:", error);
        alert(`Failed to attach major: ${error.message || "An unexpected error occurred"}`);
      }
    }
  };

  const handleDetachMajor = async (majorId: number) => {
    if (facultyCampusId !== null) {
      try {
        await detachMajorFromFacultyCampus({
          major_id: majorId,
          faculty_campus_id: facultyCampusId,
        }).unwrap();

        setMajors(majors.filter(m => m.id !== majorId));
      } catch (error) {
        console.error("Failed to detach major:", error);
        alert(`Failed to detach major: ${error.message || "An unexpected error occurred"}`);
      }
    }
  };

  const filteredMajors = majors.filter(major =>
    major?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMajor = currentPage * entriesPerPage;
  const indexOfFirstMajor = indexOfLastMajor - entriesPerPage;
  const currentMajors = filteredMajors.slice(indexOfFirstMajor, indexOfLastMajor);
  const totalPages = Math.ceil(filteredMajors.length / entriesPerPage);

  const columns = [
    { header: 'Major Name', accessor: 'name' as keyof Major },
    {
      header: 'Actions',
      accessor: (major: Major) => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/admin/majors/${major.id}`}>View</Link>
          <button onClick={() => handleDetachMajor(major.id)}>Remove</button>
        </div>
      ),
    },
  ];

  if (facultyLoading || majorsLoading) return <p>Loading...</p>;
  if (facultyError || majorsError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      {faculty && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{faculty.name}</h1>
          <p className={styles.text}>{faculty.description}</p>

          <div className={styles.header_container}>
          <h3 className={styles.headingTertiary}>Available Majors</h3>
          <button onClick={() => setModalOpen(true)} className={styles.addButton}>
            Add Major
          </button>
        </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          </div>
          {currentMajors.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Table columns={columns} data={currentMajors} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <p>No majors available for this faculty on this campus</p>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>Add Major</h2>
            <div className={styles.form}>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
            >
              <option value="">Select Major</option>
              {getAvailableMajors().map((major) => (
                <option key={major.id} value={major.id}>{major.name}</option>
              ))}
            </select>
            <div className={styles.btnContainer} style={{marginTop: "2rem"}}>
            <button onClick={handleAttachMajor} className={styles.acceptBtn}>Add</button>
            <button onClick={() => setModalOpen(false)} className={styles.rejectBtn}>Cancel</button>
            </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FacultyCampusDetails;
