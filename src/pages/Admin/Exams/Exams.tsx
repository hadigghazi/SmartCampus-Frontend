import React, { useState, useEffect } from 'react';
import { useGetExamsDetailsQuery, useDeleteExamMutation, useCreateExamMutation, useUpdateExamMutation } from '../../../features/api/examsApi';
import { useGetCoursesQuery } from '../../../features/api/coursesApi';
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

const Exams: React.FC = () => {
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [examData, setExamData] = useState<any>({
    course_id: '',
    date: '',
    time: '',
    duration: 0,
    campus_id: '',
    block_id: '',
    room_id: '',
  });
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const { data: exams = [], isLoading, isError, error } = useGetExamsDetailsQuery();
  const { data: courses } = useGetCoursesQuery();
  const { data: campuses } = useGetCampusesQuery();
  const { data: blocks, refetch: refetchBlocks } = useGetBlocksByCampusQuery(examData.campus_id);
  const { data: rooms, refetch: refetchRooms } = useGetRoomsByBlockQuery(examData.block_id);

  const [deleteExam] = useDeleteExamMutation();
  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation(); // Added

  useEffect(() => {
    if (examData.campus_id) refetchBlocks();
  }, [examData.campus_id, refetchBlocks]);

  useEffect(() => {
    if (examData.block_id) refetchRooms();
  }, [examData.block_id, refetchRooms]);

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
    setSelectedExam(null); // Reset selected exam for adding new exam
    setShowModal(true);
  };

  const handleEditExamClick = (exam: any) => {
    setSelectedExam(exam); // Set selected exam for editing
    setExamData({
      course_id: exam.course_id,
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
      course_id: '',
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
    
    // Log the exam data before sending
    console.log("Submitting exam data:", examData);
  
    // Ensure time is in H:i:s format
    const [hours, minutes] = examData.time.split(':');
    const timeWithSeconds = `${hours}:${minutes}:00`; // Assuming seconds should be 00 if not provided
    
    // Prepare the payload with IDs converted to integers and time in H:i:s format
    const payload = {
      course_id: parseInt(examData.course_id, 10),
      date: examData.date,
      time: timeWithSeconds,
      duration: parseInt(examData.duration, 10),
      room_id: parseInt(examData.room_id, 10),
      campus_id: parseInt(examData.campus_id, 10),
    };
  
    try {
      if (selectedExam) {
        // Edit existing exam
        console.log("Updating exam with payload:", { id: selectedExam.id, ...payload });
        await updateExam({ id: selectedExam.id, ...payload }).unwrap();
        toast.success('Exam updated successfully!');
      } else {
        // Create new exam
        console.log("Creating new exam with payload:", payload);
        await createExam(payload).unwrap();
        toast.success('Exam created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      // Log the full error details
      console.error("Error saving exam:", error);
  
      // Handle parsing errors
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
    { header: 'Course', accessor: (exam: any) => exam.course_name || 'Unknown Course' },
    { header: 'Date', accessor: (exam: any) => new Date(exam.date).toLocaleDateString() },
    { header: 'Time', accessor: (exam: any) => new Date(`1970-01-01T${exam.time}`).toLocaleTimeString() },
    { header: 'Duration', accessor: (exam: any) => `${exam.duration} mins` },
    { header: 'Location', accessor: (exam: any) => `${exam.campus_name} - ${exam.block_name} - ${exam.room_number}` || 'Unknown Location' },
    { 
      header: 'Actions', 
      accessor: (exam: any) => (
        <div>
          <button onClick={() => handleEditExamClick(exam)}>Edit</button>
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
          <SearchInput value={searchTerm} onChange={handleSearchChange} />
          <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          <button onClick={handleAddExamClick} className={styles.addButton}>Add Exam</button>
        </div>
        {isLoading ? <p>Loading...</p> : isError ? <p>Error loading exams: {errorMessage}</p> : (
          <>
            <Table columns={columns} data={paginatedExams} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{selectedExam ? 'Edit Exam' : 'Add New Exam'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Course:
                <select
                  name="course_id"
                  value={examData.course_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Course</option>
                  {courses?.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={examData.date}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Time:
                <input
                  type="time"
                  name="time"
                  value={examData.time}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Duration (minutes):
                <input
                  type="number"
                  name="duration"
                  value={examData.duration}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Campus:
                <select
                  name="campus_id"
                  value={examData.campus_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Campus</option>
                  {campuses?.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Block:
                <select
                  name="block_id"
                  value={examData.block_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Block</option>
                  {blocks?.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Room:
                <select
                  name="room_id"
                  value={examData.room_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.number}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  {selectedExam ? 'Update Exam' : 'Add Exam'}
                </button>
                <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Exams;
