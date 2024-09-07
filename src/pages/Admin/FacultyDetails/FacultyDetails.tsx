import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFacultyByIdQuery } from '../../../features/api/facultiesApi';
import { useGetMajorsByFacultyQuery } from '../../../features/api/majorsApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Pagination from '../../../components/Pagination/Pagination';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import styles from '../CourseDetails/CourseDetails.module.css';
import Spinner from '../../../components/Spinner/Spinner';

const FacultyDetails: React.FC = () => {
  const { id: facultyId } = useParams<{ id: string }>();
  const { data: faculty, isLoading: facultyLoading, error: facultyError } = useGetFacultyByIdQuery(Number(facultyId));
  const { data: initialMajors, isLoading: majorsLoading, error: majorsError } = useGetMajorsByFacultyQuery(Number(facultyId));

  const [majors, setMajors] = useState(initialMajors || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    if (initialMajors) {
      setMajors(initialMajors);
    }
  }, [initialMajors]);

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

  const filteredMajors = majors.filter(major =>
    major.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMajor = currentPage * entriesPerPage;
  const indexOfFirstMajor = indexOfLastMajor - entriesPerPage;
  const currentMajors = filteredMajors.slice(indexOfFirstMajor, indexOfLastMajor);
  const totalPages = Math.ceil(filteredMajors.length / entriesPerPage);

  const columns = [
    { header: 'Major Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions',
      accessor: (major: any) => (
        <Link to={`/admin/majors/${major.id}`}>View</Link>
      ),
    },
  ];

  if (facultyLoading || majorsLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (facultyError || majorsError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      {faculty && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{faculty.name}</h1>
          <p className={styles.text}>{faculty.description}</p>

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>Available Majors</h2>
          <div style={{display: "flex", gap: "1.5rem"}}>
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          </div>
          {currentMajors.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Table
                columns={columns}
                data={currentMajors}
              />
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <p>No majors available for this faculty</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default FacultyDetails;
