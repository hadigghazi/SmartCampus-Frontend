import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteBusRouteMutation,
  useUpdateBusRouteMutation,
  useCreateBusRouteMutation,
  useGetBusRoutesQuery,
} from '../../../features/api/busesApi';
import { useGetCampusesQuery } from '../../../features/api/campusesApi'; 
import Table from '../../../components/Table/Table';
import { BusRoute } from '../../../features/api/types';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import AdminLayout from '../AdminLayout';
import styles from '../Courses/Courses.module.css';
import SearchInput from '../../../components/SearchInput/SearchInput';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage'; 
import Pagination from '../../../components/Pagination/Pagination';

const BusRoutesPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: busRoutesList = [], refetch: refetchBusRoutes } = useGetBusRoutesQuery();
  const { data: campusesList = [] } = useGetCampusesQuery(); 
  const [deleteBusRoute] = useDeleteBusRouteMutation();
  const [updateBusRoute] = useUpdateBusRouteMutation();
  const [createBusRoute] = useCreateBusRouteMutation();

  const [showBusRouteModal, setShowBusRouteModal] = useState(false);
  const [editingBusRoute, setEditingBusRoute] = useState<BusRoute | null>(null);
  const [formValues, setFormValues] = useState({
    route_name: '',
    description: '',
    schedule: '',
    capacity: '',
    campus_id: '',
  });

  const [searchText, setSearchText] = useState('');
  const [campusFilter, setCampusFilter] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (editingBusRoute) {
      setFormValues({
        route_name: editingBusRoute.route_name,
        description: editingBusRoute.description,
        schedule: editingBusRoute.schedule,
        capacity: editingBusRoute.capacity?.toString() || '',
        campus_id: editingBusRoute.campus_id?.toString() || '',
      });
    } else {
      setFormValues({
        route_name: '',
        description: '',
        schedule: '',
        capacity: '',
        campus_id: '',
      });
    }
  }, [editingBusRoute]);

  const handleEditBusRoute = (busRoute: BusRoute) => {
    setEditingBusRoute(busRoute);
    setShowBusRouteModal(true);
  };

  const handleDeleteBusRoute = async (id: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You won’t be able to revert this!');
    if (isConfirmed) {
      try {
        await deleteBusRoute(id).unwrap();
        toast.success('Bus route deleted successfully');
        refetchBusRoutes();
      } catch (error) {
        toast.error('Failed to delete bus route');
      }
    }
  };

  const handleSaveBusRoute = async () => {
    try {
      const busRoutePayload: Partial<BusRoute> = {
        route_name: formValues.route_name,
        description: formValues.description,
        schedule: formValues.schedule,
        capacity: formValues.capacity ? Number(formValues.capacity) : undefined,
        campus_id: formValues.campus_id ? Number(formValues.campus_id) : undefined,
      };

      if (editingBusRoute) {
        await updateBusRoute({ id: editingBusRoute.id, updatedBusRoute: busRoutePayload }).unwrap();
        toast.success('Bus route updated successfully');
      } else {
        await createBusRoute(busRoutePayload).unwrap();
        toast.success('Bus route created successfully');
      }
      setShowBusRouteModal(false);
      refetchBusRoutes();
    } catch (error) {
      toast.error('Failed to save bus route');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1); 
  };

  const handleCampusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCampusFilter(Number(e.target.value) || '');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); 
  };

  const filteredBusRoutes = busRoutesList.filter(busRoute =>
    busRoute.route_name.toLowerCase().includes(searchText.toLowerCase()) &&
    (campusFilter === '' || busRoute.campus_id === campusFilter)
  );

  const paginatedBusRoutes = filteredBusRoutes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredBusRoutes.length / pageSize);

  const getCampusNameById = (campusId: number) => {
    const campus = campusesList.find(c => c.id === campusId);
    return campus ? campus.name : 'Unknown';
  };

  const columns = [
    { header: 'Route Name', accessor: 'route_name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Schedule', accessor: 'schedule' },
    { header: 'Capacity', accessor: 'capacity' },
    { header: 'Campus', accessor: (busRoute: BusRoute) => getCampusNameById(busRoute.campus_id) },
  ];

  const actions = (busRoute: BusRoute) => (
    <div className={styles.actions}>
      <button style={{ marginRight: '1rem' }} onClick={() => navigate(`/admin/buses/${busRoute.id}`)}>View</button>
      <button style={{ marginRight: '1rem' }} onClick={() => handleEditBusRoute(busRoute)}>Edit</button>
      <button onClick={() => handleDeleteBusRoute(busRoute.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.container}>
        <h1 className={styles.headingPrimary}>Bus Routes</h1>
        <div className={styles.filters}>
          <SearchInput value={searchText} onChange={handleSearch} />
          <select value={campusFilter} onChange={handleCampusFilterChange} className={styles.selectField}>
            <option value="">Select Campus</option>
            {campusesList.map(campus => (
              <option key={campus.id} value={campus.id}>{campus.name}</option>
            ))}
          </select>
          <button onClick={() => setShowBusRouteModal(true)} className={styles.addButton}>Add Bus Route</button>
        </div>
        <EntriesPerPage value={pageSize} onChange={handleEntriesPerPageChange} />
        <Table
          columns={columns}
          data={paginatedBusRoutes}
          actions={actions}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {showBusRouteModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.headingSecondary}>{editingBusRoute ? 'Edit Bus Route' : 'Add Bus Route'}</h2>
              <form className={styles.form}>
                <label>
                  Route Name:
                  <input
                    type="text"
                    value={formValues.route_name}
                    onChange={(e) => setFormValues({ ...formValues, route_name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Description:
                  <textarea
                    value={formValues.description}
                    onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                    rows={4}
                  />
                </label>
                <label>
                  Schedule:
                  <input
                    type="text"
                    value={formValues.schedule}
                    onChange={(e) => setFormValues({ ...formValues, schedule: e.target.value })}
                  />
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    value={formValues.capacity}
                    onChange={(e) => setFormValues({ ...formValues, capacity: e.target.value })}
                  />
                </label>
                <label>
                  Campus:
                  <select
                    value={formValues.campus_id}
                    onChange={(e) => setFormValues({ ...formValues, campus_id: e.target.value })}
                    required
                  >
                    <option value="">Select Campus</option>
                    {campusesList.map(campus => (
                      <option key={campus.id} value={campus.id}>{campus.name}</option>
                    ))}
                  </select>
                </label>
                <div className={styles.btnContainer}>
                <button className={styles.rejectBtn} type="button" onClick={() => setShowBusRouteModal(false)}>Cancel</button>
                <button className={styles.acceptBtn} type="button" onClick={handleSaveBusRoute}>Save</button>
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

export default BusRoutesPage;
