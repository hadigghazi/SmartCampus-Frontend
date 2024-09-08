import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetDormQuery,
  useGetDormRoomsQuery,
  useDeleteRoomMutation,
  useUpdateRoomMutation
} from '../../../features/api/dormsApi';
import Table from '../../../components/Table/Table';
import { Dorm, Room } from '../../../features/api/types';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';

const DormDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dorm, refetch: refetchDorm } = useGetDormQuery(Number(id));
  const { data: roomsList = [], refetch: refetchRooms } = useGetDormRoomsQuery(Number(id));
  const [deleteRoom] = useDeleteRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formValues, setFormValues] = useState({
    room_number: '',
    capacity: '',
    available_beds: '',
    floor: '',
    description: '',
  });

  useEffect(() => {
    if (editingRoom) {
      setFormValues({
        room_number: editingRoom.room_number,
        capacity: editingRoom.capacity || '',
        available_beds: editingRoom.available_beds || '',
        floor: editingRoom.floor || '',
        description: editingRoom.description || '',
      });
    } else {
      setFormValues({
        room_number: '',
        capacity: '',
        available_beds: '',
        floor: '',
        description: '',
      });
    }
  }, [editingRoom]);

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const handleDeleteRoom = async (id: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteRoom(id).unwrap();
        toast.success('Room deleted successfully');
        refetchRooms();
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
        available_beds: formValues.available_beds ? Number(formValues.available_beds) : undefined,
      };

      if (editingRoom) {
        await updateRoom({ id: editingRoom.id, ...roomPayload }).unwrap();
        toast.success('Room updated successfully');
      } else {
        // Add your room creation logic here
      }
      setShowRoomModal(false);
      refetchRooms();
    } catch (error) {
      toast.error('Failed to save room');
    }
  };

  const columns = [
    { header: 'Room Number', accessor: 'room_number' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Available Beds', accessor: 'available_beds' },
    { header: 'Floor', accessor: 'floor' },
    { header: 'Description', accessor: 'description' },
  ];

  const actions = (room: Room) => (
    <div className={styles.actions}>
      <button style={{ marginRight: '1rem' }} onClick={() => handleEditRoom(room)}>Edit</button>
      <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Dorm Details</h1>
        {dorm ? (
          <div className={styles.dormDetails}>
            <h2>{dorm.name}</h2>
            <p><strong>Description:</strong> {dorm.description}</p>
            <p><strong>Capacity:</strong> {dorm.capacity}</p>
            <p><strong>Available Rooms:</strong> {dorm.available_rooms}</p>
            <p><strong>Campus:</strong> {dorm.campus_name}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <h2 className={styles.headingSecondary}>Dorm Rooms</h2>
        <Table
          columns={columns}
          data={roomsList}
          actions={actions}
        />
        {showRoomModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{editingRoom ? 'Edit Room' : 'Add Room'}</h2>
              <form className={styles.form}>
                <label>
                  Room Number:
                  <input
                    type="text"
                    name="room_number"
                    value={formValues.room_number}
                    onChange={(e) => setFormValues({ ...formValues, room_number: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    name="capacity"
                    value={formValues.capacity}
                    onChange={(e) => setFormValues({ ...formValues, capacity: e.target.value })}
                  />
                </label>
                <label>
                  Available Beds:
                  <input
                    type="number"
                    name="available_beds"
                    value={formValues.available_beds}
                    onChange={(e) => setFormValues({ ...formValues, available_beds: e.target.value })}
                  />
                </label>
                <label>
                  Floor:
                  <input
                    type="text"
                    name="floor"
                    value={formValues.floor}
                    onChange={(e) => setFormValues({ ...formValues, floor: e.target.value })}
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    rows={4}
                  />
                </label>
                <div className={styles.btnContainer}>
                  <button className={styles.rejectBtn} type="button" onClick={() => setShowRoomModal(false)}>Cancel</button>
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

export default DormDetailsPage;
