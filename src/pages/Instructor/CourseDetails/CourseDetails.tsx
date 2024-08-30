import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCourseMaterialsByInstructorQuery, useAddCourseMaterialMutation } from '../../../features/api/courseMaterialsApi';
import styles from './CourseDetails.module.css';
const apiUrl = import.meta.env.VITE_BASE_URL;

const CourseDetailsPage: React.FC = () => {
  const { courseInstructorId } = useParams<{ courseInstructorId: string }>();
  const { data: materials = [], refetch } = useFetchCourseMaterialsByInstructorQuery(Number(courseInstructorId));
  const [addMaterial] = useAddCourseMaterialMutation();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file && title && courseInstructorId) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('course_instructor_id', courseInstructorId);

      try {
        await addMaterial({ courseInstructorId: Number(courseInstructorId), data: formData }).unwrap();
        refetch(); 
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

  return (
    <div className={styles.container}>
      <h1 className={styles.headingPrimary}>Course Materials</h1>

      <form onSubmit={handleUpload} className={styles.uploadForm}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload</button>
      </form>

      <div className={styles.materialsList}>
        {materials.length > 0 ? (
          materials.map((material) => (
            <div key={material.id} className={styles.materialCard}>
              <p><strong>Title:</strong> {material.title}</p>
              <p><strong>Description:</strong> {material.description}</p>
              <p><strong>Uploaded By:</strong> {material.uploaded_by}</p>
              <a href={`${apiUrl}/course-materials/${material.id}/download`} download>
                Download {material.file_name}
              </a>
            </div>
          ))
        ) : (
          <p>No materials available.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
