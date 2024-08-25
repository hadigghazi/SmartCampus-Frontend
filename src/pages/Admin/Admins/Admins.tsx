import React, { useState } from 'react';
import { useGetAdminsWithUserDetailsQuery, useDeleteAdminMutation } from '../../../features/api/adminsApi';
import { useNavigate } from 'react-router-dom';
import styles from '../Instructors/Instructors.module.css';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

type Admin = {
  id: number;
  user_id: number;
  admin_type: 'Super Admin' | 'Admin';
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Admins: React.FC = () => {
  const { data: admins, isLoading, error } = useGetAdminsWithUserDetailsQuery({});
  const [deleteAdmin] = useDeleteAdminMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching admins:', error);
    return <p>Something went wrong!</p>;
  }

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredAdmins = admins?.filter((admin: Admin) => {
    const fullName = `${admin?.user?.first_name} ${admin?.user?.middle_name || ''} ${admin?.user?.last_name}`.toLowerCase();
    const adminId = admin.id.toString();
    return searchTerms.every(term => {
      return fullName.includes(term) || adminId.includes(term);
    });
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredAdmins?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil((filteredAdmins?.length || 0) / entriesPerPage);

  const handleAdminClick = (adminId: number) => {
    navigate(`/admin/admins/${adminId}`);
  };

  const handleDeleteAdmin = async (adminId: number) => {
    try {
      const isConfirmed = await ConfirmationDialog('Are you sure?', 'You are about to delete this admin!');
      if (isConfirmed) {
        await deleteAdmin(adminId).unwrap();
        toast.success('Admin deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      toast.error('Failed to delete admin.');
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>Admins</h2>
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <EntriesPerPage value={entriesPerPage} onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Full Name', accessor: (admin: Admin) => `${admin?.user?.first_name != undefined? `${admin?.user?.first_name} ${admin?.user?.middle_name} ${admin?.user?.last_name}`: 'N/A'}` },
            { header: 'Admin Type', accessor: 'admin_type' }
          ]}
          data={currentEntries || []}
          actions={(admin: Admin) => (
            <>
              <button onClick={() => handleAdminClick(admin.id)}>View</button>
              <button onClick={() => handleDeleteAdmin(admin.id)}>Delete</button>
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Admins;
