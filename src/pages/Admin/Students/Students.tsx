import React, { useState } from 'react';
import { useGetStudentsWithUserDetailsQuery, useDeleteStudentMutation } from '../../../features/api/studentsApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from './Students.module.css'
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const { data: students, isLoading, error } = useGetStudentsWithUserDetailsQuery({});
  const [deleteStudent] = useDeleteStudentMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredStudents = students?.filter((student: Student) => {
    const fullName = `${student?.user?.first_name} ${student?.user?.middle_name || ''} ${student?.user?.last_name}`.toLowerCase();
    const studentId = student?.id.toString();
    return searchTerms.every(term => {
      return fullName.includes(term) || studentId.includes(term);
    });
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredStudents?.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil((filteredStudents?.length || 0) / entriesPerPage);

  const handleStudentClick = (studentId: number) => {
    navigate(`/admin/students/${studentId}`);
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this student!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff0000',
        cancelButtonColor: '#123962',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteStudent(studentId).unwrap();
        toast.success('Student deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      toast.error('Failed to delete student.');
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>Students</h2>
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <EntriesPerPage value={entriesPerPage} onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
  columns={[
    { header: 'ID', accessor: 'id' },
    { header: 'Full Name', accessor: (student: Student) => `${student?.user?.first_name} ${student?.user?.middle_name || ''} ${student?.user?.last_name}` },
  ]}
  data={currentEntries || []}
  actions={(student: Student) => (
    <>
      <button onClick={() => handleStudentClick(student.id)}>View</button>
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
      <ToastContainer />
    </AdminLayout>
  );
};

export default Students;
