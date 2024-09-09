import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  useGetInstructorsWithUserDetailsQuery, 
  useDeleteInstructorMutation, 
  useUpdateInstructorMutation
} from '../../../features/api/instructorsApi';
import { useGetDepartmentsQuery } from '../../../features/api/departmentsApi';
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
import Spinner from '../../../components/Spinner/Spinner';

type Instructor = {
  id: number;
  user_id: number;
  specialization: string;
  department_id: number;
  salary: number;
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Instructors: React.FC = () => {
  const { data: instructorsData, isLoading, error, refetch } = useGetInstructorsWithUserDetailsQuery({});
  const { data: departments } = useGetDepartmentsQuery({});
  const [deleteInstructor] = useDeleteInstructorMutation();
  const [updateInstructor] = useUpdateInstructorMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [editedInstructor, setEditedInstructor] = useState({ department_id: 0, specialization: '', salary: 0 }); 
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedInstructor) {
      setEditedInstructor({
        department_id: selectedInstructor.department_id,
        specialization: selectedInstructor.specialization,
        salary: selectedInstructor.salary 
      });
    }
  }, [selectedInstructor]);

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (error) {
    console.error('Error fetching instructors:', error);
    return <p>Something went wrong!</p>;
  }

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredInstructors = instructorsData?.filter((instructor: Instructor) => {
    const fullName = `${instructor.user.first_name} ${instructor.user.middle_name || ''} ${instructor.user.last_name}`.toLowerCase();
    const instructorId = instructor.id.toString();
    return searchTerms.every(term => fullName.includes(term) || instructorId.includes(term));
  }) || [];

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredInstructors.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredInstructors.length / entriesPerPage);

  const handleInstructorClick = (instructorId: number) => {
    navigate(`/admin/instructors/${instructorId}`);
  };

  const handleDeleteInstructor = async (instructorId: number) => {
    try {
      const isConfirmed = await ConfirmationDialog('Are you sure?', 'You are about to delete this instructor!');
      if (isConfirmed) {
        await deleteInstructor(instructorId).unwrap();
        refetch(); 
        toast.success('Instructor deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting instructor:', err);
      toast.error('Failed to delete instructor.');
    }
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedInstructor) {
      try {
        const updatedData = {
          id: selectedInstructor.id,
          department_id: editedInstructor.department_id,
          specialization: editedInstructor.specialization,
          salary: editedInstructor.salary
        };
  
        await updateInstructor(updatedData).unwrap();
        refetch(); 
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
        <SearchInput value={searchTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
        <EntriesPerPage value={entriesPerPage} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Full Name', accessor: (instructor) => `${instructor.user.first_name} ${instructor.user.middle_name || ''} ${instructor.user.last_name}` },
            { header: 'Specialization', accessor: 'specialization' },
            { header: 'Salary', accessor: 'salary' } 
          ]}
          data={currentEntries || []}
          actions={(instructor) => (
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
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>Edit Instructor</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Department</label>
                <select
                  value={editedInstructor.department_id}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditedInstructor({ ...editedInstructor, department_id: Number(e.target.value) })}
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedInstructor({ ...editedInstructor, specialization: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Salary</label>
                <input
                  type="number"
                  value={editedInstructor.salary}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedInstructor({ ...editedInstructor, salary: Number(e.target.value) })}
                />
              </div>
              <div className={styles.btnContainer} style={{ marginTop: "1rem" }}>
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

export default Instructors;
