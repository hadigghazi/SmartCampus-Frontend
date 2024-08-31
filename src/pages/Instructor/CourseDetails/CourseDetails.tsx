import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useFetchCourseMaterialsByInstructorQuery,
  useAddCourseMaterialMutation,
  useDeleteCourseMaterialMutation,
} from '../../../features/api/courseMaterialsApi';
import {
  useFetchAssignmentsByInstructorQuery,
  useAddAssignmentMutation,
  useDeleteAssignmentMutation,
} from '../../../features/api/assignmentsApi';
import { useGetRegisteredStudentsQuery } from '../../../features/api/registrationsApi'; 
import { useGetCourseDetailsByInstructorIdQuery } from '../../../features/api/coursesApi'; 
import MaterialsList from '../../../components/MaterialsList/MaterialsList';
import AssignmentsList from '../../../components/AssignmentsList/AssignmentsList';
import StudentsList from '../../../components/StudentsList/StudentsList'; 
import styles from './CourseDetails.module.css';

const CourseDetailsPage: React.FC = () => {
  const { courseInstructorId } = useParams<{ courseInstructorId: string }>();
  
  const { data: courseDetails, isLoading: isCourseLoading } = useGetCourseDetailsByInstructorIdQuery(Number(courseInstructorId));
  const { data: materials = [], refetch: refetchMaterials } = useFetchCourseMaterialsByInstructorQuery(Number(courseInstructorId));
  const { data: assignments = [], refetch: refetchAssignments } = useFetchAssignmentsByInstructorQuery(Number(courseInstructorId));
  const { data: students = [] } = useGetRegisteredStudentsQuery(Number(courseInstructorId));

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
      {isCourseLoading ? (
        <p>Loading course details...</p>
      ) : (
        <>
          <h1 className={styles.headingPrimary}>{courseDetails?.course_name} ({courseDetails?.course_code})</h1>
        </>
      )}
      
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

      <AssignmentsList 
        assignments={assignments}
        courseInstructorId={courseInstructorId}
        onDelete={handleDeleteAssignment}
        isInstructor={true}
      />

      <h2 className={styles.headingSecondary}>- Enrolled Students</h2>
      <StudentsList students={students} />
    </div>
  );
};

export default CourseDetailsPage;
