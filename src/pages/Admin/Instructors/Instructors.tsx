import React, { useState } from 'react';
import { useGetInstructorsWithUserDetailsQuery, useDeleteInstructorMutation } from '../../../features/api/instructorsApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from './Instructors.module.css';

type Instructor = {
  id: number;
  user_id: number;
  department_id: number;
  specialization: string;
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

const Instructors: React.FC = () => {
  const { data: instructors, isLoading, error } = useGetInstructorsWithUserDetailsQuery({});
  const [deleteInstructor] = useDeleteInstructorMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

  const filteredInstructors = instructors?.filter((instructor: Instructor) => {
    const fullName = `${instructor?.user?.first_name} ${instructor?.user?.middle_name} ${instructor?.user?.last_name}`.toLowerCase();
    
    const instructorId = instructor.id.toString();
    
    return searchTerms.every(term => {
      const lowerCaseTerm = term.toLowerCase();
      return fullName.includes(lowerCaseTerm) || instructorId.includes(lowerCaseTerm);
    });
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredInstructors?.slice(indexOfFirstEntry, indexOfFirstEntry + entriesPerPage);

  const totalPages = Math.ceil((filteredInstructors?.length || 0) / entriesPerPage);

  const handleInstructorClick = (instructorId: number) => {
    navigate(`/admin/instructors/${instructorId}`);
  };

  const handleDeleteInstructor = async (instructorId: number) => {
    try {
      await deleteInstructor(instructorId).unwrap();
      alert('Instructor deleted successfully!');
    } catch (err) {
      console.error('Error deleting instructor:', err);
      alert('Failed to delete instructor.');
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
        <h2 className={styles.headingPrimary}>Instructors</h2>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or ID"
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
                <th className={styles.tableHeader}>Specialization</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries?.map((instructor: Instructor) => (
                <tr key={instructor.id}>
                  <td className={styles.tableCell}>{instructor?.id}</td>
                  <td className={styles.tableCell}>{instructor?.user?.first_name} {instructor?.user?.middle_name} {instructor?.user?.last_name}</td>
                  <td className={styles.tableCell}>{instructor?.specialization}</td>
                  <td className={`${styles.tableCell} ${styles.tableActions}`}>
                    <button onClick={() => handleInstructorClick(instructor.id)}>View</button>
                    <button onClick={() => handleDeleteInstructor(instructor.id)}>Delete</button>
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

export default Instructors;
