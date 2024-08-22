import React, { useState } from 'react';
import { useGetInstructorsWithUserDetailsQuery, useDeleteInstructorMutation } from '../../../features/api/instructorsApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import { toast } from 'react-toastify';

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

  const filteredInstructors = instructors?.filter((instructor) => {
    const fullName = `${instructor.user.first_name} ${instructor.user.middle_name} ${instructor.user.last_name}`.toLowerCase();
    const instructorId = instructor.id.toString();
    return searchTerms.every(term => fullName.includes(term) || instructorId.includes(term));
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
      const isConfirmed = await ConfirmationDialog('Are you sure?', 'You are about to delete this instructor!');
      if (isConfirmed) {
        await deleteInstructor(instructorId).unwrap();
        toast.success('Instructor deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting instructor:', err);
      toast.error('Failed to delete instructor.');
    }
  };

  return (
    <AdminLayout>
      <div className="container">
        <h2 className="headingPrimary">Instructors</h2>
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <EntriesPerPage value={entriesPerPage} onChange={(e) => {
          setEntriesPerPage(Number(e.target.value));
          setCurrentPage(1);
        }} />
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Full Name', accessor: 'user.full_name' },
            { header: 'Specialization', accessor: 'specialization' }
          ]}
          data={currentEntries || []}
          actions={(instructor) => (
            <>
              <button onClick={() => handleInstructorClick(instructor.id)}>View</button>
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
      <ToastNotifications />
    </AdminLayout>
  );
};

export default Instructors;
