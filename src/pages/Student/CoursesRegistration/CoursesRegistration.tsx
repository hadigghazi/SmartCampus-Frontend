import React, { useState, useEffect } from 'react';
import { useGetAvailableCoursesForStudentQuery } from '../../../features/api/registrationsApi';
import Table from '../../../components/Table/Table'; 
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import styles from '../../Admin/Courses/Courses.module.css'; 

const CoursesRegistration: React.FC = () => {
  const { data: availableCourses, isLoading, error } = useGetAvailableCoursesForStudentQuery();

  const [localCourses, setLocalCourses] = useState(availableCourses || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  const navigate = useNavigate();

  useEffect(() => {
    if (availableCourses) {
      setLocalCourses(availableCourses);
    }
  }, [availableCourses]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredCourses = localCourses.filter(course => {
    const courseName = course.course_name.toLowerCase();
    return searchTerms.every(term => courseName.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCourses.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredCourses.length / entriesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/registrations/${courseId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headingPrimary}>Courses Registration</h1>
      <div className={styles.filters}>
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
      <Table
        columns={[
          { header: 'Course Name', accessor: 'course_name' },
          { header: 'Course Code', accessor: 'course_code' },
          { header: 'Credits', accessor: 'credits' },
          { header: 'Prerequisites', accessor: 'prerequisites', render: (prerequisites: string[]) => prerequisites.length > 0 ? prerequisites.join(', ') : 'None' },
          { header: 'Actions', accessor: 'actions', render: (course: { course_id: number }) => (
            <button onClick={() => handleViewCourse(course.course_id)}>View</button>
          )},
        ]}
        data={currentEntries || []}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default CoursesRegistration;
