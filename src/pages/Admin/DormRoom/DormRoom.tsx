import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetDormRoomByIdQuery,
  useGetDormRoomRegistrationsQuery,
  useCreateDormRoomRegistrationMutation,
  useDeleteDormRoomRegistrationMutation,
} from '../../../features/api/dormsApi';
import Table from '../../../components/Table/Table';
import { DormRoomRegistration } from '../../../features/api/types';
import { toast } from 'react-toastify';
import AdminLayout from '../AdminLayout';
import styles from '../CourseDetails/CourseDetails.module.css';
import Spinner from '../../../components/Spinner/Spinner';

const DormRoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dormRoomId = Number(id);

  const { data: dormRoom } = useGetDormRoomByIdQuery(dormRoomId);
  const { data: roomRegistrations = [], refetch: refetchRegistrations } = useGetDormRoomRegistrationsQuery(dormRoomId);
  const [createDormRoomRegistration] = useCreateDormRoomRegistrationMutation();
  const [deleteDormRoomRegistration] = useDeleteDormRoomRegistrationMutation();

  const [registrationFormValues, setRegistrationFormValues] = useState({
    student_id: '',
    start_date: '',
    end_date: '',
    dorm_room_id: 0,
  });

  const handleAddRegistration = async () => {
    if (roomRegistrations.length >= dormRoom?.capacity) {
      toast.error('Cannot add more registrations than room capacity');
      return;
    }

    try {
      const registrationPayload: Partial<DormRoomRegistration> = {
        student_id: Number(registrationFormValues.student_id),
        dorm_room_id: dormRoomId,
        start_date: registrationFormValues.start_date,
        end_date: registrationFormValues.end_date,
      };

      await createDormRoomRegistration(registrationPayload).unwrap();
      toast.success('Student registered successfully');
      refetchRegistrations();
    } catch (error) {
      toast.error('Failed to register student');
    }
  };

  const handleDeleteRegistration = async (id: number) => {
    try {
      await deleteDormRoomRegistration(id).unwrap();
      toast.success('Registration deleted successfully');
      refetchRegistrations();
    } catch (error) {
      toast.error('Failed to delete registration');
    }
  };

  const registrationColumns = [
    { header: 'Student ID', accessor: 'student_id' },
    { header: 'Dorm Room ID', accessor: 'dorm_room_id' },
    { header: 'Start Date', accessor: 'start_date' },
    { header: 'End Date', accessor: 'end_date' },
    { header: 'Status', accessor: 'status' },
  ];

  const registrationActions = (registration: DormRoomRegistration) => (
    <div className={styles.actions}>
      <button onClick={() => console.log('Edit', registration.id)}>Edit</button>
      <button onClick={() => handleDeleteRegistration(registration.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        {dormRoom ? (
          <>
            <h1>Dorm Room Details</h1>
            <p><strong>Room Number:</strong> {dormRoom.room_number}</p>
            <p><strong>Capacity:</strong> {dormRoom.capacity}</p>
            <p><strong>Available Beds:</strong> {dormRoom.available_beds}</p>
            <p><strong>Floor:</strong> {dormRoom.floor}</p>
            <p><strong>Description:</strong> {dormRoom.description}</p>

            <div className={styles.registrationForm}>
              <h2>Register a Student</h2>
              <input
                type="number"
                placeholder="Student ID"
                value={registrationFormValues.student_id}
                onChange={(e) => setRegistrationFormValues({ ...registrationFormValues, student_id: e.target.value })}
              />
              <input
                type="date"
                placeholder="Start Date"
                value={registrationFormValues.start_date}
                onChange={(e) => setRegistrationFormValues({ ...registrationFormValues, start_date: e.target.value })}
              />
              <input
                type="date"
                placeholder="End Date"
                value={registrationFormValues.end_date}
                onChange={(e) => setRegistrationFormValues({ ...registrationFormValues, end_date: e.target.value })}
              />
              <button onClick={handleAddRegistration}>Register Student</button>
            </div>

            <div className={styles.registrationTable}>
              <h2>Registrations</h2>
              <Table columns={registrationColumns} data={roomRegistrations} actions={registrationActions} />
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </AdminLayout>
  );
};

export default DormRoomDetailsPage;
