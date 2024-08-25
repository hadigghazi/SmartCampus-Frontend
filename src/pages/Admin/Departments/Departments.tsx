import React, { useState, useEffect } from 'react';
import {
  useGetDepartmentsQuery,
  useDeleteDepartmentMutation,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from '../../../features/api/departmentsApi';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import styles from '../Announcements/Announcements.module.css'; 
import AdminLayout from '../AdminLayout';
import { Department } from '../../../features/api/types';

const Departments: React.FC = () => {
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [deleteDepartment] = useDeleteDepartmentMutation();
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
  });

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingDepartment) {
      setFormValues({
        name: editingDepartment.name,
        description: editingDepartment.description,
      });
    } else {
      setFormValues({
        name: '',
        description: '',
      });
    }
  }, [editingDepartment]);

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department);
    setShowModal(true);
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await deleteDepartment(id).unwrap();
      console.log('Department deleted successfully');
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const handleSaveDepartment = async () => {
    try {
      if (editingDepartment) {
        await updateDepartment({
          ...editingDepartment,
          ...formValues,
          updated_at: new Date().toISOString(),
        }).unwrap();
        console.log('Department updated successfully');
      } else {
        await createDepartment({
          ...formValues,
          created_at: new Date().toISOString(),
        }).unwrap();
        console.log('Department created successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredDepartments.length / pageSize);

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
  ];

  const actions = (department: Department) => (
    <div className={styles.actions}>
      <button onClick={() => handleEditDepartment(department)}>Edit</button>
      <button onClick={() => handleDeleteDepartment(department.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Departments</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <button onClick={handleAddDepartment} className={styles.addButton}>
            Add Department
          </button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
        <div className={styles.wrapper}>
          <Table columns={columns} data={paginatedDepartments} actions={actions} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>{editingDepartment ? 'Edit Department' : 'Add Department'}</h2>
              <form className={styles.form}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </label>
                <div>
                  <button type="button" className={styles.addButton} onClick={handleSaveDepartment}>
                    Save
                  </button>
                  <button type="button" className={styles.addButton} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Departments;
