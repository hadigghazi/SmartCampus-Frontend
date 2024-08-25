import React, { ChangeEvent, useEffect, useState } from 'react';
import { useGetAdminsWithUserDetailsQuery, useDeleteAdminMutation, useUpdateAdminMutation } from '../../../features/api/adminsApi';
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
import { useGetDepartmentsQuery } from '../../../features/api/departmentsApi';

type Admin = {
  id: number;
  user_id: number;
  department_id: number;
  admin_type: 'Super Admin' | 'Admin';
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Admins: React.FC = () => {
    const { data: adminsData, isLoading, error } = useGetAdminsWithUserDetailsQuery({});
    const { data: departments } = useGetDepartmentsQuery({});
    const [deleteAdmin] = useDeleteAdminMutation();
    const [updateAdmin] = useUpdateAdminMutation();
    const [admins, setAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editedAdmin, setEditedAdmin] = useState({ department_id: 0, admin_type: 'Admin' });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (adminsData) {
      setAdmins(adminsData);
    }
  }, [adminsData]);

  useEffect(() => {
    if (selectedAdmin) {
      setEditedAdmin({
        department_id: selectedAdmin.department_id,
        admin_type: selectedAdmin.admin_type
      });
    }
  }, [selectedAdmin]);

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
        setAdmins(admins.filter(admin => admin.id !== adminId));
        toast.success('Admin deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting admin:', err);
      toast.error('Failed to delete admin.');
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedAdmin) {
      try {
        const updatedData = {
          id: selectedAdmin.id,
          department_id: editedAdmin.department_id,
          admin_type: editedAdmin.admin_type,
        };
  
        await updateAdmin(updatedData).unwrap();
  
        setAdmins(
          admins.map((admin) =>
            admin.id === selectedAdmin.id
              ? { ...admin, ...editedAdmin }
              : admin
          )
        );
        setIsEditModalOpen(false);
        toast.success('Admin updated successfully!');
      } catch (err) {
        console.error('Error updating admin:', err);
        toast.error('Failed to update admin.');
      }
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
              <button onClick={() => handleEditAdmin(admin)}>Edit</button>
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
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingPrimary}>Edit Admin</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Department</label>
                <select
                  value={editedAdmin.department_id}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditedAdmin({ ...editedAdmin, department_id: Number(e.target.value) })}
                >
                  <option value="" disabled>Select Department</option>
                  {departments?.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Admin Type</label>
                <select
                                    value={editedAdmin.admin_type}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditedAdmin({ ...editedAdmin, admin_type: e.target.value as 'Super Admin' | 'Admin' })}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={handleSaveEdit} className={styles.acceptBtn}>Save</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className={styles.rejectBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastNotifications />
    </AdminLayout>
  );
};

export default Admins;
