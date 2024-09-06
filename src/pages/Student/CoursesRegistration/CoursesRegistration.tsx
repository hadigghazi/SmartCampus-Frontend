import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../../components/Table/Table'; 
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import styles from '../../Admin/Courses/Courses.module.css'; 
import aistyles from '../CourseDetails/CourseDetails.module.css';
import { useGetAvailableCoursesForStudentQuery } from '../../../features/api/registrationsApi';
import StudentLayout from '../StudentLayout';
import ProtectedRoute from '../../../components/ProtectedRoutes/PaymentRoute';

const apiUrl = import.meta.env.VITE_BASE_URL;

const CoursesRegistration: React.FC = () => {
  const { data: availableCourses, isLoading, error } = useGetAvailableCoursesForStudentQuery();
  const [localCourses, setLocalCourses] = useState(availableCourses || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (availableCourses) {
      const processedCourses = availableCourses.map(course => ({
        ...course,
        prerequisites: course.prerequisites.length > 0 ? course.prerequisites.join(', ') : 'None'
      }));
      setLocalCourses(processedCourses);
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

  const handleGetSuggestions = async () => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await axios.get(`${apiUrl}/suggest-courses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Failed to fetch AI suggestions", error);
    }
  };

  const formattedSuggestions = aiSuggestions ? aiSuggestions.replace(/\n/g, '<br/>') : '';

  return (
    <ProtectedRoute>
    <StudentLayout>
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
          { header: 'Prerequisites', accessor: 'prerequisites' }
        ]}
        data={currentEntries || []}
        actions={(course) => (
          <button onClick={() => handleViewCourse(course.course_id)}>View</button>
        )}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      <div className={styles.suggestionsSection}>
        <h2 className={styles.headingSecondary} style={{marginTop: "7rem"}}>AI Course Suggestions</h2>
        <button style={{marginTop: "2rem"}} onClick={handleGetSuggestions} className={`${aistyles.submitButton}`}>
          Get AI Course Suggestions
        </button>
        {aiSuggestions && (
          <div className={aistyles.questions}>
            <div dangerouslySetInnerHTML={{ __html: formattedSuggestions }} />
          </div>
        )}
      </div>
    </div>
    </StudentLayout>
    </ProtectedRoute>
  );
};

export default CoursesRegistration;
