import React, { useState, useEffect } from 'react';
import { 
  useGetInstructorsWithUserDetailsQuery, 
  useDeleteInstructorMutation, 
  useUpdateInstructorMutation
} from '../../../features/api/instructorsApi';
import { useGetDepartmentsQuery } from '../../../features/api/departmentsApi';
import { useNavigate } from 'react-router-dom';
import styles from './Instructors.module.css';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

type Instructor = {
  id: number;
  user_id: number;
  specialization: string;
  department_id: number;
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Instructors: React.FC = () => {
  const { data: instructorsData, isLoading, error } = useGetInstructorsWithUserDetailsQuery({});
  const { data: departments } = useGetDepartmentsQuery({});
  const [deleteInstructor] = useDeleteInstructorMutation();
  const [updateInstructor] = useUpdateInstructorMutation(); 
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [editedInstructor, setEditedInstructor] = useState({ department_id: 0, specialization: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (instructorsData) {
      setInstructors(instructorsData);
    }
  }, [instructorsData]);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching instructors:', error);
    return <p>Something went wrong!</p>;
  }

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredInstructors = instructors?.filter((instructor: Instructor) => {
    const fullName = `${instructor?.user?.first_name} ${instructor?.user?.middle_name || ''} ${instructor?.user?.last_name}`.toLowerCase();
    const instructorId = instructor.id.toString();
    return searchTerms.every(term => {
      return fullName.includes(term) || instructorId.includes(term);
    });
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredInstructors?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil((filteredInstructors?.length || 0) / entriesPerPage);

  const handleInstructorClick = (instructorId: number) => {
    navigate(`/admin/instructors/${instructorId}`);
  };

  const handleDeleteInstructor = async (instructorId: number) => {
    try {
      const isConfirmed = await ConfirmationDialog('Are you sure?', 'You are about to delete this instructor!');
      if (isConfirmed) {
        await deleteInstructor(instructorId).unwrap();
        setInstructors(instructors.filter(instructor => instructor.id !== instructorId));
        toast.success('Instructor deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting instructor:', err);
      toast.error('Failed to delete instructor.');
    }
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setEditedInstructor({ department_id: instructor.department_id, specialization: instructor.specialization });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedInstructor) {
      try {
        const updatedData = {
          id: selectedInstructor.id,
          department_id: editedInstructor.department_id,
          specialization: editedInstructor.specialization,
        };
  
        console.log('Updating instructor with URL:', `/instructors/${updatedData.id}`);
  
        await updateInstructor(updatedData).unwrap();
  
        setInstructors(
          instructors.map((instructor) =>
            instructor.id === selectedInstructor.id
              ? { ...instructor, ...editedInstructor }
              : instructor
          )
        );
        setIsEditModalOpen(false);
        toast.success('Instructor updated successfully!');
      } catch (err) {
        console.error('Error updating instructor:', err);
        toast.error('Failed to update instructor.');
      }
    }
  };
  

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>Instructors</h2>
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <EntriesPerPage value={entriesPerPage} onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Full Name', accessor: (instructor: Instructor) => `${instructor?.user?.first_name} ${instructor?.user?.middle_name || ''} ${instructor?.user?.last_name}` },
            { header: 'Specialization', accessor: 'specialization' }
          ]}
          data={currentEntries || []}
          actions={(instructor: Instructor) => (
            <>
              <button onClick={() => handleInstructorClick(instructor.id)}>View</button>
              <button onClick={() => handleEditInstructor(instructor)}>Edit</button>
              <button onClick={() => handleDeleteInstructor(instructor.id)}>Delete</button>
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
          <div className={styles.modal}>
            <h2>Edit Instructor</h2>
            <div className={styles.formGroup}>
              <label>Department</label>
              <select
                value={editedInstructor.department_id}
                onChange={(e) => setEditedInstructor({ ...editedInstructor, department_id: Number(e.target.value) })}
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
              <label>Specialization</label>
              <input
                type="text"
                value={editedInstructor.specialization}
                onChange={(e) => setEditedInstructor({ ...editedInstructor, specialization: e.target.value })}
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastNotifications />
    </AdminLayout>
  );
};

export default Instructors;
