import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAssignmentDetailsQuery } from '../../../features/api/assignmentsApi';
import { useAddSubmissionMutation } from '../../../features/api/submissionsApi';
import styles from './AssignmentDetails.module.css';

const AssignmentSubmission: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { data: assignment, isLoading } = useGetAssignmentDetailsQuery(Number(assignmentId));
  const [files, setFiles] = useState<File[]>([]);
  const [addSubmission, { isLoading: isSubmitting }] = useAddSubmissionMutation();

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
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files[]', file);
      });
      try {
        await addSubmission({ assignmentId: Number(assignmentId), data: formData }).unwrap();
        alert('Submission successful');
        setFiles([]);
      } catch (error) {
        alert('Submission failed');
        console.error('Error:', error);
      }
    } else {
      alert('Please select files to upload');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!assignment) {
    return <p>Assignment not found.</p>;
  }

  return (
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
        <h2 className={styles.formTitle}>Your Work</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Files:
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
              multiple
            />
          </label>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <div className={styles.fileList}>
          {files.length > 0 && (
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  <a href={URL.createObjectURL(file)} download={file.name} className={styles.fileLink}>
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
