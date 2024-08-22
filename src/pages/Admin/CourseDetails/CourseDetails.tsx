import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../../../features/api/coursesApi'; 

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: course, error, isLoading } = useGetCourseByIdQuery(Number(id));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading course details</div>;

  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <h1>Course Details</h1>
      <div>
        <h2>Course Information</h2>
        <p><strong>Code:</strong> {course.code}</p>
        <p><strong>Name:</strong> {course.name}</p>
        <p><strong>Description:</strong> {course.description || 'No description available'}</p>
        <p><strong>Credits:</strong> {course.credits}</p>
        <p><strong>Major ID:</strong> {course.major_id}</p>
        <p><strong>Faculty ID:</strong> {course.faculty_id}</p>
        <p><strong>Created At:</strong> {new Date(course.created_at).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(course.updated_at).toLocaleString()}</p>
        <p><strong>Deleted At:</strong> {course.deleted_at ? new Date(course.deleted_at).toLocaleString() : 'Not deleted'}</p>
      </div>
    </div>
  );
};

export default CourseDetails;
