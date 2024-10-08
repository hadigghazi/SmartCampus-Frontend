import React, { useState, useEffect } from 'react';
import {
  useGetImportantDatesQuery,
  useCreateImportantDateMutation,
  useUpdateImportantDateMutation,
  useDeleteImportantDateMutation,
} from '../../../features/api/importantDatesApi';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import { ImportantDate } from '../../../features/api/types';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

const ImportantDatesPage: React.FC = () => {
  const { data: importantDatesList = [], refetch } = useGetImportantDatesQuery();
  const [createImportantDate] = useCreateImportantDateMutation();
  const [updateImportantDate] = useUpdateImportantDateMutation();
  const [deleteImportantDate] = useDeleteImportantDateMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    date: '',
    end_date: '',
    type: '',
  });

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingDate) {
      setFormValues({
        title: editingDate.title,
        description: editingDate.description || '',
        date: editingDate.date,
        end_date: editingDate.end_date || '',
        type: editingDate.type,
      });
    } else {
      setFormValues({
        title: '',
        description: '',
        date: '',
        end_date: '',
        type: '',
      });
    }
  }, [editingDate]);

  const handleAddDate = () => {
    setEditingDate(null);
    setShowModal(true);
  };

  const handleEditDate = (date: ImportantDate) => {
    setEditingDate(date);
    setShowModal(true);
  };

  const handleDeleteDate = async (id: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    refetch();
    if (isConfirmed) {
      try {
        await deleteImportantDate(id).unwrap();
        toast.success('Date deleted successfully');
      } catch (error) {
        console.error('Failed to delete date:', error);
        toast.error('Failed to delete date');
      }
    }
  };

  const handleSaveDate = async () => {
    try {
      const datePayload = {
        ...formValues,
        date: new Date(formValues.date).toISOString().split('T')[0],
        end_date: formValues.end_date ? new Date(formValues.end_date).toISOString().split('T')[0] : null,
      };

      if (editingDate) {
        await updateImportantDate({ id: editingDate.id, ...datePayload }).unwrap();
        toast.success('Date updated successfully');
      } else {
        await createImportantDate(datePayload).unwrap();
        toast.success('Date created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to save date:', error);
      toast.error('Failed to save date');
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
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const filteredDates = importantDatesList.filter(d =>
    d.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedDates = filteredDates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredDates.length / pageSize);

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Date', accessor: 'date' },
    { header: 'End Date', accessor: 'end_date' },
    { header: 'Type', accessor: 'type' },
  ];

  const actions = (date: ImportantDate) => (
    <div className={styles.actions}>
      <button style={{ marginRight: '1rem' }} onClick={() => handleEditDate(date)}>Edit</button>
      <button onClick={() => handleDeleteDate(date.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Important Dates</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <button onClick={handleAddDate} className={styles.addButton}>Add Date</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
          <Table
            columns={columns}
            data={paginatedDates}
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
              <h2 className={styles.headingSecondary}>{editingDate ? 'Edit Date' : 'Add Date'}</h2>
              <form className={styles.form}>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={formValues.description || ''}
                    onChange={handleChange}
                    rows={4}
                  />
                </label>
                <label>
                  Date:
                  <input
                    type="date"
                    name="date"
                    value={formValues.date}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  End Date:
                  <input
                    type="date"
                    name="end_date"
                    value={formValues.end_date || ''}
                    onChange={handleChange}
                  />
                </label>
                <label>
                 Type:
                       <select
                           name="type"
                           value={formValues.type}
                           onChange={handleChange}
                            required
                            >
                      <option value="">Select Type</option>
                        <option value="Deadline">Deadline</option>
                          <option value="Event">Event</option>
                            <option value="Other">Other</option>
                              <option value="Holiday">Holiday</option>
                        </select>
                </label>
                <div className={styles.btnContainer}>
                  <button type="button" className={styles.acceptBtn} onClick={handleSaveDate}>
                    Save
                  </button>
                  <button type="button" className={styles.rejectBtn} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
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

export default ImportantDatesPage;
