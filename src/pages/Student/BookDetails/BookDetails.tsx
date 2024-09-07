import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLibraryBookByIdQuery } from '../../../features/api/libraryBooksApi';
import { useGetCampusByIdQuery } from '../../../features/api/campusesApi';
import { useBorrowBookMutation, useGetBorrowRequestsForBookByUserQuery } from '../../../features/api/borrowRequestsApi';
import styles from '../../Admin/CourseDetails/CourseDetails.module.css';
import StudentLayout from '../StudentLayout';
import Spinner from '../../../components/Spinner/Spinner';

const BookDetailsForStudent: React.FC = () => {
  const { id: bookId } = useParams<{ id: string }>();
  const { data: book, isLoading: bookLoading, error: bookError } = useGetLibraryBookByIdQuery(Number(bookId));
  const campusId = book?.campus_id;
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(campusId, {
    skip: !campusId,
  });

  const { data: borrowRequests, isLoading: borrowRequestsLoading, error: borrowRequestsError } = useGetBorrowRequestsForBookByUserQuery(Number(bookId));
  const [borrowBook, { isLoading: borrowing, error: borrowError }] = useBorrowBookMutation();

  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (borrowRequests) {
      const studentBorrowRequest = borrowRequests.find(
        (request: any) => request.book_id === Number(bookId)
      );

      if (studentBorrowRequest) {
        if (studentBorrowRequest.status === 'Borrowed') {
          setMessage('You have already borrowed this book.');
        } else if (studentBorrowRequest.status === 'Requested') {
          setMessage('Your request is pending.');
        } else if (studentBorrowRequest.status === 'Rejected') {
          setMessage('Your request was rejected.');
        } else if (studentBorrowRequest.status === 'Overdue') {
          setMessage('Your previous borrow is overdue.');
        }
      }
    }
  }, [borrowRequests, bookId]);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await borrowBook({
        book_id: Number(bookId),
        due_date: dueDate,
        notes: notes || null,
      }).unwrap();
      
      setMessage('Your request is pending.');
    } catch (error) {
      console.error('Failed to borrow the book:', error);
      setMessage('Failed to borrow the book.');
    }
  };

  if (bookLoading || campusLoading || borrowRequestsLoading) return <StudentLayout><Spinner /></StudentLayout>;
  if (bookError || campusError || borrowRequestsError || borrowError) return <p>Something went wrong!</p>;

  return (
    <StudentLayout>
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

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>- Borrow Book</h2>
          {message ? (
            <p>{message}</p>
          ) : (
            <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleBorrow}>
              <div>
                <label className={styles.label} htmlFor="dueDate">Due Date:</label>
                <input
                  id="dueDate"
                  type="date"
                  className={styles.fileInput}
                  style={{marginLeft: '0px'}}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="notes">Notes:</label>
                <textarea
                  id="notes"
                  className={styles.fileInput}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.submitButton} disabled={borrowing}>
                {borrowing ? 'Borrowing...' : 'Borrow Book'}
              </button>
              {borrowError && <p>Error: {borrowError.message}</p>}
            </form>
            </div>
          )}
        </div>
      )}
    </StudentLayout>
  );
};

export default BookDetailsForStudent;
