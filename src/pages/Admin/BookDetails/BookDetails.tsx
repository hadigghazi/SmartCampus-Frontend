import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLibraryBookByIdQuery } from '../../../features/api/libraryBooksApi';
import { useGetCampusByIdQuery } from '../../../features/api/campusesApi';
import { useGetBorrowRequestsByBookIdQuery, useUpdateBorrowRequestStatusMutation, useDeleteBorrowRequestMutation } from '../../../features/api/borrowRequestsApi';
import { useGetStudentsWithUserDetailsQuery } from '../../../features/api/studentsApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import styles from '../CourseDetails/CourseDetails.module.css';

const BookDetails: React.FC = () => {
  const { id: bookId } = useParams<{ id: string }>();
  const { data: book, isLoading: bookLoading, error: bookError } = useGetLibraryBookByIdQuery(Number(bookId));
  const campusId = book?.campus_id;
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(campusId, {
    skip: !campusId,
  });

  const { data: initialBorrowRequests, isLoading: borrowRequestsLoading, error: borrowRequestsError } = useGetBorrowRequestsByBookIdQuery(Number(bookId));
  const [borrowRequests, setBorrowRequests] = useState(initialBorrowRequests || []);
  const [updateStatus] = useUpdateBorrowRequestStatusMutation();
  const [deleteRequest] = useDeleteBorrowRequestMutation();
  const { data: students, isLoading: studentsLoading, error: studentsError } = useGetStudentsWithUserDetailsQuery();

  useEffect(() => {
    if (initialBorrowRequests) {
      setBorrowRequests(initialBorrowRequests);
    }
  }, [initialBorrowRequests]);

  const handleStatusChange = (requestId: number, status: string) => {
    const originalRequests = [...borrowRequests];

    setBorrowRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );

    updateStatus({ id: requestId, status })
      .unwrap()
      .catch(error => {
        console.error('Failed to update status:', error);
        setBorrowRequests(originalRequests);
      });
  };

  const handleDeleteRequest = (requestId: number) => {
    const originalRequests = [...borrowRequests];

    setBorrowRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== requestId)
    );

    deleteRequest(requestId)
      .unwrap()
      .catch(error => {
        console.error('Failed to delete request:', error);
        setBorrowRequests(originalRequests);
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  const columns = [
    { header: 'Student ID', accessor: 'student_id' },
    { 
      header: 'Student Name', 
      accessor: (item: any) => {
        const student = students?.find((s: any) => s.id === item.student_id);
        return student ? `${student.user.first_name} ${student.user.middle_name} ${student.user.last_name}` : 'Unknown';
      }
    },
    { header: 'Request Date', accessor: (item: any) => formatDate(item.created_at) },
    { header: 'Due Date', accessor: (item: any) => formatDate(item.due_date) },
    { header: 'Status', accessor: 'status' },
  ];

  if (bookLoading || campusLoading || borrowRequestsLoading || studentsLoading) return <p>Loading...</p>;
  if (bookError || campusError || borrowRequestsError || studentsError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      {book && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{book.title}</h1>
          <p className={styles.headingSecondary}>{book.author}</p>
          <p className={styles.text}>ISBN: {book.isbn}</p>
          <p className={styles.text}>Publication Year: {book.publication_year}</p>
          {campus && <p className={styles.text}>Campus: {campus.name}</p>}
          <p className={styles.text}>Copies: {book.copies}</p>
          <p className={styles.text}>Pages: {book.pages}</p>
          <p className={styles.text}>Description: {book.description}</p>

          <h2 className={styles.headingSecondary}>Borrow Requests</h2>
          {borrowRequests && borrowRequests.length > 0 ? (
            <Table
              columns={columns}
              data={borrowRequests}
              actions={(request) => (
                <>
                  {request.status !== 'Borrowed' && request.status !== 'Requested' && (
                    <button onClick={() => handleDeleteRequest(request.id)}>Delete</button>
                  )}
                  {request.status === 'Requested' && (
                    <>
                      <button onClick={() => handleStatusChange(request.id, 'Borrowed')}>Accept</button>
                      <button onClick={() => handleStatusChange(request.id, 'Rejected')}>Reject</button>
                    </>
                  )}
                  {request.status === 'Borrowed' && (
                    <button onClick={() => handleStatusChange(request.id, 'Returned')}>Mark as Returned</button>
                  )}
                </>
              )}
            />
          ) : (
            <p>No borrow requests available</p>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default BookDetails;
