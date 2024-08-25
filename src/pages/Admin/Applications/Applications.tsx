import React, { useState } from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../../features/api/usersApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import Table from '../../../components/Table/Table';
import styles from './Applications.module.css';
import { toast } from 'react-toastify';

interface ApplicationsProps {
  role: string;
}

const Applications: React.FC<ApplicationsProps> = ({ role }) => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest'); // Sorting state
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  // Filter users based on search terms, role, status, and date range
  const filteredUsers = users?.filter((user) => {
    const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
    const userIdString = user.id.toString();

    const matchesSearchTerm = searchTerms.every(term =>
      fullName.includes(term) || userIdString.includes(term)
    );

    const matchesRole = user.role === role;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesDateRange = (!startDate || new Date(user.created_at!) >= new Date(startDate)) &&
      (!endDate || new Date(user.created_at!) <= new Date(endDate));

    return matchesSearchTerm && matchesRole && matchesStatus && matchesDateRange;
  });

  // Apply sorting based on the selected sort order
  const sortedUsers = filteredUsers?.sort((a, b) => {
    const dateA = new Date(a.created_at!);
    const dateB = new Date(b.created_at!);
    return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedUsers?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil((sortedUsers?.length || 0) / entriesPerPage);

  const handleUserClick = (userId: number) => {
    navigate(`/admin/applications/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    const isConfirmed = await ConfirmationDialog(
      'Are you sure?',
      'You won\'t be able to revert this!'
    );

    if (isConfirmed) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error('Failed to delete user.');
      }
    }
  };

  const resetDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>{role} Applications</h2>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          <button onClick={resetDateRange} className={styles.resetButton}>
            Reset Dates
          </button>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            className={styles.selectField}
          >
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
          </select>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Name', accessor: (user) => `${user.first_name} ${user.middle_name} ${user.last_name}` },
            { header: 'Status', accessor: 'status' },
            { header: 'Date', accessor: (user) => user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
          ]}
          data={currentEntries || []}
          actions={(user) => (
            <>
              <button onClick={() => handleUserClick(user.id)}>View</button>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      </div>
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Applications;
