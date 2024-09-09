import React, { ChangeEvent, useEffect, useState } from 'react';
import { useGetAdminsWithUserDetailsQuery, useDeleteAdminMutation, useUpdateAdminMutation } from '../../../features/api/adminsApi';
import { useNavigate } from 'react-router-dom';
import styles from '../Courses/Courses.module.css';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';
import { useGetDepartmentsQuery } from '../../../features/api/departmentsApi';
import Spinner from '../../../components/Spinner/Spinner';

type Admin = {
  id: number;
  user_id: number;
  department_id: number;
  admin_type: 'Super Admin' | 'Admin';
  salary: number; 
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Admins: React.FC = () => {
    const { data: adminsData, isLoading, error, refetch } = useGetAdminsWithUserDetailsQuery({});
    const { data: departments } = useGetDepartmentsQuery({});
    const [deleteAdmin] = useDeleteAdminMutation();
    const [updateAdmin] = useUpdateAdminMutation();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(20);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [editedAdmin, setEditedAdmin] = useState({ department_id: 0, admin_type: 'Admin', salary: 0 }); 

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedAdmin) {
            setEditedAdmin({
                department_id: selectedAdmin.department_id,
                admin_type: selectedAdmin.admin_type,
                salary: selectedAdmin.salary, 
            });
        }
    }, [selectedAdmin]);

    if (isLoading) return (<AdminLayout><Spinner /></AdminLayout>);
    if (error) {
        console.error('Error fetching admins:', error);
        return <p>Something went wrong!</p>;
    }

    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

    const filteredAdmins = adminsData?.filter((admin: Admin) => {
        const fullName = `${admin?.user?.first_name} ${admin?.user?.middle_name || ''} ${admin?.user?.last_name}`.toLowerCase();
        const adminId = admin.id.toString();
        return searchTerms.every(term => fullName.includes(term) || adminId.includes(term));
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
                refetch(); 
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
                    salary: editedAdmin.salary,
                };

                await updateAdmin(updatedData).unwrap();
                toast.success('Admin updated successfully!');
                setIsEditModalOpen(false);
                refetch(); 
            } catch (err) {
                console.error('Error updating admin:', err);
                toast.error('Failed to update admin.');
            }
        }
    };

    return (
        <AdminLayout requiredAdminType='Super Admin'>
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
                        { header: 'Full Name', accessor: (admin: Admin) => `${admin?.user?.first_name} ${admin?.user?.middle_name} ${admin?.user?.last_name}` },
                        { header: 'Admin Type', accessor: 'admin_type' },
                        { header: 'Salary', accessor: 'salary' } 
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
                        <h2 className={styles.headingSecondary}>Edit Admin</h2>
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
                            <div className={styles.formGroup}>
                                <label>Salary</label>
                                <input
                                    type="number"
                                    value={editedAdmin.salary}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedAdmin({ ...editedAdmin, salary: Number(e.target.value) })}
                                />
                            </div>
                            <div className={styles.btnContainer} style={{ marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className={styles.rejectBtn}>Cancel</button>
                                <button type="button" onClick={handleSaveEdit} className={styles.acceptBtn}>Save</button>
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
