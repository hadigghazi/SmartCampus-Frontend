import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetAssignmentDetailsQuery } from '../../../features/api/assignmentsApi';
import styles from './AssignmentDetails.module.css';

const AssignmentDetails: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data: assignment, isLoading } = useGetAssignmentDetailsQuery(Number(assignmentId));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!assignment) {
    return <p>Assignment not found.</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <i className={`fas fa-clipboard ${styles.clipboardIcon}`}></i>
        </div>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{assignment.title}</h1>
          <p className={styles.createdDate}>Created: {new Date(assignment.created_at).toLocaleDateString()}</p>
        </div>
        <div className={styles.dueDateContainer}>
          <p className={styles.dueDate}>Due: {new Date(assignment.due_date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className={styles.descriptionContainer}>
        <p>{assignment.description}</p>
      </div>
    </div>
  );
};

export default AssignmentDetails;
