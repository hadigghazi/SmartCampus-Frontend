import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
//import { useGetCourseByIdQuery, useGetCourseOptionsQuery, useGetInstructorsQuery, useGetCampusesQuery, useGetSemestersQuery, useGetRoomsQuery } from '../../../features/api/';
import styles from './CourseDetails.module.css';
import personalImage from '../../../assets/images/profileImage.jpg';
import { useGetCourseByIdQuery, useGetCourseOptionsQuery } from '../../../features/api/coursesApi';
import { useGetInstructorsQuery } from '../../../features/api/instructorsApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, error: courseError, isLoading: courseLoading } = useGetCourseByIdQuery(Number(id));
  const { data: courseOptions, error: optionsError, isLoading: optionsLoading } = useGetCourseOptionsQuery(Number(id));
  const { data: instructors } = useGetInstructorsQuery();
  const { data: campuses } = useGetCampusesQuery();
  const { data: semesters } = useGetSemestersQuery();
  const { data: rooms } = useGetRoomsQuery();

  const [showModal, setShowModal] = useState(false);
  const [newOptionData, setNewOptionData] = useState({
    instructor_id: '',
    campus_id: '',
    schedule: '',
    semester_id: '',
    room_id: ''
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOptionData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement API call to add the course option
    console.log(newOptionData);
    handleCloseModal();
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

      <h3 className={styles.headingTertiary}>- Course Options</h3>
      {courseOptions && courseOptions.length > 0 ? (
        <ul className={styles.optionsList}>
          {courseOptions.map(option => (
            <li key={option.id} className={styles.optionItem}>
              <img src={personalImage} alt={`${option.instructor_name}`} className={styles.optionImage} />
              <h4 className={styles.optionHeading}>{option.instructor_name}</h4>
              <p className={styles.optionText}>Campus: {option.campus_name}</p>
              <p className={styles.optionText}>Schedule: {option.schedule}</p>
              <p className={styles.optionText}>Available Seats: {option.available_seats}</p>
              <p className={styles.optionText}>Semester: {option.semester_name}</p>
              <p className={styles.optionText}>Room: {option.room}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.text}>No options available for this course.</p>
      )}

      <button onClick={handleOpenModal} className={styles.addButton}>Add Instructor</button>

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
                      {instructor.user.first_name} {instructor.user.middle_name} {instructor.user.last_name}
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
                      {room.block.name} - {room.number}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.btnContainer}>
                <button type="submit" className={styles.acceptBtn}>Add Option</button>
                <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
