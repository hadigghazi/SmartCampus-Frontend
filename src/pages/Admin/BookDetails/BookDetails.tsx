import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetLibraryBookByIdQuery } from '../../../features/api/libraryBooksApi';
import { useGetCampusByIdQuery } from '../../../features/api/campusesApi'; 
import AdminLayout from '../AdminLayout';
import styles from '../CourseDetails/CourseDetails.module.css'; 

const BookDetails: React.FC = () => {
  const { id: bookId } = useParams<{ id: string }>(); 
  const { data: book, isLoading: bookLoading, error: bookError } = useGetLibraryBookByIdQuery(Number(bookId));

  const campusId = book?.campus_id;
  const { data: campus, isLoading: campusLoading, error: campusError } = useGetCampusByIdQuery(campusId, {
    skip: !campusId, 
  });

  if (bookLoading || campusLoading) return <p>Loading...</p>;
  if (bookError || campusError) return <p>Something went wrong!</p>;

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
        </div>
      )}
    </AdminLayout>
  );
};

export default BookDetails;
