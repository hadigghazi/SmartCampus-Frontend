import React, { useState, useEffect } from 'react';
import { useGetExamsDetailsQuery, useDeleteExamMutation, useCreateExamMutation, useUpdateExamMutation } from '../../../features/api/examsApi';
import { useGetCoursesByFacultyQuery, useGetCourseOptionsQuery } from '../../../features/api/coursesApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';
import { useGetBlocksByCampusQuery } from '../../../features/api/blocksApi';
import { useGetRoomsByBlockQuery } from '../../../features/api/roomsApi';

import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import Table from '../../../components/Table/Table';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import { useGetFacultiesQuery } from '../../../features/api/facultiesApi';

const Exams: React.FC = () => {
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [examData, setExamData] = useState<any>({
    faculty_id: '',
    course_id: '',
    course_instructor_id: '',
    date: '',
    time: '',
    duration: 0,
    campus_id: '',
    block_id: '',
    room_id: '',
  });
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const { data: exams = [], isLoading, isError, error, refetch } = useGetExamsDetailsQuery();
  const { data: faculties } = useGetFacultiesQuery();
  const { data: campuses } = useGetCampusesQuery();
  const { data: blocks, refetch: refetchBlocks } = useGetBlocksByCampusQuery(examData.campus_id);
  const { data: rooms, refetch: refetchRooms } = useGetRoomsByBlockQuery(examData.block_id);

  const [deleteExam] = useDeleteExamMutation();
  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation(); 

  const { data: coursesByFaculty, refetch: refetchCourses } = useGetCoursesByFacultyQuery(examData.faculty_id);
  const { data: courseOptions, refetch: refetchCourseOptions } = useGetCourseOptionsQuery(examData.course_id);

  useEffect(() => {
    if (examData.campus_id) refetchBlocks();
  }, [examData.campus_id, refetchBlocks]);

  useEffect(() => {
    if (examData.block_id) refetchRooms();
  }, [examData.block_id, refetchRooms]);

  useEffect(() => {
    if (examData.faculty_id) refetchCourses();
  }, [examData.faculty_id, refetchCourses]);

  useEffect(() => {
    if (examData.course_id) refetchCourseOptions();
  }, [examData.course_id, refetchCourseOptions]);

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddExamClick = () => {
    setSelectedExam(null); 
    setExamData({
      faculty_id: '',
      course_id: '',
      course_instructor_id: '',
      date: '',
      time: '',
      duration: 0,
      campus_id: '',
      block_id: '',
      room_id: '',
    });
    setShowModal(true);
  };

  const handleEditExamClick = (exam: any) => {
    setSelectedExam(exam); 
    setExamData({
      faculty_id: exam.faculty_id,
      course_id: exam.course_id,
      course_instructor_id: exam.course_instructor_id,
      date: exam.date,
      time: exam.time,
      duration: exam.duration,
      campus_id: exam.campus_id,
      block_id: exam.block_id,
      room_id: exam.room_id,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setExamData({
      faculty_id: '',
      course_id: '',
      course_instructor_id: '',
      date: '',
      time: '',
      duration: 0,
      campus_id: '',
      block_id: '',
      room_id: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExamData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
      
    const [hours, minutes] = examData.time.split(':');
    const timeWithSeconds = `${hours}:${minutes}:00`;
    
    const payload = {
      course_instructor_id: parseInt(examData.course_instructor_id, 10),
      date: examData.date,
      time: timeWithSeconds,
      duration: parseInt(examData.duration, 10),
      room_id: parseInt(examData.room_id, 10),
      campus_id: parseInt(examData.campus_id, 10),
    };
  
    try {
      if (selectedExam) {
        await updateExam({ id: selectedExam.id, ...payload }).unwrap();
        toast.success('Exam updated successfully!');
        refetch();
      } else {
        await createExam(payload).unwrap();
        toast.success('Exam created successfully!');
      }
      handleCloseModal();
      refetch();
      } catch (error) {
      console.error("Error saving exam:", error);
  
      if (error.status === 'PARSING_ERROR') {
        toast.error('Error parsing response');
      } else {
        toast.error('Error saving exam');
      }
    }
  };
  
  const handleDeleteExam = async (examId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteExam(examId).unwrap();
        toast.success('Exam deleted successfully!');
        refetch();
      } catch (err) {
        console.error('Error deleting exam:', err);
        toast.error('Failed to delete exam.');
      }
    }
  };

  const filteredExams = exams.filter((exam) => {
    return (
      exam.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.block_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.campus_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredExams.length / entriesPerPage);
  const paginatedExams = filteredExams.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const columns = [
    { header: 'Date', accessor: (exam: any) => new Date(exam.date).toLocaleDateString() },
    { header: 'Time', accessor: (exam: any) => new Date(`1970-01-01T${exam.time}`).toLocaleTimeString() },
    { header: 'Duration', accessor: (exam: any) => `${exam.duration} mins` },
    { header: 'Location', accessor: (exam: any) => `${exam.campus_name} - ${exam.block_name} - ${exam.room_number}` || 'Unknown Location' },
    { 
      header: 'Actions', 
      accessor: (exam: any) => (
        <div>
          <button style={{marginRight: ".5rem"}} onClick={() => handleEditExamClick(exam)}>Edit</button>
          <button onClick={() => handleDeleteExam(exam.id)}>Delete</button>
        </div>
      )
    }
  ];

  const errorMessage = isError
    ? (error as { data: { message?: string } }).data?.message || 'Unknown error'
    : '';

  return (
    <AdminLayout>
      <div className={styles.container}>
        <ToastNotifications />
        <h1 className={styles.headingPrimary}>Exams</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={handleSearchChange} placeholder="Search exams" />
          <button className={styles.addButton} onClick={handleAddExamClick}>Add Exam</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table columns={columns} data={paginatedExams} isLoading={isLoading} errorMessage={errorMessage} />
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{selectedExam ? 'Edit Exam' : 'Add Exam'}</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
                <label>
                  Faculty
                  <select name="faculty_id" value={examData.faculty_id} onChange={handleChange}>
                    <option value="">Select Faculty</option>
                    {faculties?.map((faculty: any) => (
                      <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Course
                  <select name="course_id" value={examData.course_id} onChange={handleChange}>
                    <option value="">Select Course</option>
                    {coursesByFaculty?.map((course: any) => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Instructor
                  <select name="course_instructor_id" value={examData.course_instructor_id} onChange={handleChange}>
                    <option value="">Select Instructor</option>
                    {courseOptions?.map((option: any) => (
                      <option key={option.id} value={option.id}>{option.instructor_name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Date
                  <input type="date" name="date" value={examData.date} onChange={handleChange} />
                </label>
                <label>
                  Time
                  <input type="time" name="time" value={examData.time} onChange={handleChange} />
                </label>
                <label>
                  Duration (minutes)
                  <input type="number" name="duration" value={examData.duration} onChange={handleChange} />
                </label>
                <label>
                  Campus
                  <select name="campus_id" value={examData.campus_id} onChange={handleChange}>
                    <option value="">Select Campus</option>
                    {campuses?.map((campus: any) => (
                      <option key={campus.id} value={campus.id}>{campus.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Block
                  <select name="block_id" value={examData.block_id} onChange={handleChange}>
                    <option value="">Select Block</option>
                    {blocks?.map((block: any) => (
                      <option key={block.id} value={block.id}>{block.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Room
                  <select name="room_id" value={examData.room_id} onChange={handleChange}>
                    <option value="">Select Room</option>
                    {rooms?.map((room: any) => (
                      <option key={room.id} value={room.id}>{room.number}</option>
                    ))}
                  </select>
                </label>
                <div  className={styles.btnContainer}>
                <button className={styles.acceptBtn} type="submit">{selectedExam ? 'Update Exam' : 'Add Exam'}</button>
                <button className={styles.rejectBtn} type="button" onClick={handleCloseModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Exams;
