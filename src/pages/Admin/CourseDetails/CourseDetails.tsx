import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CourseDetails.module.css';
import personalImage from '../../../assets/images/profileImage.jpg';
import { useGetCourseByIdQuery, useGetCourseOptionsQuery, useCreateCourseOptionMutation, useDeleteCourseOptionMutation, useUpdateCourseOptionMutation } from '../../../features/api/coursesApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';
import { useGetSemestersQuery } from '../../../features/api/semesterApi';
import { useGetRoomsQuery } from '../../../features/api/roomsApi';
import { useGetInstructorsWithUserDetailsQuery } from '../../../features/api/instructorsApi';
import { CourseOption } from '../../../features/api/types';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: course, error: courseError, isLoading: courseLoading } = useGetCourseByIdQuery(Number(id));
  const { data: courseOptions, error: optionsError, isLoading: optionsLoading } = useGetCourseOptionsQuery(Number(id));
  const { data: instructors } = useGetInstructorsWithUserDetailsQuery();
  const { data: campuses } = useGetCampusesQuery();
  const { data: semesters } = useGetSemestersQuery();
  const { data: rooms } = useGetRoomsQuery();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CourseOption | null>(null);
  const [newOptionData, setNewOptionData] = useState<CourseOption>({
    course_id: Number(id),
    instructor_id: 0,
    campus_id: 0,
    schedule: '',
    semester_id: 0,
    room_id: 0,
    capacity: 0
  });

  const [addCourseOption] = useCreateCourseOptionMutation(); 
  const [deleteCourseOption] = useDeleteCourseOptionMutation();
  const [updateCourseOption] = useUpdateCourseOptionMutation();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOptionData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addCourseOption(newOptionData).unwrap();
      console.log('Course option added successfully');
      handleCloseModal();
    } catch (error) {
      console.error('Failed to add course option:', error);
    }
  };

  const handleDelete = async (optionId: number) => {
    try {
      await deleteCourseOption(optionId).unwrap();
      console.log('Course option deleted successfully');
    } catch (error) {
      console.error('Failed to delete course option:', error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedOption) {
      const { name, value } = e.target;
      setSelectedOption(prevState => ({
        ...prevState!,
        [name]: value
      }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedOption) {
      try {
        await updateCourseOption(selectedOption).unwrap();
        console.log('Course option updated successfully');
        handleCloseEditModal();
      } catch (error) {
        console.error('Failed to update course option:', error);
      }
    }
  };

  if (courseLoading || optionsLoading) return <div>Loading...</div>;
  if (courseError || optionsError) return <div>Error loading course details</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className={styles.content}>
      <h1 className={styles.headingPrimary}>{course.name}</h1>
      <h2 className={styles.headingSecondary}>{course.code}</h2>
      <p className={styles.text}>{course.credits} Credits</p>
      <p className={styles.text}>{course.description}</p>
     <div className={styles.header_container}>
      <h3 className={styles.headingTertiary}>- Course Options</h3>
      <button onClick={handleOpenModal} className={styles.addButton}>Add Instructor</button>
      </div>
      {courseOptions && courseOptions.length > 0 ? (
        <ul className={styles.optionsList}>
          {courseOptions.map(option => (
            <li key={option.id} className={styles.optionItem}>
              <img src={personalImage} alt={`${option?.instructor_name}`} className={styles.optionImage} />
              <h4 className={styles.optionHeading}>{option?.instructor_name}</h4>
              <p className={styles.optionText}>Campus: {option?.campus_name}</p>
              <p className={styles.optionText}>Schedule: {option?.schedule}</p>
              <p className={styles.optionText}>Available Seats: {option?.available_seats}</p>
              <p className={styles.optionText}>Semester: {option?.semester_name}</p>
              <p className={styles.optionText}>Room: {option?.room}</p>
              <div className={styles.btnsContainer}>
              <button onClick={() => handleDelete(option.id)} className={styles.deleteButton}>Delete</button>
              <button onClick={() => handleOpenEditModal(option)} className={styles.editButton}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.text}>No options available for this course.</p>
      )}

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>Add New Course Option</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Instructor:
                <select name="instructor_id" value={newOptionData.instructor_id} onChange={handleChange} required>
                  <option value="">Select Instructor</option>
                  {instructors?.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor?.user?.first_name} {instructor?.user?.middle_name} {instructor?.user?.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Campus:
                <select name="campus_id" value={newOptionData.campus_id} onChange={handleChange} required>
                  <option value="">Select Campus</option>
                  {campuses?.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Schedule:
                <input type="text" name="schedule" value={newOptionData.schedule} onChange={handleChange} required />
              </label>
              <label>
                Semester:
                <select name="semester_id" value={newOptionData.semester_id} onChange={handleChange} required>
                  <option value="">Select Semester</option>
                  {semesters?.map(semester => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Room:
                <select name="room_id" value={newOptionData.room_id} onChange={handleChange} required>
                  <option value="">Select Room</option>
                  {rooms?.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.number}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Capacity:
                <input type="number" name="capacity" value={newOptionData.capacity} onChange={handleChange} required />
              </label>
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>Add Option</button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
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
                <select name="instructor_id" value={selectedOption.instructor_id} onChange={handleEditChange} required>
                  <option value="">Select Instructor</option>
                  {instructors?.map(instructor => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor?.user?.first_name} {instructor?.user?.middle_name} {instructor?.user?.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Campus:
                <select name="campus_id" value={selectedOption.campus_id} onChange={handleEditChange} required>
                  <option value="">Select Campus</option>
                  {campuses?.map(campus => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Schedule:
                <input type="text" name="schedule" value={selectedOption.schedule} onChange={handleEditChange} required />
              </label>
              <label>
                Semester:
                <select name="semester_id" value={selectedOption.semester_id} onChange={handleEditChange} required>
                  <option value="">Select Semester</option>
                  {semesters?.map(semester => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Room:
                <select name="room_id" value={selectedOption.room_id} onChange={handleEditChange} required>
                  <option value="">Select Room</option>
                  {rooms?.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.number}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Capacity:
                <input type="number" name="capacity" value={selectedOption.capacity} onChange={handleEditChange} required />
              </label>
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>Save Changes</button>
                <button type="button" onClick={handleCloseEditModal} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
