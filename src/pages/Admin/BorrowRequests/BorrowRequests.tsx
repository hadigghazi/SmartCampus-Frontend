import React, { useState } from 'react';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import Pagination from '../../../components/Pagination/Pagination';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import { useGetBorrowRequestsQuery } from '../../../features/api/borrowRequestsApi';
import { useGetLibraryBooksQuery } from '../../../features/api/libraryBooksApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';
import Spinner from '../../../components/Spinner/Spinner';

const BorrowRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  const { data: borrowRequests, isLoading: borrowRequestsLoading, error: borrowRequestsError } = useGetBorrowRequestsQuery();
  const { data: books, isLoading: booksLoading, error: booksError } = useGetLibraryBooksQuery();
  const { data: campuses, isLoading: campusesLoading, error: campusesError } = useGetCampusesQuery();


  if (borrowRequestsLoading || booksLoading || campusesLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (borrowRequestsError || booksError || campusesError) return <p>Something went wrong!</p>;

  const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);
  const filteredRequests = borrowRequests?.filter((request) => {
    const book = books?.find(book => book.id === request.book_id);
    const matchesBookSearch = book ? searchTerms.every(term =>
      book.title.toLowerCase().includes(term) || book.isbn.toLowerCase().includes(term)
    ) : false;

    const matchesCampus = selectedCampus === 'all' || book?.campus_id === Number(selectedCampus);
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus; 

    return matchesBookSearch && matchesCampus && matchesStatus; 
  });

  const getCampusNameById = (campusId: number, campuses: any[]) => {
    const campus = campuses?.find(campus => campus.id === campusId);
    return campus ? campus.name : 'Unknown';
  };

  const transformedRequests = filteredRequests?.map(request => {
    const book = books?.find(book => book.id === request.book_id);
    return {
      ...request,
      book_title: book?.title || 'Unknown',
      book_isbn: book?.isbn || 'Unknown',
      campus_name: getCampusNameById(book?.campus_id || 0, campuses),
    };
  });

  const indexOfLastEntry = currentPage * (entriesPerPage || 20);
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = transformedRequests?.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil((transformedRequests?.length || 0) / entriesPerPage);

  const columns = [
    { header: 'Book Title', accessor: 'book_title' },
    { header: 'ISBN', accessor: 'book_isbn' },
    { header: 'Campus', accessor: 'campus_name' },
    { header: 'Student ID', accessor: 'student_id' },
    { header: 'Request Date', accessor: (item: any) => new Date(item.created_at).toLocaleDateString('en-CA') },
    { header: 'Due Date', accessor: (item: any) => new Date(item.due_date).toLocaleDateString('en-CA') },
    { header: 'Status', accessor: 'status' },
  ];

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
        <h1 className={styles.headingPrimary}>Borrow Requests</h1>
        <div className={styles.filters}>
          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          <select
            value={selectedStatus}
            className={styles.selectField}
            onChange={(e) => setSelectedStatus(e.target.value === 'all' ? 'all' : e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Requested">Requested</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Rejected">Rejected</option>
            <option value="Returned">Returned</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
        <Table
          columns={columns}
          data={currentEntries || []}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
};

export default BorrowRequests;
