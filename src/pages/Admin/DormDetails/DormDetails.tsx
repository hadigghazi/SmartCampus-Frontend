import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetDormByIdQuery,
  useGetAllDormRoomsQuery,
  useDeleteDormRoomMutation,
  useUpdateDormRoomMutation,
  useCreateDormRoomMutation,
} from '../../../features/api/dormsApi';
import Table from '../../../components/Table/Table';
import { Dorm, DormRoom, Campus } from '../../../features/api/types';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import AdminLayout from '../AdminLayout';
import styles from '../CourseDetails/CourseDetails.module.css';
import { useGetCampusByIdQuery } from '../../../features/api/campusesApi';

const DormDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dormId = Number(id);

  const { data: dorm, refetch: refetchDorm } = useGetDormByIdQuery(dormId);
  const { data: roomsList = [], refetch: refetchRooms } = useGetAllDormRoomsQuery(dormId);
  const { data: campus } = useGetCampusByIdQuery(dorm?.campus_id || 0);
  const [deleteDormRoom] = useDeleteDormRoomMutation();
  const [updateDormRoom] = useUpdateDormRoomMutation();
  const [createDormRoom] = useCreateDormRoomMutation();

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<DormRoom | null>(null);
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
        capacity: editingRoom.capacity?.toString() || '',
        available_beds: editingRoom.available_beds?.toString() || '',
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

  const handleEditRoom = (room: DormRoom) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const handleDeleteRoom = async (id: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteDormRoom(id).unwrap();
        toast.success('Room deleted successfully');
        refetchRooms();
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const handleSaveRoom = async () => {
    try {
      const roomPayload: Partial<DormRoom> = {
        room_number: formValues.room_number,
        capacity: formValues.capacity ? Number(formValues.capacity) : undefined,
        available_beds: formValues.available_beds ? Number(formValues.available_beds) : undefined,
        floor: formValues.floor,
        description: formValues.description,
      };

      if (editingRoom) {
        await updateDormRoom({ id: editingRoom.id, updates: roomPayload }).unwrap();
        toast.success('Room updated successfully');
      } else {
        await createDormRoom({ ...roomPayload, dorm_id: dormId }).unwrap();
        toast.success('Room created successfully');
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

  const actions = (room: DormRoom) => (
    <div className={styles.actions}>
      <button style={{ marginRight: '1rem' }} onClick={() => handleEditRoom(room)}>Edit</button>
      <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        {dorm ? (
          <div className={styles.content}>
            <h1 className={styles.headingPrimary}>{dorm.name}</h1>
            <p className={styles.text}>Capacity: {dorm.capacity}</p>
            <p className={styles.text}>Available Rooms: {dorm.available_rooms}</p>
            <p className={styles.text}>Campus: {campus?.name || 'Loading...'}</p>
            <p className={styles.text}>Description: {dorm.description}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className={styles.content}>
            <div className={styles.header_container} style={{marginBottom: "0rem"}}>
        <h2 className={styles.headingSecondary}>Dorm Rooms</h2>
        <button className={styles.addButton} onClick={() => setShowRoomModal(true)}>Add Room</button>
        </div>
        <Table
          columns={columns}
          data={roomsList}
          actions={actions}
        />
        </div>
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
