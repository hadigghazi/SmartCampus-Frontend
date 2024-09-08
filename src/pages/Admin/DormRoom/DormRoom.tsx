import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetDormRoomByIdQuery,
  useGetDormRegistrationsForRoomQuery,
  useCreateDormRegistrationMutation,
  useDeleteDormRegistrationMutation,
  useUpdateDormRegistrationMutation,
} from '../../../features/api/dormsApi';

import Table from '../../../components/Table/Table';
import { DormRoomRegistration } from '../../../features/api/types';
import { toast } from 'react-toastify';
import AdminLayout from '../AdminLayout';
import styles from '../CourseDetails/CourseDetails.module.css';
import Spinner from '../../../components/Spinner/Spinner';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';

const DormRoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dormRoomId = Number(id);

  const { data: dormRoom } = useGetDormRoomByIdQuery(dormRoomId);
  const { data: roomRegistrations = [], refetch: refetchRegistrations } = useGetDormRegistrationsForRoomQuery(dormRoomId);
  const [createDormRoomRegistration] = useCreateDormRegistrationMutation();
  const [deleteDormRoomRegistration] = useDeleteDormRegistrationMutation();
  const [updateDormRoomRegistration] = useUpdateDormRegistrationMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<DormRoomRegistration | null>(null);
  const [formValues, setFormValues] = useState({
    student_id: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (editingRegistration) {
      setFormValues({
        student_id: editingRegistration.student_id.toString(),
        start_date: editingRegistration.start_date,
        end_date: editingRegistration.end_date,
      });
    } else {
      setFormValues({
        student_id: '',
        start_date: '',
        end_date: '',
      });
    }
  }, [editingRegistration]);

  const handleAddRegistrationClick = () => {
    setEditingRegistration(null);
    setShowModal(true);
  };

  const handleEditRegistration = (registration: DormRoomRegistration) => {
    setEditingRegistration(registration);
    setShowModal(true);
  };

  const handleSaveRegistration = async () => {
    try {
      const registrationPayload: Partial<DormRoomRegistration> = {
        student_id: Number(formValues.student_id),
        dorm_room_id: dormRoomId,
        start_date: formValues.start_date,
        end_date: formValues.end_date,
      };

      if (editingRegistration) {
        await updateDormRoomRegistration({
            id: editingRegistration.id,
            registration: {
              student_id: Number(formValues.student_id),
              dorm_room_id: dormRoomId,
              start_date: formValues.start_date,
              end_date: formValues.end_date,
            },
          }).unwrap();
                  toast.success('Registration updated successfully');
      } else {
        if (roomRegistrations.length + 1 > dormRoom?.capacity) {
          toast.error('Cannot add more registrations than room capacity');
          return;
        }
        await createDormRoomRegistration(registrationPayload).unwrap();
        toast.success('Student registered successfully');
      }

      setShowModal(false);
      refetchRegistrations();
    } catch (error) {
      toast.error('Failed to save registration');
    }
  };

  const handleDeleteRegistration = async (id: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
    try {
      await deleteDormRoomRegistration(id).unwrap();
      toast.success('Registration deleted successfully');
      refetchRegistrations();
    } catch (error) {
      toast.error('Failed to delete registration');
    }
}
  };

  const registrationColumns = [
    { header: 'Student ID', accessor: 'student_id' },
    { header: 'Start Date', accessor: 'start_date' },
    { header: 'End Date', accessor: 'end_date' },
  ];

  const registrationActions = (registration: DormRoomRegistration) => (
    <div className={styles.actions}>
      <button style={{marginRight: '1rem'}} onClick={() => handleEditRegistration(registration)}>Edit</button>
      <button onClick={() => handleDeleteRegistration(registration.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        {dormRoom ? (
          <div className={styles.content}>
            <h1 className={styles.headingPrimary}>Dorm Room Details</h1>
            <p className={styles.text}>Room Number: {dormRoom.room_number}</p>
            <p className={styles.text}>Capacity: {dormRoom.capacity}</p>
            <p className={styles.text}>Available Beds: {dormRoom.available_beds}</p>
            <p className={styles.text}>Floor: {dormRoom.floor}</p>
            <p className={styles.text}>Description: {dormRoom.description}</p>
            
            <div style={{marginTop: "5rem", marginBottom: "0rem"}} className={styles.header_container}>
              <h2 className={styles.headingSecondary}>Registrations</h2>
              <button className={styles.addButton} onClick={handleAddRegistrationClick}>Add Registration</button>
            </div>
            <Table columns={registrationColumns} data={roomRegistrations} actions={registrationActions} />

            {showModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h2 className={styles.headingSecondary}>{editingRegistration ? 'Edit Registration' : 'Add Registration'}</h2>
                  <form className={styles.form}>
                    <label>
                      Student ID:
                      <input
                        type="number"
                        value={formValues.student_id}
                        onChange={(e) => setFormValues({ ...formValues, student_id: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Start Date:
                      <input
                        type="date"
                        value={formValues.start_date}
                        onChange={(e) => setFormValues({ ...formValues, start_date: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      End Date:
                      <input
                        type="date"
                        value={formValues.end_date}
                        onChange={(e) => setFormValues({ ...formValues, end_date: e.target.value })}
                        required
                      />
                    </label>
                    <div className={styles.btnContainer}>
                      <button className={styles.rejectBtn} type="button" onClick={() => setShowModal(false)}>Cancel</button>
                      <button className={styles.acceptBtn} type="button" onClick={handleSaveRegistration}>Save</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
         </div>
        ) : (
          <Spinner />
        )}
      </div>
      <ToastNotifications />
    </AdminLayout>
  );
};

export default DormRoomDetailsPage;
