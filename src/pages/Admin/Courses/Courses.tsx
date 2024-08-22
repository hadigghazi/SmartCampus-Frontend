import React, { useState, useEffect } from 'react';
import { useGetCoursesQuery, useDeleteCourseMutation, useAddCourseMutation } from '../../../features/api/coursesApi';
import { useGetFacultiesQuery } from '../../../features/api/facultiesApi';
import { useGetMajorsByFacultyQuery } from '../../../features/api/majorsApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from './Courses.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

const Courses: React.FC = () => {
  const { data: courses, isLoading, error } = useGetCoursesQuery();
  const { data: faculties } = useGetFacultiesQuery();
  const [selectedFaculty, setSelectedFaculty] = useState<number | 'all'>('all');
  const [selectedMajor, setSelectedMajor] = useState<number | 'all'>('all');
  const { data: majors, refetch: refetchMajors } = useGetMajorsByFacultyQuery(selectedFaculty !== 'all' ? selectedFaculty : undefined);
  const [deleteCourse] = useDeleteCourseMutation();
  const [addCourse] = useAddCourseMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 0,
    faculty_id: selectedFaculty === 'all' ? undefined : selectedFaculty,
    major_id: selectedMajor === 'all' ? undefined : selectedMajor,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFaculty !== 'all') {
      refetchMajors();
    }
  }, [selectedFaculty, refetchMajors]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredCourses = courses?.filter((course) => {
    const matchesFaculty = selectedFaculty === 'all' || course.faculty_id === selectedFaculty;
    const matchesMajor = selectedMajor === 'all' || course.major_id === selectedMajor;
    const courseName = course.name.toLowerCase();
    const courseCode = course.code.toLowerCase();
    const matchesSearchTerm = searchTerms.every(term => courseName.includes(term) || courseCode.includes(term));
    return matchesFaculty && matchesMajor && matchesSearchTerm;
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

  const handleViewCourse = (courseId: number) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const handleAddCourseClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCourseData({
      code: '',
      name: '',
      description: '',
      credits: 0,
      faculty_id: selectedFaculty === 'all' ? undefined : selectedFaculty,
      major_id: selectedMajor === 'all' ? undefined : selectedMajor,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCourseData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCourse(courseData).unwrap();
      toast.success('Course added successfully!');
      handleCloseModal();
    } catch (err) {
      console.error('Error adding course:', err);
      toast.error('Failed to add course.');
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Courses</h1>
        <button onClick={handleAddCourseClick} className={styles.addButton}>Add Course</button>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select
            value={selectedFaculty}
            className={styles.selectField}
            onChange={(e) => {
              setSelectedFaculty(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setSelectedMajor('all'); // Reset major selection when faculty changes
            }}
          >
            <option value="all">All Faculties</option>
            {faculties?.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
          <select
            value={selectedMajor}
            className={styles.selectField}
            onChange={(e) => setSelectedMajor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            disabled={selectedFaculty === 'all'}
          >
            <option value="all">All Majors</option>
            {majors?.length > 0 ? (
              majors.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))
            ) : (
              <option value="">No majors available</option>
            )}
          </select>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'Course Code', accessor: 'code' },
            { header: 'Course Name', accessor: 'name' },
            { header: 'Credit Hours', accessor: 'credits' },
          ]}
          data={currentEntries || []}
          actions={(course) => (
            <>
              <button onClick={() => handleViewCourse(course.id)}>View</button>
              <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
            </>
          )}
        />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Course Code:
                <input
                  type="text"
                  name="code"
                  value={courseData.code}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Course Name:
                <input
                  type="text"
                  name="name"
                  value={courseData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                />
              </label>
              <label>
                Credits:
                <input
                  type="number"
                  name="credits"
                  value={courseData.credits}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Faculty:
                <select
                  name="faculty_id"
                  value={courseData.faculty_id || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculties?.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Major:
                <select
                  name="major_id"
                  value={courseData.major_id || ''}
                  onChange={handleChange}
                  disabled={!courseData.faculty_id}
                  required
                >
                  <option value="">Select Major</option>
                  {majors?.map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.modalButtons}>
                <button type="submit">Add Course</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Courses;
