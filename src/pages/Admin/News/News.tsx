import React, { useState, useEffect } from 'react';
import { useGetNewsQuery, useAddNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } from '../../../features/api/newsApi';
import { useGetUsersQuery } from '../../../features/api/usersApi';
import Table from '../../../components/Table/Table'; 
import Pagination from '../../../components/Pagination/Pagination'; 
import SearchInput from '../../../components/SearchInput/SearchInput'; 
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage'; 
import styles from '../Courses/Courses.module.css'; 
import { News } from '../../../features/api/types';
import AdminLayout from '../AdminLayout';
import { useGetUserQuery } from '../../../features/api/authApi';

const NewsPage: React.FC = () => {
  const { data: newsList = [] } = useGetNewsQuery();
  const { data: users = [] } = useGetUsersQuery(); 
  const { data: user = [] } = useGetUserQuery(); 
  const [addNews] = useAddNewsMutation();
  const [updateNews] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formValues, setFormValues] = useState({
    title: '',
    content: '',
    category: '',
  });

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingNews) {
      setFormValues({
        title: editingNews.title,
        content: editingNews.content,
        category: editingNews.category,
      });
    } else {
      setFormValues({
        title: '',
        content: '',
        category: '',
      });
    }
  }, [editingNews]);

  const handleAddNews = () => {
    setEditingNews(null);
    setShowModal(true);
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setShowModal(true);
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await deleteNews(id).unwrap();
      console.log('News deleted successfully');
    } catch (error) {
      console.error('Failed to delete news:', error);
    }
  };

  const handleSaveNews = async () => {
    try {
      const newsPayload = {
        ...formValues,
        author_id: user.id, 
        published_date: editingNews ? editingNews.published_date : new Date().toISOString().split('T')[0],
      };

      if (editingNews) {
        await updateNews({ id: editingNews.id, ...newsPayload }).unwrap();
        console.log('News updated successfully');
      } else {
        await addNews(newsPayload).unwrap();
        console.log('News created successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save news:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const userMap = new Map<number, string>();
  users.forEach(user => {
    userMap.set(user.id, `${user.first_name} ${user.middle_name} ${user.last_name}`);
  });

  const filteredNews = newsList.filter(n =>
    n.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredNews.length / pageSize);

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Published Date', accessor: 'published_date' },
    { header: 'Category', accessor: 'category' },
    { header: 'Author', accessor: 'author_name' },
  ];

  const data = paginatedNews.map(news => ({
    ...news,
    author_name: userMap.get(news.author_id) || 'Unknown', 
  }));

  const actions = (news: News) => (
    <div className={styles.actions}>
      <button style={{marginRight: '1rem'}} onClick={() => handleEditNews(news)}>Edit</button>
      <button style={{marginRight: '1rem'}} onClick={() => handleDeleteNews(news.id)}>Delete</button>
      <button onClick={() => window.location.href = `/news/${news.id}`}>View</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>News</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <button onClick={handleAddNews} className={styles.addButton}>Add News</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
          <Table
            columns={columns}
            data={data}
            actions={actions}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{editingNews ? 'Edit News' : 'Add News'}</h2>
              <form className={styles.form}>
                <label>
                  Title:
                  <input
                    type="text"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Content:
                  <textarea
                    name="content"
                    value={formValues.content}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </label>
                <label>
                  Category:
                  <input
                    type="text"
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                    required
                  />
                </label>
                <div>
                  <div className={styles.btnContainer}>
                <button type="button" className={styles.rejectBtn} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className={styles.acceptBtn} onClick={handleSaveNews}>
                    Save
                  </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsPage;
