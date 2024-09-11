import React, { useState } from 'react';
import { useGetCoursesQuery, useDeleteCourseMutation, useAddCourseMutation, useUpdateCourseMutation } from '../../../features/api/coursesApi';
import { useGetFacultiesQuery } from '../../../features/api/facultiesApi';
import { useGetMajorsQuery } from '../../../features/api/majorsApi'; // Adjust import
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
import Spinner from '../../../components/Spinner/Spinner';

const Courses: React.FC = () => {
  const { data: courses, isLoading, error, refetch } = useGetCoursesQuery();
  const { data: faculties } = useGetFacultiesQuery();
  const { data: majors } = useGetMajorsQuery(); 

  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<number | 'all'>('all');
  const [selectedMajorFilter, setSelectedMajorFilter] = useState<number | 'all'>('all');

  const [deleteCourse] = useDeleteCourseMutation();
  const [addCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courseIdToEdit, setCourseIdToEdit] = useState<number | null>(null);
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 0,
    faculty_id: 'all',
    major_id: 'all',
  });

  const navigate = useNavigate();

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredCourses = courses?.filter((course) => {
    const matchesFaculty = selectedFacultyFilter === 'all' || course.faculty_id === selectedFacultyFilter;
    const matchesMajor = selectedMajorFilter === 'all' || course.major_id === selectedMajorFilter;
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
        refetch();
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
    setIsEditing(false);
    setCourseIdToEdit(null);
    setCourseData({
      code: '',
      name: '',
      description: '',
      credits: 0,
      faculty_id: 'all',
      major_id: 'all',
    });
    setShowModal(true);
  };

  const handleEditCourseClick = (course) => {
    setIsEditing(true);
    setCourseIdToEdit(course.id);
    setCourseData({
      code: course.code,
      name: course.name,
      description: course.description || '',
      credits: course.credits,
      faculty_id: course.faculty_id || 'all',
      major_id: course.major_id || 'all',
    });
    setSelectedFacultyModal(course.faculty_id || 'all');
    setSelectedMajorModal(course.major_id || 'all');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCourseData({
      code: '',
      name: '',
      description: '',
      credits: 0,
      faculty_id: 'all',
      major_id: 'all',
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
      if (isEditing && courseIdToEdit) {
        await updateCourse({ id: courseIdToEdit, ...courseData }).unwrap();
        toast.success('Course updated successfully!');
      } else {
        await addCourse(courseData).unwrap();
        toast.success('Course added successfully!');
      }
      
      handleCloseModal();
      refetch();
    } catch (err) {
      console.error('Error saving course:', err);
      toast.error('Failed to save course.');
    }
  };

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Courses</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select
            value={selectedFacultyFilter}
            className={styles.selectField}
            onChange={(e) => {
              setSelectedFacultyFilter(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setSelectedMajorFilter('all'); 
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
            value={selectedMajorFilter}
            className={styles.selectField}
            onChange={(e) => setSelectedMajorFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
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
          <button onClick={handleAddCourseClick} className={styles.addButton}>Add Course</button>
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
              <button onClick={() => handleEditCourseClick(course)}>Edit</button>
              <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{isEditing ? 'Edit Course' : 'Add Course'}</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  Code:
                  <input type="text" name="code" value={courseData.code} onChange={handleChange} required />
                </label>
                <label>
                  Name:
                  <input type="text" name="name" value={courseData.name} onChange={handleChange} required />
                </label>
                <label>
                  Description:
                  <input type="text" name="description" value={courseData.description} onChange={handleChange} />
                </label>
                <label>
                  Credits:
                  <input type="number" name="credits" value={courseData.credits} onChange={handleChange} required />
                </label>
                <label>
                  Faculty:
                  <select name="faculty_id" value={courseData.faculty_id} onChange={handleChange}>
                    <option value="all">All Faculties</option>
                    {faculties?.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Major:
                  <select name="major_id" value={courseData.major_id} onChange={handleChange}>
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
                </label>
                <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>{isEditing ? 'Update' : 'Add'} Course</button>
                <button className={styles.rejectBtn} onClick={handleCloseModal}>Cancel</button>
                </div>
                </form>
            </div>
          </div>
        )}
        <ToastNotifications />
      </div>
    </AdminLayout>
  );
};

export default Courses;
