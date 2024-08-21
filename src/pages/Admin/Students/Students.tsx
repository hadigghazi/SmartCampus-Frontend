import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetStudentsQuery, useDeleteStudentMutation } from '../../../features/api/studentsApi';
import { useGetUsersQuery } from '../../../features/api/usersApi';
import AdminLayout from '../AdminLayout';
import styles from './Students.module.css';

const Students: React.FC = () => {
  const { data: students, isLoading: studentsLoading, error: studentsError } = useGetStudentsQuery();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useGetUsersQuery();
  const [deleteStudent] = useDeleteStudentMutation();

  const [userMap, setUserMap] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    if (users) {
      const map: { [key: number]: any } = {};
      users.forEach(user => {
        map[user.id] = user;
      });
      setUserMap(map);
    }
  }, [users]);

  if (studentsLoading || usersLoading) return <p>Loading...</p>;
  if (studentsError || usersError) return <p>Something went wrong!</p>;

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id).unwrap();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className={styles.studentsContainer}>
        <h1 className={styles.headingPrimary}>Students List</h1>
        <table className={styles.studentsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students && students.map(student => {
              const user = userMap[student.user_id];
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{user ? `${user.first_name || ''} ${user.last_name || ''}` : 'Loading...'}</td>
                  <td>
                    <Link to={`/admin/students/${student.id}`} className={styles.viewLink}>View</Link>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Students;
