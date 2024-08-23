import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetMajorByIdQuery } from '../../../features/api/majorsApi';
import { useGetCoursesByMajorQuery } from '../../../features/api/coursesApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import styles from '../CourseDetails/CourseDetails.module.css';

const MajorDetails: React.FC = () => {
  const { id: majorId } = useParams<{ id: string }>();
  const { data: major, isLoading: majorLoading, error: majorError } = useGetMajorByIdQuery(Number(majorId));
  const { data: initialCourses, isLoading: coursesLoading, error: coursesError } = useGetCoursesByMajorQuery(Number(majorId));

  const [courses, setCourses] = useState(initialCourses || []);

  useEffect(() => {
    if (initialCourses) {
      setCourses(initialCourses);
    }
  }, [initialCourses]);

  const columns = [
    { header: 'Course Code', accessor: 'code' },
    { header: 'Course Name', accessor: 'name' },
    { header: 'Credits', accessor: 'credits' },
    { header: 'Description', accessor: 'description' },
  ];

  if (majorLoading || coursesLoading) return <p>Loading...</p>;
  if (majorError || coursesError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      {major && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{major.name}</h1>
          <p className={styles.headingSecondary}>Faculty here</p>
          <p className={styles.text}>{major.description}</p>

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>Courses</h2>
          {courses && courses.length > 0 ? (
            <Table
              columns={columns}
              data={courses}
            />
          ) : (
            <p>No courses available for this major</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default MajorDetails;
