import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCourseMaterialsByInstructorQuery } from '../../../features/api/courseMaterialsApi';
import MaterialsList from '../../../components/MaterialsList/MaterialsList';

const StudentCourseDetailsPage: React.FC = () => {
  const { courseInstructorId } = useParams<{ courseInstructorId: string }>();
  const { data: materials } = useFetchCourseMaterialsByInstructorQuery(Number(courseInstructorId));
  return (
    <MaterialsList
      materials={materials}
    />
  );
};

export default StudentCourseDetailsPage;
