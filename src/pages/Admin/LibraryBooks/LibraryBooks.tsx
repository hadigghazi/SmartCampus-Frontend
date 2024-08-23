import React, { useState } from 'react';
import { useGetLibraryBooksQuery, useDeleteLibraryBookMutation, useCreateLibraryBookMutation } from '../../../features/api/libraryBooksApi';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import { toast } from 'react-toastify';
import { LibraryBook, Campus } from '../../../features/api/types';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';

const LibraryBooks: React.FC = () => {
  const { data: books, isLoading, error } = useGetLibraryBooksQuery();
  const { data: campuses } = useGetCampusesQuery();
  const [selectedCampus, setSelectedCampus] = useState<string | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string | 'all'>('all');
  const [deleteBook] = useDeleteLibraryBookMutation();
  const [addBook] = useCreateLibraryBookMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [bookData, setBookData] = useState<LibraryBook>({
    isbn: '',
    title: '',
    author: '',
    description: '',
    publication_year: 0,
    copies: 0,
    campus_id: 0,
    pages: 0,
  });

  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredBooks = books?.filter((book) => {
    const matchesAuthor = selectedAuthor === 'all' || book.author.toLowerCase() === selectedAuthor.toLowerCase();
    const matchesCampus = selectedCampus === 'all' || book.campus_id === Number(selectedCampus);
    const matchesSearchTerm = searchTerms.every(term => 
      book.title.toLowerCase().includes(term) || book.isbn.toLowerCase().includes(term)
    );
    return matchesAuthor && matchesCampus && matchesSearchTerm;
  });

  const getCampusNameById = (campusId: number, campuses: Campus[] | undefined) => {
    const campus = campuses?.find(campus => campus.id === campusId);
    return campus ? campus.name : 'Unknown';
  };

  const transformedBooks = filteredBooks?.map(book => ({
    ...book,
    campus_name: getCampusNameById(book.campus_id, campuses),
  }));

  const indexOfLastEntry = currentPage * (entriesPerPage || 20);
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = transformedBooks?.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil((transformedBooks?.length || 0) / entriesPerPage);

  const handleDeleteBook = async (bookId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteBook(bookId).unwrap();
        toast.success('Book deleted successfully!');
      } catch (err) {
        console.error('Error deleting book:', err);
        toast.error('Failed to delete book.');
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleViewBook = (bookId: number) => {
    navigate(`/admin/books/${bookId}`);
  };

  const handleBorrowClick = () => {
    navigate(`/admin/borrow-requests`);
  };

  const handleAddBookClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBookData({
      isbn: '',
      title: '',
      author: '',
      description: '',
      publication_year: 0,
      copies: 0,
      campus_id: 0,
      pages: 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookData(prevState => ({
      ...prevState,
      [name]: name === 'campus_id' ? Number(value) : value, // Ensure campus_id is a number
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addBook(bookData).unwrap();
      toast.success('Book added successfully!');
      handleCloseModal();
    } catch (err) {
      console.error('Error adding book:', err);
      toast.error('Failed to add book.');
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Books</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <select
            value={selectedAuthor}
            className={styles.selectField}
            onChange={(e) => setSelectedAuthor(e.target.value === 'all' ? 'all' : e.target.value)}
          >
            <option value="all">All Authors</option>
            {Array.from(new Set(books?.map(book => book.author))) 
              .map(author => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
          </select>
          <select
            value={selectedCampus}
            className={styles.selectField}
            onChange={(e) => setSelectedCampus(e.target.value === 'all' ? 'all' : e.target.value)}
          >
            <option value="all">All Campuses</option>
            {campuses?.map(campus => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddBookClick} className={styles.addButton}>Add Book</button>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <button onClick={handleBorrowClick} className={styles.addButton} style={{marginBottom: "2rem"}}>All Borrow Requests</button>
        <Table
          columns={[
            { header: 'ISBN', accessor: 'isbn' as keyof LibraryBook },
            { header: 'Title', accessor: 'title' as keyof LibraryBook },
            { header: 'Author', accessor: 'author' as keyof LibraryBook },
            { header: 'Campus', accessor: 'campus_name' as keyof LibraryBook }, // Display campus name
            { header: 'Number of Copies', accessor: 'copies' as keyof LibraryBook },
          ]}
          data={currentEntries || []}
          actions={(book) => (
            <>
              <button onClick={() => handleViewBook(book.id)}>View</button>
              <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {showModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent} style={{width: '500px'}}>
      <h2 className={styles.headingSecondary}>Add New Book</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>
          ISBN:
          <input
            type="text"
            name="isbn"
            value={bookData.isbn}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Title:
          <input
            type="text"
            name="title"
            value={bookData.title}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Author:
          <input
            type="text"
            name="author"
            value={bookData.author}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Publication Year:
          <input
            type="number"
            name="publication_year"
            value={bookData.publication_year}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Copies:
          <input
            type="number"
            name="copies"
            value={bookData.copies}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Pages:
          <input
            type="number"
            name="pages"
            value={bookData.pages}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </label>
        <label className={styles.formLabel}>
          Campus:
          <select
            name="campus_id"
            value={bookData.campus_id || 'all'}
            onChange={handleChange}
            className={styles.formSelect}
          >
            {campuses?.map(campus => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.formLabel}>
          Description:
          <textarea
            name="description"
            value={bookData.description}
            onChange={handleChange}
            style={{marginLeft: '2rem', border:"1px solid"}}
            className={styles.formTextArea}
          />
        </label>
        <div className={styles.btnContainer}>
          <button type="submit" className={styles.acceptBtn}>Add Book</button>
          <button type="button" onClick={handleCloseModal} className={styles.rejectBtn}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>
    </AdminLayout>
  );
};

export default LibraryBooks;
