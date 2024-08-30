import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AssignmentsList.module.css';

interface Assignment {
  id: number;
  title: string;
  created_at: string;
  due_date: string;
}

interface AssignmentsListProps {
  assignments: Assignment[];
  courseInstructorId: string;
  onDelete?: (assignmentId: number) => void;
  isInstructor?: boolean;
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({ assignments, courseInstructorId, onDelete, isInstructor }) => {
  return (
    <div className={styles.assignmentsList}>
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <div className={styles.assignmentCard} key={assignment.id}>
            <div className={styles.iconContainer}>
              <i className={`fas fa-clipboard ${styles.clipboardIcon}`}></i>
            </div>
            <div className={styles.contentContainer}>
              <Link 
                to={`/${isInstructor ? 'instructor-courses' : 'courses'}/${courseInstructorId}/assignments/${assignment.id}`}
                className={styles.titleLink}
              >
                <p className={styles.title}>{assignment.title}</p>
              </Link>
              <p className={styles.dueDate}>
                Assigned: {new Date(assignment.created_at).toLocaleDateString()}, Due: {new Date(assignment.due_date).toLocaleDateString()}
              </p>
            </div>
            {isInstructor && onDelete && (
              <button onClick={() => onDelete(assignment.id)} className={styles.deleteButton}>
                <i className="fas fa-trash-alt"></i>
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No assignments available.</p>
      )}
    </div>
  );
};

export default AssignmentsList;
