import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
  useGetStudentsWithUserDetailsQuery, 
  useDeleteStudentMutation, 
  useUpdateStudentMutation 
} from '../../../features/api/studentsApi';
import { useNavigate } from 'react-router-dom';
import styles from './Students.module.css';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

type Student = {
  id: number;
  user_id: number;
  government_id: string;
  civil_status_number: string;
  passport_number: string;
  visa_status: string;
  native_language: string;
  secondary_language: string;
  additional_info: string;
  transportation: boolean;
  dorm_residency: boolean;
  user: {
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Students: React.FC = () => {
  const { data: studentsData, isLoading, error } = useGetStudentsWithUserDetailsQuery({});
  const [deleteStudent] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editedStudent, setEditedStudent] = useState({
    government_id: '',
    civil_status_number: '',
    passport_number: '',
    visa_status: '',
    native_language: '',
    secondary_language: '',
    additional_info: '',
    transportation: false,
    dorm_residency: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (studentsData) {
      setStudents(studentsData);
    }
  }, [studentsData]);

  useEffect(() => {
    if (selectedStudent) {
      setEditedStudent({
        government_id: selectedStudent.government_id,
        civil_status_number: selectedStudent.civil_status_number,
        passport_number: selectedStudent.passport_number,
        visa_status: selectedStudent.visa_status,
        native_language: selectedStudent.native_language,
        secondary_language: selectedStudent.secondary_language,
        additional_info: selectedStudent.additional_info,
        transportation: selectedStudent.transportation,
        dorm_residency: selectedStudent.dorm_residency
      });
    }
  }, [selectedStudent]);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching students:', error);
    return <p>Something went wrong!</p>;
  }

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student?.user?.first_name} ${student?.user?.middle_name || ''} ${student?.user?.last_name}`.toLowerCase();
    const studentId = student.id.toString();
    return searchTerms.every(term => fullName.includes(term) || studentId.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredStudents.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);

  const handleStudentClick = (studentId: number) => {
    navigate(`/admin/students/${studentId}`);
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      const isConfirmed = await ConfirmationDialog('Are you sure?', 'You are about to delete this student!');
      if (isConfirmed) {
        await deleteStudent(studentId).unwrap();
        setStudents(students.filter(student => student.id !== studentId));
        toast.success('Student deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Failed to delete student.');
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (selectedStudent) {
      try {
        const updatedData = {
          id: selectedStudent.id,
          government_id: editedStudent.government_id,
          civil_status_number: editedStudent.civil_status_number,
          passport_number: editedStudent.passport_number,
          visa_status: editedStudent.visa_status,
          native_language: editedStudent.native_language,
          secondary_language: editedStudent.secondary_language,
          additional_info: editedStudent.additional_info,
          transportation: editedStudent.transportation,
          dorm_residency: editedStudent.dorm_residency
        };

        await updateStudent(updatedData).unwrap();

        setStudents(
          students.map((student) =>
            student.id === selectedStudent.id
              ? { ...student, ...editedStudent }
              : student
          )
        );
        setIsEditModalOpen(false);
        toast.success('Student updated successfully!');
      } catch (err) {
        console.error('Error updating student:', err);
        toast.error('Failed to update student.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>Students</h2>
        <SearchInput value={searchTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} />
        <EntriesPerPage value={entriesPerPage} onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Full Name', accessor: (student) => `${student.user.first_name} ${student.user.middle_name || ''} ${student.user.last_name}` },
            { header: 'Government ID', accessor: 'government_id' }
          ]}
          data={currentEntries || []}
          actions={(student) => (
            <>
              <button onClick={() => handleStudentClick(student.id)}>View</button>
              <button onClick={() => handleEditStudent(student)}>Edit</button>
              <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
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
            <h2 className={styles.headingPrimary}>Edit Student</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Government ID</label>
                <input
                  type="text"
                  value={editedStudent.government_id}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, government_id: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Civil Status Number</label>
                <input
                  type="text"
                  value={editedStudent.civil_status_number}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, civil_status_number: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Passport Number</label>
                <input
                  type="text"
                  value={editedStudent.passport_number}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, passport_number: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Visa Status</label>
                <input
                  type="text"
                  value={editedStudent.visa_status}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, visa_status: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Native Language</label>
                <input
                  type="text"
                  value={editedStudent.native_language}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, native_language: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Secondary Language</label>
                <input
                  type="text"
                  value={editedStudent.secondary_language}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, secondary_language: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Additional Info</label>
                <textarea
                  value={editedStudent.additional_info}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditedStudent({ ...editedStudent, additional_info: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={editedStudent.transportation}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, transportation: e.target.checked })}
                  />
                  Transportation
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={editedStudent.dorm_residency}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedStudent({ ...editedStudent, dorm_residency: e.target.checked })}
                  />
                  Dorm Residency
                </label>
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="button" onClick={handleSaveEdit}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Students;
