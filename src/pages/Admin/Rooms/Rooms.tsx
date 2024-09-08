import React, { useState, useEffect } from 'react';
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from '../../../features/api/roomsApi';
import {
  useGetBlocksQuery,
} from '../../../features/api/blocksApi'; 
import Table from '../../../components/Table/Table';
import Pagination from '../../../components/Pagination/Pagination';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import { Room } from '../../../features/api/types';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';

const RoomsPage: React.FC = () => {
  const { data: roomsList = [], refetch } = useGetRoomsQuery();
  const { data: blocksList = [] } = useGetBlocksQuery(); 
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
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
    try {
      await deleteRoom(id).unwrap();
      toast.success('Room deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete room');
    }
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
        toast.success('Room updated successfully');
      } else {
        await createRoom(roomPayload).unwrap();
        toast.success('Room created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to save room');
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

  const getBlockNameById = (blockId: number) => {
    const block = blocksList.find(b => b.id === blockId);
    return block ? block.name : 'Unknown';
  };

  const columns = [
    { header: 'Number', accessor: 'number' },
    { header: 'Block Name', accessor: (room: Room) => getBlockNameById(room.block_id) },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Description', accessor: 'description' },
  ];

  const actions = (room: Room) => (
    <div className={styles.actions}>
      <button style={{marginRight: "1rem"}} onClick={() => handleEditRoom(room)}>Edit</button>
      <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Rooms</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <button onClick={handleAddRoom} className={styles.addButton}>Add Room</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
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
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
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
                  <select
                    name="block_id"
                    value={formValues.block_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Block</option>
                    {blocksList.map(block => (
                      <option key={block.id} value={block.id}>{block.name}</option>
                    ))}
                  </select>
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
                <div className={styles.btnContainer}>
                <button className={styles.rejectBtn} type="button" onClick={() => setShowModal(false)}>Cancel</button>
                  <button className={styles.acceptBtn} type="button" onClick={handleSaveRoom}>Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ToastNotifications />
      </div>
    </AdminLayout>
  );
};

export default RoomsPage;
