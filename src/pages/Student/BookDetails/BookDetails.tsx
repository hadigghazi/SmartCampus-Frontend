import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLibraryBookByIdQuery } from '../../../features/api/libraryBooksApi';
import { useGetCampusByIdQuery } from '../../../features/api/campusesApi';
import { useBorrowBookMutation } from '../../../features/api/borrowRequestsApi';
import styles from '../../Admin/CourseDetails/CourseDetails.module.css';

const BookDetailsForStudent: React.FC = () => {
  const { id: bookId } = useParams<{ id: string }>();
  const { data: book, isLoading: bookLoading, error: bookError } = useGetLibraryBookByIdQuery(Number(bookId));
  const campusId = book?.campus_id;
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(campusId, {
    skip: !campusId,
  });

  const [borrowBook, { isLoading: borrowing, error: borrowError }] = useBorrowBookMutation();
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await borrowBook({
        book_id: Number(bookId),
        due_date: dueDate,
        notes: notes || null,
      }).unwrap();
    } catch (error) {
      console.error('Failed to borrow the book:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  if (bookLoading || campusLoading) return <p>Loading...</p>;
  if (bookError || campusError || borrowError) return <p>Something went wrong!</p>;

  return (
    <div>
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

          <h2 className={styles.headingSecondary} style={{ marginTop: '7rem' }}>Borrow Book</h2>
          <form onSubmit={handleBorrow}>
            <div>
              <label htmlFor="dueDate">Due Date:</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="notes">Notes:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button type="submit" disabled={borrowing}>
              {borrowing ? 'Borrowing...' : 'Borrow Book'}
            </button>
            {borrowError && <p>Error: {borrowError.message}</p>}
          </form>
        </div>
      )}
      </div>
  );
};

export default BookDetailsForStudent;
