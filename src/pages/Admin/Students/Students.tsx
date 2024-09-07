import React, { useState, useEffect, ChangeEvent } from 'react';
import { useGetStudentsWithUserDetailsQuery, useDeleteStudentMutation, useUpdateStudentMutation } from '../../../features/api/studentsApi';
import { useGetMajorsQuery } from '../../../features/api/majorsApi'; // Import the majors query
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from './Students.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';
import Spinner from '../../../components/Spinner/Spinner';

type Student = {
  id: number;
  user_id: number;
  government_id: string;
  civil_status_number: string;
  passport_number: string;
  visa_status: string;
  native_language: string;
  secondary_language: string;
  current_semester_id: number;
  additional_info: string;
  transportation: number;
  dorm_residency: number;
  emergency_contact_id: number;
  major_id?: number; // Add major_id to student type
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: {
    id: number;
    first_name: string;
    middle_name: string;
    last_name: string;
  };
};

const Students: React.FC = () => {
  const { data: studentsData, isLoading, error } = useGetStudentsWithUserDetailsQuery({});
  const { data: majorsData } = useGetMajorsQuery(); // Fetch majors
  const [deleteStudent] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editedStudent, setEditedStudent] = useState({
    civil_status_number: '',
    visa_status: '',
    native_language: '',
    secondary_language: '',
    additional_info: '',
    transportation: 0,
    dorm_residency: 0,
    emergency_contact_id: 0,
    major_id: undefined,
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
        civil_status_number: selectedStudent.civil_status_number,
        visa_status: selectedStudent.visa_status,
        native_language: selectedStudent.native_language,
        secondary_language: selectedStudent.secondary_language,
        additional_info: selectedStudent.additional_info,
        transportation: selectedStudent.transportation,
        dorm_residency: selectedStudent.dorm_residency,
        emergency_contact_id: selectedStudent.emergency_contact_id,
        major_id: selectedStudent.major_id, 
      });
    }
  }, [selectedStudent]);

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
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
          ...editedStudent,
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
            { header: 'Full Name', accessor: (student) => `${student?.user?.first_name} ${student?.user?.middle_name || ''} ${student?.user?.last_name}` },
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
                <label>Civil Status Number</label>
                <input
                  type="text"
                  value={editedStudent.civil_status_number}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, civil_status_number: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Visa Status</label>
                <input
                  type="text"
                  value={editedStudent.visa_status}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, visa_status: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Native Language</label>
                <input
                  type="text"
                  value={editedStudent.native_language}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, native_language: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Secondary Language</label>
                <input
                  type="text"
                  value={editedStudent.secondary_language}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, secondary_language: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Additional Information</label>
                <textarea
                  value={editedStudent.additional_info}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setEditedStudent({ ...editedStudent, additional_info: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Transportation</label>
                <input
                  type="number"
                  value={editedStudent.transportation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, transportation: Number(e.target.value) })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Dorm Residency</label>
                <input
                  type="number"
                  value={editedStudent.dorm_residency}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, dorm_residency: Number(e.target.value) })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Emergency Contact ID</label>
                <input
                  type="number"
                  value={editedStudent.emergency_contact_id}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEditedStudent({ ...editedStudent, emergency_contact_id: Number(e.target.value) })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Major</label>
                <select
                  value={editedStudent.major_id || ''}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setEditedStudent({ ...editedStudent, major_id: Number(e.target.value) })
                  }
                >
                  <option value="">Select Major</option>
                  {majorsData && majorsData.map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
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
