import React, { useState } from 'react';
import { useGetCoursesQuery, useDeleteCourseMutation } from '../../../features/api/coursesApi'; // Adjust the path as necessary
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

const Courses: React.FC = () => {
  const { data: courses, isLoading, error } = useGetCoursesQuery();
  const [deleteCourse] = useDeleteCourseMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredCourses = courses?.filter((course) => {
    const courseName = course.name.toLowerCase();
    const courseIdString = course.id.toString();

    return searchTerms.every(term =>
      courseName.includes(term) || courseIdString.includes(term)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredCourses?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil((filteredCourses?.length || 0) / entriesPerPage);

  const handleDeleteCourse = async (courseId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteCourse(courseId).unwrap();
        toast.success('Course deleted successfully!');
      } catch (err) {
        console.error('Error deleting course:', err);
        toast.error('Failed to delete course.');
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

  const columns = [
    { header: 'Course Code', accessor: 'code' },
    { header: 'Course Name', accessor: 'name' },
    { header: 'Credit Hours', accessor: 'credits' },
  ];

  return (
    <AdminLayout>
      <h2>Course Management</h2>
      <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
      <Table
        columns={columns}
        data={currentEntries || []}
        actions={(course) => (
          <div>
            <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
          </div>
        )}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Courses;
