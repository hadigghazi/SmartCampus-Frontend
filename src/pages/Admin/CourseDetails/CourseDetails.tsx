import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CourseDetails.module.css';
import personalImage from '../../../assets/images/profileImage.jpg';
import {
  useGetCourseByIdQuery,
  useGetCourseOptionsQuery,
  useCreateCourseOptionMutation,
  useDeleteCourseOptionMutation,
  useUpdateCourseOptionMutation,
} from '../../../features/api/coursesApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';
import { useGetSemestersQuery } from '../../../features/api/semestersApi';
import { useGetRoomsQuery } from '../../../features/api/roomsApi';
import { useGetInstructorsWithUserDetailsQuery } from '../../../features/api/instructorsApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table'; // Import the Table component
import { useAddCoursePrerequisiteMutation, useDeleteCoursePrerequisiteMutation, useGetCoursePrerequisitesQuery } from '../../../features/api/coursePrerequisitesApi';
import { CourseOption } from '../../../features/api/types';
import { useGetCoursesByFacultyQuery } from '../../../features/api/coursesApi'; 
import Spinner from '../../../components/Spinner/Spinner';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, error: courseError, isLoading: courseLoading, refetch: refetchCourse } = useGetCourseByIdQuery(Number(id));
  const { data: courseOptions, error: optionsError, isLoading: optionsLoading, refetch: refetchCourseOptions } = useGetCourseOptionsQuery(Number(id));
  const { data: instructors } = useGetInstructorsWithUserDetailsQuery();
  const { data: campuses } = useGetCampusesQuery();
  const { data: semesters } = useGetSemestersQuery();
  const { data: rooms } = useGetRoomsQuery();
  const { data: prerequisites, error: prerequisitesError, isLoading: prerequisitesLoading, refetch: refetchPrerequisites } = useGetCoursePrerequisitesQuery(Number(id));
  const { data: coursesInFaculty } = useGetCoursesByFacultyQuery(course?.faculty_id || 0); 

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPrerequisiteModal, setShowAddPrerequisiteModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CourseOption | null>(null);
  const [newOptionData, setNewOptionData] = useState<CourseOption>({
    course_id: Number(id),
    instructor_id: 0,
    campus_id: 0,
    schedule: '',
    semester_id: 0,
    room_id: 0,
    capacity: 0,
  });
  const [selectedPrerequisiteCourseId, setSelectedPrerequisiteCourseId] = useState<number | null>(null);
  const [addCourseOption] = useCreateCourseOptionMutation();
  const [deleteCourseOption] = useDeleteCourseOptionMutation();
  const [updateCourseOption] = useUpdateCourseOptionMutation();
  const [deleteCoursePrerequisite] = useDeleteCoursePrerequisiteMutation();
  const [addCoursePrerequisite] = useAddCoursePrerequisiteMutation();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenEditModal = (option: CourseOption) => {
    setSelectedOption(option);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedOption(null);
  };

  const handleOpenAddPrerequisiteModal = () => setShowAddPrerequisiteModal(true);
  const handleCloseAddPrerequisiteModal = () => setShowAddPrerequisiteModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOptionData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCourseOption(newOptionData).unwrap();
      toast.success('Course option added successfully');
      handleCloseModal();
      refetchCourse();
      refetchCourseOptions();
      refetchPrerequisites();
    } catch (error) {
      toast.error('Failed to add course option');
    }
  };

  const handleDelete = async (optionId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
    try {
      await deleteCourseOption(optionId).unwrap();
      toast.success('Course option deleted successfully');
      refetchCourse();
      refetchCourseOptions();
    } catch (error) {
      toast.error('Failed to delete course option');
    }
  }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedOption) {
      const { name, value } = e.target;
      setSelectedOption((prevState) => ({
        ...prevState!,
        [name]: value,
      }));
    }
  };

  const handleView = (prerequisiteId: number) => {
    navigate(`/admin/courses/${prerequisiteId}`);
  };

  const handleDeletePrerequisite = async (prerequisiteId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
    try {
      await deleteCoursePrerequisite(prerequisiteId).unwrap();
      toast.success('Course prerequisite deleted successfully');
      refetchCourse();
      refetchPrerequisites();
    } catch (error) {
      toast.error('Failed to delete course prerequisite');
    }
  }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOption) {
      try {
        await updateCourseOption(selectedOption).unwrap();
        toast.success('Course option updated successfully');
        handleCloseEditModal();
        refetchCourse();
        refetchCourseOptions();
      } catch (error) {
        toast.error('Failed to update course option');
      }
    }
  };

  const handleAddPrerequisiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPrerequisiteCourseId !== null) {
      try {
        await addCoursePrerequisite({
          course_id: Number(id),
          prerequisite_course_id: selectedPrerequisiteCourseId,
        }).unwrap();
        toast.success('Course prerequisite added successfully');
        handleCloseAddPrerequisiteModal();
        refetchPrerequisites();
      } catch (error) {
        toast.error('Failed to add course prerequisite');
      }
    }
  };

  if (courseLoading || optionsLoading || prerequisitesLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (courseError) return <div>Error loading course details</div>;
  if (!course) return <div>Course not found</div>;

  const filteredCourses = coursesInFaculty?.filter(c => c.id !== course.id) || [];

  const prerequisitesIds = prerequisites?.map(p => p.prerequisite_course_id) || [];
  const availableCourses = filteredCourses.filter(c => !prerequisitesIds.includes(c.id));

  const mappedPrerequisites = prerequisites?.map((prerequisite) => ({
    prerequisite_course_name: prerequisite?.prerequisite_course?.name,
    prerequisite_course_code: prerequisite?.prerequisite_course?.code,
    prerequisite_course_credits: prerequisite?.prerequisite_course?.credits,
    actions: (
      <>
        <button onClick={() => handleView(prerequisite.prerequisite_course_id)} style={{marginRight: "1rem"}}>
          View
        </button>
        <button onClick={() => handleDeletePrerequisite(prerequisite.id)}>
          Delete
        </button>
      </>
    ),
  }));

  const prerequisiteColumns = [
    { header: 'Course Code', accessor: 'prerequisite_course_code' },
    { header: 'Course Name', accessor: 'prerequisite_course_name' },
    { header: 'Credits', accessor: 'prerequisite_course_credits' },
    { header: 'Actions', accessor: 'actions' },
  ];

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.content}>
        <h1 className={styles.headingPrimary}>{course.name}</h1>
        <h2 className={styles.headingSecondary}>{course.code}</h2>
        <p className={styles.text}>{course.credits} Credits</p>
        <p className={styles.text}>{course.description}</p>
        <div className={styles.header_container}>
          <h3 className={styles.headingTertiary}>- Course Options</h3>
          <button onClick={handleOpenModal} className={styles.addButton}>
            Add Instructor
          </button>
        </div>
        {courseOptions && courseOptions.length > 0 ? (
          <ul className={styles.optionsList}>
            {courseOptions.map((option) => (
              <li key={option.id} className={styles.optionItem}>
                <img
                  src={personalImage}
                  alt={`${option?.instructor_name}`}
                  className={styles.optionImage}
                />
                <h4 className={styles.optionHeading}>{option?.instructor_name}</h4>
                <p className={styles.optionText}>Campus: {option?.campus_name}</p>
                <p className={styles.optionText}>Schedule: {option?.schedule}</p>
                <p className={styles.optionText}>Available Seats: {option?.available_seats}</p>
                <p className={styles.optionText}>Semester: {option?.semester_name}</p>
                <p className={styles.optionText}>Room: {option?.room}</p>
                <div className={styles.btnsContainer}>
                  <button
                    onClick={() => handleDelete(option.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(option)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.text}>No options available for this course.</p>
        )}

<div className={styles.header_container}>
          <h3 className={styles.headingTertiary}>- Prerequisites</h3>
          <button onClick={handleOpenAddPrerequisiteModal} className={styles.addButton}>
            Add Prerequisite
          </button>
        </div>
        {mappedPrerequisites && mappedPrerequisites.length > 0 ? (
          <Table columns={prerequisiteColumns} data={mappedPrerequisites} />
        ) : (
          <p className={styles.text}>No prerequisites available for this course.</p>
        )}

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>Add New Course Option</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                  Instructor:
                  <select
                    name="instructor_id"
                    value={newOptionData.instructor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors?.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor?.user?.first_name}{' '}
                        {instructor?.user?.middle_name}{' '}
                        {instructor?.user?.last_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Campus:
                  <select
                    name="campus_id"
                    value={newOptionData.campus_id}
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
                  Schedule:
                  <input
                    type="text"
                    name="schedule"
                    value={newOptionData.schedule}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Semester:
                  <select
                    name="semester_id"
                    value={newOptionData.semester_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters?.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Room:
                  <select
                    name="room_id"
                    value={newOptionData.room_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms?.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.number} - {room.capacity} seats
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    name="capacity"
                    value={newOptionData.capacity}
                    onChange={handleChange}
                    required
                  />
                </label>
                <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>
                  Save
                </button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>
                  Cancel
                </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && selectedOption && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>Edit Course Option</h2>
              <form onSubmit={handleEditSubmit} className={styles.form}>
                <label>
                  Instructor:
                  <select
                    name="instructor_id"
                    value={selectedOption.instructor_id}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors?.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor?.user?.first_name}{' '}
                        {instructor?.user?.middle_name}{' '}
                        {instructor?.user?.last_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Campus:
                  <select
                    name="campus_id"
                    value={selectedOption.campus_id}
                    onChange={handleEditChange}
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
                  Schedule:
                  <input
                    type="text"
                    name="schedule"
                    value={selectedOption.schedule}
                    onChange={handleEditChange}
                    required
                  />
                </label>
                <label>
                  Semester:
                  <select
                    name="semester_id"
                    value={selectedOption.semester_id}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    {semesters?.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Room:
                  <select
                    name="room_id"
                    value={selectedOption.room_id}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms?.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.number} - {room.capacity} seats
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    name="capacity"
                    value={selectedOption.capacity}
                    onChange={handleEditChange}
                    required
                  />
                </label>
                <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>
                  Save
                </button>
                <button type="button" onClick={handleCloseEditModal} className={styles.rejectBtn}>
                  Cancel
                </button>
                </div>
              </form>
            </div>
          </div>
        )}
         {showAddPrerequisiteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>Add Course Prerequisite</h2>
            <form className={styles.form} onSubmit={handleAddPrerequisiteSubmit}>
              <select
                name="prerequisite_course_id"
                value={selectedPrerequisiteCourseId || ''}
                onChange={(e) => setSelectedPrerequisiteCourseId(Number(e.target.value))}
              >
                <option value="">Select a prerequisite course</option>
                {availableCourses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              <div className={styles.btnContainer}>
              <button className={styles.acceptBtn} type="submit">Add Prerequisite</button>
              <button className={styles.rejectBtn} onClick={handleCloseAddPrerequisiteModal}>Cancel</button>
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

export default CourseDetails;
