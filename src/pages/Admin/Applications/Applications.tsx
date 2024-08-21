import React from 'react';
import { useGetUsersQuery } from '../../../features/api/usersApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';

const Applications: React.FC = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const handleUserClick = (userId: number) => {
    navigate(`/applications/${userId}`);
  };

  return (
    <AdminLayout>
      <h2>Applications</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.first_name} {user.middle_name} {user.last_name}</td>
              <td>{user.status}</td>
              <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
              <td>
                <button onClick={() => handleUserClick(user.id)}>View</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default Applications;
