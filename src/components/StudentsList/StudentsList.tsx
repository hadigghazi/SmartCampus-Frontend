import React from 'react';
import styles from './StudentsList.module.css';

const StudentsList = ({ students }) => {
  return (
    <div className={styles.studentsContainer}>
      {students.map((student) => (
        <div key={student.student_id} className={styles.studentCard}>
          <div className={styles.studentAvatar}>
            <img src={student.profile_picture} alt={`${student.first_name} ${student.last_name}`} />
          </div>
          <div className={styles.studentInfo}>
            <h3 className={styles.studentName}>
              {student.first_name} {student.middle_name} {student.last_name}
            </h3>
            <p className={styles.studentId}>ID: {student.student_id} | Email: {student.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsList;
