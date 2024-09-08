import React, { useState, useEffect } from 'react';
import {
  useGetDormsQuery,
  useCreateDormMutation,
  useUpdateDormMutation,
  useDeleteDormMutation,
} from '../../../features/api/dormsApi';
import {
  useGetCampusesQuery,
} from '../../../features/api/campusesApi'; 
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import { Dorm } from '../../../features/api/types';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';

const DormsPage: React.FC = () => {
  const { data: dormsList = [], refetch } = useGetDormsQuery();
  const { data: campusesList = [] } = useGetCampusesQuery(); 
  const [createDorm] = useCreateDormMutation();
  const [updateDorm] = useUpdateDormMutation();
  const [deleteDorm] = useDeleteDormMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingDorm, setEditingDorm] = useState<Dorm | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    capacity: '',
    campus_id: 0,
    address: '',
  });

  const [searchText, setSearchText] = useState('');
  const [campusFilter, setCampusFilter] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingDorm) {
      setFormValues({
        name: editingDorm.name,
        description: editingDorm.description,
        capacity: editingDorm.capacity || '',
        available_rooms: editingDorm.available_rooms || '',
        campus_id: editingDorm.campus_id,
        address: editingDorm.address,
      });
    } else {
      setFormValues({
        name: '',
        description: '',
        capacity: '',
        available_rooms: '',
        campus_id: 0,
        address: '',
      });
    }
  }, [editingDorm]);

  const handleAddDorm = () => {
    setEditingDorm(null);
    setShowModal(true);
  };

  const handleEditDorm = (dorm: Dorm) => {
    setEditingDorm(dorm);
    setShowModal(true);
  };

  const handleDeleteDorm = async (id: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteDorm(id).unwrap();
        toast.success('Dorm deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete dorm');
      }
    }
  };

  const handleSaveDorm = async () => {
    try {
      const dormPayload = {
        ...formValues,
        capacity: formValues.capacity ? Number(formValues.capacity) : undefined,
      };

      if (editingDorm) {
        await updateDorm({ id: editingDorm.id, ...dormPayload }).unwrap();
        toast.success('Dorm updated successfully');
      } else {
        await createDorm(dormPayload).unwrap();
        toast.success('Dorm created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to save dorm');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleCampusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCampusFilter(Number(e.target.value) || '');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const filteredDorms = dormsList.filter(dorm => 
    dorm.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (campusFilter === '' || dorm.campus_id === campusFilter)
  );

  const paginatedDorms = filteredDorms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredDorms.length / pageSize);

  const getCampusNameById = (campusId: number) => {
    const campus = campusesList.find(c => c.id === campusId);
    return campus ? campus.name : 'Unknown';
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Campus', accessor: (dorm: Dorm) => getCampusNameById(dorm.campus_id) },
  ];

  const actions = (dorm: Dorm) => (
    <div className={styles.actions}>
      <button style={{ marginRight: '1rem' }} onClick={() => handleEditDorm(dorm)}>Edit</button>
      <button onClick={() => handleDeleteDorm(dorm.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Dorms</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <select value={campusFilter} onChange={handleCampusFilterChange} className={styles.filterSelect}>
            <option value="">Filter by Campus</option>
            {campusesList.map(campus => (
              <option key={campus.id} value={campus.id}>{campus.name}</option>
            ))}
          </select>
          <button onClick={handleAddDorm} className={styles.addButton}>Add Dorm</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
        <Table
          columns={columns}
          data={paginatedDorms}
          actions={actions}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{editingDorm ? 'Edit Dorm' : 'Add Dorm'}</h2>
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
                  />
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    name="capacity"
                    value={formValues.capacity}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Available Rooms:
                  <input
                    type="number"
                    name="available_rooms"
                    value={formValues.available_rooms}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Campus:
                  <select
                    name="campus_id"
                    value={formValues.campus_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Campus</option>
                    {campusesList.map(campus => (
                      <option key={campus.id} value={campus.id}>{campus.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Address:
                  <input
                    type="text"
                    name="address"
                    value={formValues.address}
                    onChange={handleChange}
                  />
                </label>
                <div className={styles.btnContainer}>
                  <button className={styles.rejectBtn} type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className={styles.acceptBtn} type="button" onClick={handleSaveDorm}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastNotifications />
      </div>
    </AdminLayout>
  );
};

export default DormsPage;
