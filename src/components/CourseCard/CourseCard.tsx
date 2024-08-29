import React from 'react';
import styles from './CourseCard.module.css'; 
import desk from '../../assets/images/desk.png'; 
import { Link } from 'react-router-dom';
import { Course } from '../../features/api/types'; 

type CourseCardProps = {
  course: Course;
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className={styles.card}>
      <img 
        src={desk} 
        alt="Course Image" 
        className={styles.image} 
      />
      <Link to={`/courses/${course.course_instructor_id}`}>
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
