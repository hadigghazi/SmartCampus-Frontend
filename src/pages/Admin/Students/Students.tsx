import React, { useState } from 'react';
import { useGetStudentsWithUserDetailsQuery, useDeleteStudentMutation } from '../../../features/api/studentsApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from './Students.module.css';

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
}

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
    const fullName = `${student?.user?.first_name} ${student?.user?.middle_name} ${student?.user?.last_name}`.toLowerCase();
    return searchTerms.every(term => fullName.includes(term));
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredStudents?.slice(indexOfFirstEntry, indexOfFirstEntry + entriesPerPage);

  const totalPages = Math.ceil((filteredStudents?.length || 0) / entriesPerPage);

  const handleStudentClick = (studentId: number) => {
    navigate(`/admin/students/${studentId}`);
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      await deleteStudent(studentId).unwrap();
      alert('Student deleted successfully!');
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('Failed to delete student.');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2 className={styles.headingPrimary}>Students</h2>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.paginationControls}>
          <label htmlFor="entriesPerPage">Entries per page:</label>
          <select 
            id="entriesPerPage"
            value={entriesPerPage}
            onChange={handleEntriesPerPageChange}
            className={styles.selectField}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th className={styles.tableHeader}>Full Name</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries?.map((student: Student) => (
                <tr key={student.id}>
                  <td className={styles.tableCell}>{student?.id}</td>
                  <td className={styles.tableCell}>{student?.user?.first_name} {student?.user?.middle_name} {student?.user?.last_name}</td>
                  <td className={`${styles.tableCell} ${styles.tableActions}`}>
                    <button onClick={() => handleStudentClick(student.id)}>View</button>
                    <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Students;
