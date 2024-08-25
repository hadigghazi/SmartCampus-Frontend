import React, { useState, useEffect } from 'react';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../../features/api/usersApi';
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
import { User } from '../../../features/api/types';

interface ApplicationsProps {
  role: string;
}

const Applications: React.FC<ApplicationsProps> = ({ role }) => {
  const { data: initialUsers, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialUsers) {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredUsers = users.filter((user) => {
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

  const sortedUsers = filteredUsers.sort((a, b) => {
    const dateA = new Date(a.created_at!);
    const dateB = new Date(b.created_at!);
    return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedUsers.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(sortedUsers.length / entriesPerPage);

  const handleUserClick = (userId: number) => {
    navigate(`/admin/applications/${role.toLowerCase()}s/${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    const isConfirmed = await ConfirmationDialog(
      'Are you sure?',
      'You won\'t be able to revert this!'
    );

    if (isConfirmed) {
      try {
        await deleteUser(userId).unwrap();
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
        toast.error('Failed to delete user.');
      }
    }
  };

  const handleEditUser = async () => {
    if (selectedUser) {
      try {
        await updateUser(selectedUser).unwrap();
        setUsers(users.map(user => user.id === selectedUser.id ? selectedUser : user));
        toast.success('User updated successfully!');
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error updating user:', err);
        toast.error('Failed to update user.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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
              <button onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}>Edit</button>
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
      {isModalOpen && selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>Edit User</h2>
            <form className={styles.form}>
              <input
                type="text"
                name="first_name"
                value={selectedUser.first_name}
                onChange={(e) => setSelectedUser({ ...selectedUser, first_name: e.target.value })}
                placeholder="First Name"
              />
              <input
                type="text"
                name="middle_name"
                value={selectedUser.middle_name}
                onChange={(e) => setSelectedUser({ ...selectedUser, middle_name: e.target.value })}
                placeholder="Middle Name"
              />
              <input
                type="text"
                name="last_name"
                value={selectedUser.last_name}
                onChange={(e) => setSelectedUser({ ...selectedUser, last_name: e.target.value })}
                placeholder="Last Name"
              />
              <input
                type="text"
                name="mother_full_name"
                value={selectedUser.mother_full_name}
                onChange={(e) => setSelectedUser({ ...selectedUser, mother_full_name: e.target.value })}
                placeholder="Mother's Full Name"
              />
              <input
                type="email"
                name="email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone_number"
                value={selectedUser.phone_number}
                onChange={(e) => setSelectedUser({ ...selectedUser, phone_number: e.target.value })}
                placeholder="Phone Number"
              />
              <select
                name="role"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
                <option value="Instructor">Instructor</option>
              </select>
              <input
                type="date"
                name="date_of_birth"
                value={selectedUser.date_of_birth?.substring(0, 10)}
                onChange={(e) => setSelectedUser({ ...selectedUser, date_of_birth: e.target.value })}
              />
              <input
                type="text"
                name="nationality"
                value={selectedUser.nationality}
                onChange={(e) => setSelectedUser({ ...selectedUser, nationality: e.target.value })}
                placeholder="Nationality"
              />
              <input
                type="text"
                name="second_nationality"
                value={selectedUser.second_nationality}
                onChange={(e) => setSelectedUser({ ...selectedUser, second_nationality: e.target.value })}
                placeholder="Second Nationality"
              />
              <input
                type="text"
                name="country_of_birth"
                value={selectedUser.country_of_birth}
                onChange={(e) => setSelectedUser({ ...selectedUser, country_of_birth: e.target.value })}
                placeholder="Country of Birth"
              />
              <select
                name="gender"
                value={selectedUser.gender}
                onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                name="marital_status"
                value={selectedUser.marital_status}
                onChange={(e) => setSelectedUser({ ...selectedUser, marital_status: e.target.value })}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              <input
                type="text"
                name="profile_picture"
                value={selectedUser.profile_picture}
                onChange={(e) => setSelectedUser({ ...selectedUser, profile_picture: e.target.value })}
                placeholder="Profile Picture URL"
              />
              <div className={styles.btnContainer}>
              <button type="button" onClick={handleEditUser} className={styles.acceptBtn}>
                Save
              </button>
              <button type="button" onClick={handleModalClose} className={styles.rejectBtn}>
                Cancel
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Applications;
