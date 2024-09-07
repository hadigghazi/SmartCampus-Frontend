import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetMajorByIdQuery } from '../../../features/api/majorsApi';
import { useGetCoursesByMajorQuery } from '../../../features/api/coursesApi';
import { useGetFacultyByIdQuery } from '../../../features/api/facultiesApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Pagination from '../../../components/Pagination/Pagination';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import styles from '../CourseDetails/CourseDetails.module.css';

const MajorDetails: React.FC = () => {
  const { id: majorId } = useParams<{ id: string }>();
  const { data: major, isLoading: majorLoading, error: majorError } = useGetMajorByIdQuery(Number(majorId));
  const { data: initialCourses, isLoading: coursesLoading, error: coursesError } = useGetCoursesByMajorQuery(Number(majorId));
  const { data: faculty, isLoading: facultyLoading, error: facultyError } = useGetFacultyByIdQuery(major?.faculty_id, {
    skip: !major?.faculty_id,
  });

  const [courses, setCourses] = useState(initialCourses || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  useEffect(() => {
    if (initialCourses) {
      setCourses(initialCourses);
    }
  }, [initialCourses]);

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

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * entriesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - entriesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / entriesPerPage);

  const columns = [
    { header: 'Course Code', accessor: 'code' },
    { header: 'Course Name', accessor: 'name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Actions',
      accessor: (course: any) => (
        <Link to={`/admin/courses/${course.id}`}>View</Link>
      ),
    },
  ];

  if (majorLoading || coursesLoading || facultyLoading) return <p>Loading...</p>;
  if (majorError || coursesError || facultyError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      {major && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{major.name}</h1>
          <p className={styles.headingSecondary}>
            {faculty ? faculty.name : 'Faculty not found'}
          </p>
          <p className={styles.text}>{major.description}</p>

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>Available Courses</h2>
        <div style={{display: "flex", gap: "1.5rem"}}>
          <SearchInput value={searchTerm} onChange={handleSearch} />

          <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          </div>
          {currentCourses.length > 0 ? (
            <div style={{display: 'flex',flexDirection: 'column',gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
              <Table
                columns={columns}
                data={currentCourses}
              />
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <p>No courses available for this major</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default MajorDetails;
