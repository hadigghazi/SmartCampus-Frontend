import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAssignmentDetailsQuery } from '../../../features/api/assignmentsApi';
import { useAddSubmissionMutation, useFetchSubmissionsByAssignmentQuery, useDeleteSubmissionMutation } from '../../../features/api/submissionsApi';
import styles from './AssignmentDetails.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import StudentLayout from '../StudentLayout';
import Spinner from '../../../components/Spinner/Spinner';
const apiUrl = import.meta.env.VITE_BASE_URL;

const AssignmentSubmission: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data: assignment, isLoading: assignmentLoading } = useGetAssignmentDetailsQuery(Number(assignmentId));
  const { data: submissions, isLoading: submissionsLoading, refetch } = useFetchSubmissionsByAssignmentQuery(Number(assignmentId));
  const [addSubmission, { isLoading: isSubmitting }] = useAddSubmissionMutation();
  const [deleteSubmission] = useDeleteSubmissionMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [existingSubmissions, setExistingSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<string>('Assigned');
  const [isPastDueDate, setIsPastDueDate] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (assignment) {
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      setIsPastDueDate(now > dueDate);
    }
  }, [assignment]);

  useEffect(() => {
    if (submissions) {
      setExistingSubmissions(submissions);
      setStatus(submissions.length > 0 ? 'Turned In' : 'Assigned');
      setHasSubmitted(submissions.length > 0);
    }
  }, [submissions]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(event.target.files)
      ]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length > 0 && !isPastDueDate) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files[]', file);
      });
      try {
        await addSubmission({ assignmentId: Number(assignmentId), data: formData }).unwrap();
        toast.success('Submission successful');
        setFiles([]);
        refetch();
      } catch (error) {
        toast.error('Submission failed');
        console.error('Error:', error);
      }
    } else if (isPastDueDate) {
      toast.error('Cannot submit files past the due date');
    } else {
      toast.warning('Please select files to upload');
    }
  };

  const handleDeleteSubmission = async (submissionId: number) => {
    if (!isPastDueDate) {
      try {
        await deleteSubmission(submissionId).unwrap();
        refetch();
        toast.success('Submission deleted');
      } catch (error) {
        toast.error('Failed to delete submission');
        console.error('Error:', error);
      }
    } else {
      toast.error('Cannot delete submissions past the due date');
    }
  };

  if (assignmentLoading || submissionsLoading) {
    return <StudentLayout><Spinner /></StudentLayout>;
  }

  if (!assignment) {
    return <p>Assignment not found.</p>;
  }

  return (
    <StudentLayout>
    <div className={styles.container}>
      <div className={styles.detailsContainer}>
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
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>{status}</h2>
        {status === 'Assigned' ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
              <input
                type="file"
                onChange={handleFileChange}
                className={styles.fileInput}
                multiple
                disabled={isPastDueDate}
              />
            </label>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isPastDueDate}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            {isPastDueDate && !hasSubmitted && (
              <p className={styles.warningMessage}>You cannot submit files as the due date has passed and you haven't submitted anything yet.</p>
            )}
          </form>
        ) : (
          <div>
            <div className={styles.fileList}>
              {existingSubmissions.length > 0 ? (
                <ul>
                  {existingSubmissions.map((submission) => (
                    <li key={submission.id} className={styles.fileItem}>
                      <i className={`fas fa-file ${styles.fileIcon}`}></i>
                      {`File ${existingSubmissions.findIndex(s => s.id === submission.id) + 1}`}
                      <a
                        href={`${apiUrl}/submissions/${submission.id}/download`}
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                        download
                      >
                        <i className={`fas fa-download ${styles.fileIcon}`}></i>
                      </a>
                      <i
                        className={`fas fa-trash ${styles.deleteIcon}`}
                        onClick={() => handleDeleteSubmission(submission.id)}
                      ></i>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No submissions found.</p>
              )}
            </div>
          </div>
        )}
              <ToastContainer />

      </div>
    </div>
    </StudentLayout>
  );
};

export default AssignmentSubmission;
