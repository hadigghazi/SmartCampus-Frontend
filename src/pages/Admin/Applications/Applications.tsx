import React, { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../../features/api/usersApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from './Applications.module.css';

const Applications: React.FC = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20); 
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
    const userIdString = user.id.toString();
  
    const matchesSearchTerm = searchTerms.every(term => 
      fullName.includes(term) || userIdString.includes(term)
    );
  
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesDateRange = (!startDate || new Date(user.created_at!) >= new Date(startDate)) &&
      (!endDate || new Date(user.created_at!) <= new Date(endDate));
  
    return matchesSearchTerm && matchesStatus && matchesDateRange;
  });
  

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredUsers?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil((filteredUsers?.length || 0) / entriesPerPage);

  const handleUserClick = (userId: number) => {
    navigate(`/admin/applications/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    }
  };

  const resetDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1); 
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>Applications</h2>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.inputField}
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.selectField}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.inputField}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.inputField}
          />
          <button 
            onClick={resetDateRange} 
            className={styles.resetButton}
          >
            Reset Dates
          </button>
        </div>
        <div className={styles.paginationControls}>
          <label htmlFor="entriesPerPage">Entries per page:</label>
          <select 
            id="entriesPerPage"
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className={styles.selectField}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Status</th>
                <th className={styles.tableHeader}>Date</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries?.map((user) => (
                <tr key={user.id}>
                  <td className={styles.tableCell}>{user.id}</td>
                  <td className={styles.tableCell}>{user.first_name} {user.middle_name} {user.last_name}</td>
                  <td className={styles.tableCell}>{user.status}</td>
                  <td className={styles.tableCell}>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className={`${styles.tableCell} ${styles.tableActions}`}>
                    <button onClick={() => handleUserClick(user.id)}>View</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className={styles.pagination}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Applications;
