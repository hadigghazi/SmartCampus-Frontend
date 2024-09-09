import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  useCreateBusRegistrationMutation,
  useDeleteBusRegistrationMutation,
  useGetBusRouteByIdQuery,
  useGetRegistrationsForBusRouteQuery,
  useUpdateBusRegistrationMutation,
} from '../../../features/api/busesApi';
import Table from '../../../components/Table/Table';
import { BusRegistration } from '../../../features/api/types';
import { toast } from 'react-toastify';
import AdminLayout from '../AdminLayout';
import styles from '../CourseDetails/CourseDetails.module.css';
import Spinner from '../../../components/Spinner/Spinner';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';

const BusRouteDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const busRouteId = Number(id);

  const { data: busRoute } = useGetBusRouteByIdQuery(busRouteId);
  const { data: busRegistrations = [], refetch: refetchRegistrations } = useGetRegistrationsForBusRouteQuery(busRouteId);
  const [createBusRegistration] = useCreateBusRegistrationMutation();
  const [deleteBusRegistration] = useDeleteBusRegistrationMutation();
  const [updateBusRegistration] = useUpdateBusRegistrationMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<BusRegistration | null>(null);
  const [formValues, setFormValues] = useState({
    student_id: '',
    registration_date: '',
  });

  useEffect(() => {
    if (editingRegistration) {
      setFormValues({
        student_id: editingRegistration.student_id.toString(),
        registration_date: editingRegistration.registration_date,
      });
    } else {
      setFormValues({
        student_id: '',
        registration_date: '',
      });
    }
  }, [editingRegistration]);


  const handleAddRegistrationClick = () => {
    setEditingRegistration(null);
    setShowModal(true);
  };

  const handleEditRegistration = (registration: BusRegistration) => {
    setEditingRegistration(registration);
    setShowModal(true);
  };

  const handleSaveRegistration = async () => {
    try {
      const registrationPayload: Partial<BusRegistration> = {
        student_id: Number(formValues.student_id),
        bus_route_id: busRouteId,
        registration_date: formValues.registration_date,
      };

      if (editingRegistration) {
        await updateBusRegistration({
          id: editingRegistration.id,
          registration: registrationPayload,
        }).unwrap();
        toast.success('Registration updated successfully');
      } else {
        await createBusRegistration(registrationPayload).unwrap();
        toast.success('Registration created successfully');
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
        await deleteBusRegistration(id).unwrap();
        toast.success('Registration deleted successfully');
        refetchRegistrations();
      } catch (error) {
        toast.error('Failed to delete registration');
      }
    }
  };

  const registrationColumns = [
    { header: 'Student ID', accessor: 'student_id' },
    { header: 'Registration Date', accessor: 'registration_date' },
  ];

  const registrationActions = (registration: BusRegistration) => (
    <div className={styles.actions}>
      <button style={{ marginRight: '1rem' }} onClick={() => handleEditRegistration(registration)}>Edit</button>
      <button onClick={() => handleDeleteRegistration(registration.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
      <div className={styles.container}>
        {busRoute ? (
          <div className={styles.content}>
            <h1 className={styles.headingPrimary}>Bus Route Details</h1>
            <p className={styles.text}>Route Name: {busRoute.route_name}</p>
            <p className={styles.text}>Description: {busRoute.description}</p>
            <p className={styles.text}>Schedule: {busRoute.schedule}</p>
            <p className={styles.text}>Capacity: {busRoute.capacity}</p>

            <div style={{ marginTop: "5rem", marginBottom: "0rem" }} className={styles.header_container}>
              <h2 className={styles.headingSecondary}>Registrations</h2>
              <button className={styles.addButton} onClick={handleAddRegistrationClick}>Add Registration</button>
            </div>
            <Table columns={registrationColumns} data={busRegistrations} actions={registrationActions} />

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
                      Registration Date:
                      <input
                        type="date"
                        value={formValues.registration_date}
                        onChange={(e) => setFormValues({ ...formValues, registration_date: e.target.value })}
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

export default BusRouteDetailsPage;
