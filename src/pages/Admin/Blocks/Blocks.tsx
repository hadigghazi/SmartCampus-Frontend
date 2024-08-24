import React, { useState, useEffect } from 'react';
import {
  useGetBlocksQuery,
  useCreateBlockMutation,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
} from '../../../features/api/blocksApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import { Block } from '../../../features/api/types';

const BlocksPage: React.FC = () => {
  const { data: blocksList = [] } = useGetBlocksQuery();
  const { data: campusesList = [] } = useGetCampusesQuery();
  const [createBlock] = useCreateBlockMutation();
  const [updateBlock] = useUpdateBlockMutation();
  const [deleteBlock] = useDeleteBlockMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    campus_id: 0,
    description: '',
  });

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingBlock) {
      setFormValues({
        name: editingBlock.name,
        campus_id: editingBlock.campus_id,
        description: editingBlock.description || '',
      });
    } else {
      setFormValues({
        name: '',
        campus_id: 0,
        description: '',
      });
    }
  }, [editingBlock]);

  const handleAddBlock = () => {
    setEditingBlock(null);
    setShowModal(true);
  };

  const handleEditBlock = (block: Block) => {
    setEditingBlock(block);
    setShowModal(true);
  };

  const handleDeleteBlock = async (id: number) => {
    try {
      await deleteBlock(id).unwrap();
      console.log('Block deleted successfully');
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleSaveBlock = async () => {
    try {
      const blockPayload = {
        ...formValues,
      };

      if (editingBlock) {
        await updateBlock({ id: editingBlock.id, ...blockPayload }).unwrap();
        console.log('Block updated successfully');
      } else {
        await createBlock(blockPayload).unwrap();
        console.log('Block created successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save block:', error);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const filteredBlocks = blocksList.filter(b =>
    b.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedBlocks = filteredBlocks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredBlocks.length / pageSize);

  const getCampusNameById = (campusId: number) => {
    const campus = campusesList.find(b => b.id === campusId);
    return campus ? campus.name : 'Unknown';
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Campus Name', accessor: (block: Block) => getCampusNameById(block.campus_id) },
    { header: 'Description', accessor: 'description' },
  ];

  const actions = (block: Block) => (
    <div className={styles.actions}>
      <button onClick={() => handleEditBlock(block)}>Edit</button>
      <button onClick={() => handleDeleteBlock(block.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className={styles.content}>
        <h1 className={styles.headingPrimary}>Blocks</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <button onClick={handleAddBlock} className={styles.addButton}>Add Block</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
        <div className={styles.wrapper}>
          <Table
            columns={columns}
            data={paginatedBlocks}
            actions={actions}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>{editingBlock ? 'Edit Block' : 'Add Block'}</h2>
              <form className={styles.form}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Campus:
                  <select
                    name="campus_id"
                    value={formValues.campus_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a campus</option>
                    {campusesList.map(campus => (
                      <option key={campus.id} value={campus.id}>
                        {campus.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={formValues.description || ''}
                    onChange={handleChange}
                    rows={4}
                  />
                </label>
                <div className={styles.modalActions}>
                  <button type="button" onClick={handleSaveBlock}>Save</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlocksPage;
