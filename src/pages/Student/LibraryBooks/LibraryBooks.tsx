import React, { useState } from 'react';
import { useGetLibraryBooksQuery } from '../../../features/api/libraryBooksApi';
import { useNavigate } from 'react-router-dom';
import styles from '../../Admin/Courses/Courses.module.css';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import { LibraryBook, Campus } from '../../../features/api/types';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';
import StudentLayout from '../StudentLayout';
import Spinner from '../../../components/Spinner/Spinner';

const LibraryBooksStudent: React.FC = () => {
  const { data: books, isLoading, error } = useGetLibraryBooksQuery();
  const { data: campuses } = useGetCampusesQuery();
  const [selectedCampus, setSelectedCampus] = useState<string | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  const navigate = useNavigate();

  if (isLoading) return <StudentLayout><Spinner /></StudentLayout>;
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleViewBook = (bookId: number) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <StudentLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Library Books</h1>
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
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={[
            { header: 'ISBN', accessor: 'isbn' as keyof LibraryBook },
            { header: 'Title', accessor: 'title' as keyof LibraryBook },
            { header: 'Author', accessor: 'author' as keyof LibraryBook },
            { header: 'Campus', accessor: 'campus_name' as keyof LibraryBook },
            { header: 'Number of Copies', accessor: 'copies' as keyof LibraryBook },
          ]}
          data={currentEntries || []}
          actions={(book) => (
            <>
              <button onClick={() => handleViewBook(book.id)}>View</button>
            </>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      </StudentLayout>
  );
};

export default LibraryBooksStudent;
