import React, { useState } from 'react';
import {
  useGetLibraryBooksQuery,
  useDeleteLibraryBookMutation,
  useCreateLibraryBookMutation,
  useUpdateLibraryBookMutation, 
} from '../../../features/api/libraryBooksApi';
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
import Spinner from '../../../components/Spinner/Spinner';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';

const LibraryBooks: React.FC = () => {
  const { data: books, isLoading, error, refetch } = useGetLibraryBooksQuery(); // Added refetch
  const { data: campuses } = useGetCampusesQuery();
  const [selectedCampus, setSelectedCampus] = useState<string | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string | 'all'>('all');
  const [deleteBook] = useDeleteLibraryBookMutation();
  const [addBook] = useCreateLibraryBookMutation();
  const [updateBook] = useUpdateLibraryBookMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [bookData, setBookData] = useState<any>({
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

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
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
        refetch(); 
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
    setIsEditing(false); 
    setShowModal(true);
  };

  const handleEditBookClick = (book: LibraryBook) => {
    setBookData(book); 
    setIsEditing(true);
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
      [name]: name === 'campus_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { title, author, isbn, copies, publication_year, campus_id, pages } = bookData;
    
    if (!title || !author || !isbn || !copies || !publication_year || !campus_id || !pages) {
      toast.error('Please fill in all required fields.');
      return;
    }
  
    try {
      if (isEditing) {
        await updateBook({ book: bookData }).unwrap();  
        toast.success('Book updated successfully!');
      } else {
        await addBook(bookData).unwrap();
        toast.success('Book added successfully!');
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error('Error submitting book:', err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} book.`);
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
            { header: 'Campus', accessor: 'campus_name' as keyof LibraryBook }, 
            { header: 'Copies', accessor: 'copies' as keyof LibraryBook },
          ]}
          data={currentEntries || []}
          actions={(book) => (
            <>
              <button className={styles.viewButton} onClick={() => handleViewBook(book.id)}>
                View
              </button>
              <button className={styles.editButton} onClick={() => handleEditBookClick(book)}>
                Edit
              </button>
              <button className={styles.deleteButton} onClick={() => handleDeleteBook(book.id)}>
                Delete
              </button>
            </>
          )}
        />
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>{isEditing ? 'Edit Book' : 'Add Book'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                ISBN
              <input
                type="text"
                name="isbn"
                value={bookData.isbn}
                onChange={handleChange}
                placeholder="ISBN"
                required
              />
              </label>
              <label>
                Title
              <input
                type="text"
                name="title"
                value={bookData.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
              </label>
              <label>
                Author
              <input
                type="text"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                placeholder="Author"
                required
              />
              </label>
              <label>
                Description
              <textarea
                name="description"
                value={bookData.description}
                onChange={handleChange}
                placeholder="Description"
              />
              </label>
              <label>
                Publication Year
              <input
                type="number"
                name="publication_year"
                value={bookData.publication_year}
                onChange={handleChange}
                placeholder="Publication Year"
                required
              />
              </label>
              <label>Copies
              <input
                type="number"
                name="copies"
                value={bookData.copies}
                onChange={handleChange}
                placeholder="Number of Copies"
                required
              />
              </label>
              <label>
                Campus
              <select
                name="campus_id"
                value={bookData.campus_id}
                onChange={handleChange}
                required
              >
                {campuses?.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </select>
              </label>
              <label>
                Pages
              <input
                type="number"
                name="pages"
                value={bookData.pages}
                onChange={handleChange}
                placeholder="Number of Pages"
              />
              </label>
              <div className={styles.btnContainer} style={{marginTop: "1rem"}}>
              <button className={styles.rejectBtn} onClick={handleCloseModal}>
              Cancel
            </button>
              <button type="submit" className={styles.acceptBtn}>
                {isEditing ? 'Update Book' : 'Add Book'}
              </button>
            </div>
            </form>
            </div>
          </div>
      )}
      <ToastNotifications />
    </AdminLayout>
  );
};

export default LibraryBooks;
