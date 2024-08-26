import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCampusByIdQuery } from '../../../features/api/campusesApi';
import { useGetFacultiesByCampusQuery } from '../../../features/api/campusesApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Pagination from '../../../components/Pagination/Pagination';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import styles from '../CourseDetails/CourseDetails.module.css';

const CampusDetails: React.FC = () => {
  const { id: campusId } = useParams<{ id: string }>();
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(Number(campusId));
  const { data: initialFaculties, isLoading: facultiesLoading, error: facultiesError } = useGetFacultiesByCampusQuery(Number(campusId));

  const [faculties, setFaculties] = useState(initialFaculties || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

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

  const filteredFaculties = faculties.filter(faculty =>
    faculty?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastFaculty = currentPage * entriesPerPage;
  const indexOfFirstFaculty = indexOfLastFaculty - entriesPerPage;
  const currentFaculties = filteredFaculties.slice(indexOfFirstFaculty, indexOfLastFaculty);
  const totalPages = Math.ceil(filteredFaculties.length / entriesPerPage);

  const columns = [
    { header: 'Faculty Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions',
      accessor: (faculty: any) => (
        <Link to={`/admin/campuses/${campusId}/faculties/${faculty.id}`}>View</Link>
      ),
    },
  ];

  if (campusLoading || facultiesLoading) return <p>Loading...</p>;
  if (campusError || facultiesError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      {campus && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{campus?.name}</h1>
          <p className={styles.text}>{campus?.description}</p>

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>Available Faculties</h2>
          <div style={{display: "flex", gap: "1.5rem"}}>
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          </div>
          {currentFaculties.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
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
    </AdminLayout>
  );
};

export default CampusDetails;
