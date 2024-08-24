import React, { useState, useEffect } from 'react';
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '../../../features/api/roomsApi';
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import { Room } from '../../../features/api/types';

const RoomsPage: React.FC = () => {
  const { data: roomsList = [] } = useGetRoomsQuery();
  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formValues, setFormValues] = useState({
    number: '',
    block_id: 0,
    capacity: '',
    description: '',
  });

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingRoom) {
      setFormValues({
        number: editingRoom.number,
        block_id: editingRoom.block_id,
        capacity: editingRoom.capacity || '',
        description: editingRoom.description || '',
      });
    } else {
      setFormValues({
        number: '',
        block_id: 0,
        capacity: '',
        description: '',
      });
    }
  }, [editingRoom]);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDeleteRoom = async (id: number) => {
    try {
      await deleteRoom(id).unwrap();
      console.log('Room deleted successfully');
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const handleSaveRoom = async () => {
    try {
      const roomPayload = {
        ...formValues,
        capacity: formValues.capacity ? Number(formValues.capacity) : undefined,
      };

      if (editingRoom) {
        await updateRoom({ id: editingRoom.id, ...roomPayload }).unwrap();
        console.log('Room updated successfully');
      } else {
        await createRoom(roomPayload).unwrap();
        console.log('Room created successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save room:', error);
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

  const filteredRooms = roomsList.filter(r =>
    r.number.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredRooms.length / pageSize);

  const columns = [
    { header: 'Number', accessor: 'number' },
    { header: 'Block ID', accessor: 'block_id' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Description', accessor: 'description' },
  ];

  const actions = (room: Room) => (
    <div className={styles.actions}>
      <button onClick={() => handleEditRoom(room)}>Edit</button>
      <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Rooms</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <button onClick={handleAddRoom} className={styles.addButton}>Add Room</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
        <div className={styles.wrapper}>
          <Table
            columns={columns}
            data={paginatedRooms}
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
              <h2>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
              <form className={styles.form}>
                <label>
                  Number:
                  <input
                    type="text"
                    name="number"
                    value={formValues.number}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Block ID:
                  <input
                    type="number"
                    name="block_id"
                    value={formValues.block_id}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    name="capacity"
                    value={formValues.capacity}
                    onChange={handleChange}
                  />
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
                  <button type="button" onClick={handleSaveRoom}>Save</button>
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

export default RoomsPage;
