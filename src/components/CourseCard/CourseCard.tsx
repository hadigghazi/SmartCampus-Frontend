import React from 'react';
import styles from './CourseCard.module.css'; 
import desk from '../../assets/images/desk.png'; 
import { Link } from 'react-router-dom';
import { Course } from '../../features/api/types'; 

type CourseCardProps = {
  course: Course;
  isInstructorView?: boolean;
  isChannel?: boolean; 
};

const CourseCard: React.FC<CourseCardProps> = ({ course, isInstructorView = false, isChannel = false }) => {
  const linkTo = isChannel 
    ? (isInstructorView ? `/instructor-channels/${course.id}` : `/channels/${course.course_instructor_id}`)
    : (isInstructorView ? `/instructor-courses/${course.id}` : `/courses/${course.course_instructor_id}`);
  
  return (
    <div className={styles.card}>
      <img 
        src={desk} 
        alt="Course Image" 
        className={styles.image} 
      />
      <Link to={linkTo}>
        <div className={styles.overlay}>
          <div className={styles.textContainer}>
            <p className={styles.courseSemester}>- {course.semester_name}</p>
            <p className={styles.courseCode}>{course.course_code}</p>
            <p className={styles.courseName}>{course.course_name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
