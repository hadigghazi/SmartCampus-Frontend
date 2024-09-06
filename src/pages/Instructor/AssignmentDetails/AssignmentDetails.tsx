import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetAssignmentDetailsQuery } from '../../../features/api/assignmentsApi';
import { useGetAllSubmissionsQuery } from '../../../features/api/submissionsApi';
import styles from './AssignmentDetails.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import InstructorLayout from '../InstructorLayout';

const apiUrl = import.meta.env.VITE_BASE_URL;

const AssignmentDetails: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data: assignment, isLoading: isAssignmentLoading } = useGetAssignmentDetailsQuery(Number(assignmentId));
  const { data: submissions, isLoading: isSubmissionsLoading } = useGetAllSubmissionsQuery(Number(assignmentId));

  if (isAssignmentLoading || isSubmissionsLoading) {
    return <p>Loading...</p>;
  }

  if (!assignment) {
    return <p>Assignment not found.</p>;
  }

  const groupedSubmissions = submissions?.reduce((acc, submission) => {
    const { student_id } = submission;
    if (!acc[student_id]) {
      acc[student_id] = {
        student: submission.student,
        files: [],
      };
    }
    acc[student_id].files.push(submission);
    return acc;
  }, {} as Record<string, { student: typeof submissions[0]['student']; files: typeof submissions }>);

  return (
    <InstructorLayout>
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

      <div className={styles.submissionsContainer}>
        <h2 className={styles.submissionsTitle}>Submissions</h2>
        {groupedSubmissions && Object.keys(groupedSubmissions).length > 0 ? (
          <div className={styles.submissionsList}>
            {Object.values(groupedSubmissions).map((group, index) => (
              <div key={index} className={styles.submissionCard}>
                <div className={styles.submissionInfo}>
                  <h3 className={styles.studentName}>
                    {group.student.user.first_name} {group.student.user.middle_name} {group.student.user.last_name}
                  </h3>
                  <p className={styles.studentId}>ID: {group.student.user_id}</p>
                </div>
                <div className={styles.filesContainer}>
                  {group.files.map((submission) => (
                    <div key={submission.id} className={styles.fileItem}>
                      <i className={`fas fa-file ${styles.fileIcon}`}></i>
                      <span>File</span>
                      <a
                        href={`${apiUrl}/submissions/${submission.id}/download`}
                        className={styles.fileLink}
                        rel="noopener noreferrer"
                        download
                      >
                        <i className={`fas fa-download ${styles.downloadIcon}`}></i>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No submissions found.</p>
        )}
      </div>
    </div>
    </InstructorLayout>
  );
};

export default AssignmentDetails;
