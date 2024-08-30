import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCourseMaterialsByInstructorQuery, useAddCourseMaterialMutation, useDeleteCourseMaterialMutation } from '../../../features/api/courseMaterialsApi';
import { useFetchAssignmentsByInstructorQuery, useAddAssignmentMutation, useDeleteAssignmentMutation } from '../../../features/api/assignmentsApi';
import MaterialsList from '../../../components/MaterialsList/MaterialsList';
import styles from './CourseDetails.module.css';

const CourseDetailsPage: React.FC = () => {
  const { courseInstructorId } = useParams<{ courseInstructorId: string }>();
  const { data: materials = [], refetch: refetchMaterials } = useFetchCourseMaterialsByInstructorQuery(Number(courseInstructorId));
  const { data: assignments = [], refetch: refetchAssignments } = useFetchAssignmentsByInstructorQuery(Number(courseInstructorId));
  
  const [addMaterial] = useAddCourseMaterialMutation();
  const [deleteMaterial] = useDeleteCourseMaterialMutation();
  const [addAssignment] = useAddAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      await deleteMaterial(materialId).unwrap();
      refetchMaterials();
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && title && courseInstructorId) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('course_instructor_id', courseInstructorId);

      try {
        await addMaterial({ courseInstructorId: Number(courseInstructorId), data: formData }).unwrap();
        refetchMaterials();
        setFile(null);
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error('Failed to upload material:', error);
      }
    } else {
      console.error('Missing required fields');
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      await deleteAssignment(assignmentId).unwrap();
      refetchAssignments();
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (assignmentTitle && dueDate && courseInstructorId) {
      const formData = new FormData();
      formData.append('title', assignmentTitle);
      formData.append('description', assignmentDescription);
      formData.append('due_date', dueDate);
      formData.append('course_instructor_id', courseInstructorId);

      try {
        await addAssignment({ courseInstructorId: Number(courseInstructorId), data: formData }).unwrap();
        refetchAssignments();
        setAssignmentTitle('');
        setAssignmentDescription('');
        setDueDate('');
      } catch (error) {
        console.error('Failed to add assignment:', error);
      }
    } else {
      console.error('Missing required fields');
    }
  };

  return (
    <div className={styles.container}>
      <MaterialsList
        materials={materials}
        onDelete={handleDeleteMaterial}
        onFileChange={(e) => setFile(e.target.files?.[0] || null)}
        onUpload={handleUploadMaterial}
        file={file}
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
      />

      <h2 className={styles.headingSecondary}>- Assignments</h2>
      <form onSubmit={handleAddAssignment} className={styles.uploadForm}>
        <input
          type="text"
          placeholder="Assignment Title"
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={assignmentDescription}
          onChange={(e) => setAssignmentDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Assignment</button>
      </form>

      <div className={styles.assignmentsList}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div className={styles.assignmentCard} key={assignment.id}>
              <div className={styles.iconContainer}>
                <i className={`fas fa-clipboard ${styles.clipboardIcon}`}></i>
              </div>
              <div className={styles.contentContainer}>
                <p className={styles.title}>{assignment.title}</p>
                <p className={styles.dueDate}>
                  Assigned: {new Date(assignment.created_at).toLocaleDateString()}, Due: {new Date(assignment.due_date).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleDeleteAssignment(assignment.id)} className={styles.deleteButton}>
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))
        ) : (
          <p>No assignments available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
