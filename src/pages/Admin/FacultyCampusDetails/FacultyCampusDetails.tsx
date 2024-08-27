import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetFacultyByIdQuery } from '../../../features/api/facultiesApi';
import {
  useGetMajorsByFacultyAndCampusQuery,
  useAttachMajorToFacultyCampusMutation,
  useDetachMajorFromFacultyCampusMutation,
  useGetFacultyCampusIdQuery,
} from '../../../features/api/campusesApi';
import { useGetMajorsByFacultyQuery } from '../../../features/api/majorsApi';
import { useGetDeanByFacultyAndCampusQuery, useUpdateDeanMutation, useCreateDeanMutation } from '../../../features/api/deansApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table';
import SearchInput from '../../../components/SearchInput/SearchInput';
import Pagination from '../../../components/Pagination/Pagination';
import EntriesPerPage from '../../../components/EntriesPerPage/EntriesPerPage';
import DeanCard from '../../../components/DeanCard/DeanCard'; 
import styles from '../CourseDetails/CourseDetails.module.css';
import profilePicture from "../../../assets/images/profileImage.jpg";

const FacultyCampusDetails: React.FC = () => {
  const { campusId, id: facultyId } = useParams<{ campusId: string, id: string }>();
  const [facultyCampusId, setFacultyCampusId] = useState<number | null>(null);
  const { data: faculty, isLoading: facultyLoading, error: facultyError } = useGetFacultyByIdQuery(Number(facultyId));
  const { data: initialMajors, isLoading: majorsLoading, error: majorsError } = useGetMajorsByFacultyAndCampusQuery({
    facultyId: Number(facultyId),
    campusId: Number(campusId)
  });
  const { data: availableMajors } = useGetMajorsByFacultyQuery(Number(facultyId));
  const [attachMajorToFacultyCampus] = useAttachMajorToFacultyCampusMutation();
  const [detachMajorFromFacultyCampus] = useDetachMajorFromFacultyCampusMutation();
  const { data: facultyCampusData } = useGetFacultyCampusIdQuery({ facultyId: Number(facultyId), campusId: Number(campusId) });

  const [majors, setMajors] = useState<Major[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<number | ''>('');

  const { data: dean, isLoading: deanLoading } = useGetDeanByFacultyAndCampusQuery({ facultyId: Number(facultyId), campusId: Number(campusId) });
  const [updateDean] = useUpdateDeanMutation();
  const [createDean] = useCreateDeanMutation();
  const [isModalOpenDean, setModalOpenDean] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialMajors) {
      const mappedMajors = initialMajors.map((major: any) => ({
        id: major.major_id,
        name: major.major_name,
      }));
      setMajors(mappedMajors);
    }
  }, [initialMajors]);

  useEffect(() => {
    if (facultyCampusData) {
      setFacultyCampusId(facultyCampusData.faculty_campus_id);
    }
  }, [facultyCampusData]);

  useEffect(() => {
    if (dean) {
      setName(dean.name);
      setDescription(dean.role_description);
    }
  }, [dean]);

  const handleEditDean = async () => {
    if (dean) {
      try {
        await updateDean({ id: dean.id, name, role_description: description }).unwrap();
        setModalOpenDean(false);
      } catch (error) {
        console.error("Failed to update dean:", error);
      }
    }
  };

  const handleAddDean = async () => {
    try {
      await createDean({ name, role_description: description, faculty_id: Number(facultyId), campus_id: Number(campusId) }).unwrap();
      setModalOpenDean(false);
    } catch (error) {
      console.error("Failed to create dean:", error);
    }
  };


  const getAvailableMajors = () => {
    if (!availableMajors || !initialMajors) return [];

    const assignedMajorIds = initialMajors.map((major: any) => major.major_id);
    return availableMajors.filter((major) => !assignedMajorIds.includes(major.id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAttachMajor = async () => {
    if (selectedMajor && facultyCampusId !== null) {
      try {
        await attachMajorToFacultyCampus({
          major_id: Number(selectedMajor),
          faculty_campus_id: facultyCampusId,
        }).unwrap();

        const major = availableMajors?.find(m => m.id === Number(selectedMajor));
        if (major) {
          setMajors([...majors, major]);
        }
        setModalOpen(false);
        setSelectedMajor('');
      } catch (error) {
        console.error("Failed to attach major:", error);
        alert(`Failed to attach major: ${error.message || "An unexpected error occurred"}`);
      }
    }
  };

  const handleDetachMajor = async (majorId: number) => {
    if (facultyCampusId !== null) {
      try {
        await detachMajorFromFacultyCampus({
          major_id: majorId,
          faculty_campus_id: facultyCampusId,
        }).unwrap();

        setMajors(majors.filter(m => m.id !== majorId));
      } catch (error) {
        console.error("Failed to detach major:", error);
        alert(`Failed to detach major: ${error.message || "An unexpected error occurred"}`);
      }
    }
  };

  const filteredMajors = majors.filter(major =>
    major?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastMajor = currentPage * entriesPerPage;
  const indexOfFirstMajor = indexOfLastMajor - entriesPerPage;
  const currentMajors = filteredMajors.slice(indexOfFirstMajor, indexOfLastMajor);
  const totalPages = Math.ceil(filteredMajors.length / entriesPerPage);

  const columns = [
    { header: 'Major Name', accessor: 'name' as keyof Major },
    {
      header: 'Actions',
      accessor: (major: Major) => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/admin/majors/${major.id}`}>View</Link>
          <button onClick={() => handleDetachMajor(major.id)}>Remove</button>
        </div>
      ),
    },
  ];

  if (facultyLoading || majorsLoading || deanLoading) return <p>Loading...</p>;
  if (facultyError || majorsError) return <p>Something went wrong!</p>;

  return (
    <AdminLayout>
      {faculty && (
        <div className={styles.content}>
          <h1 className={styles.headingPrimary}>{faculty.name}</h1>
          <p className={styles.text}>{faculty.description}</p>

          <div className={styles.header_container}>
          <h3 className={styles.headingTertiary}>Available Majors</h3>
          <button onClick={() => setModalOpen(true)} className={styles.addButton}>
            Add Major
          </button>
        </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <SearchInput value={searchTerm} onChange={handleSearch} />
            <EntriesPerPage value={entriesPerPage} onChange={handleEntriesPerPageChange} />
          </div>
          {currentMajors.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Table columns={columns} data={currentMajors} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <p>No majors available for this faculty on this campus</p>
          )}
           <div className={styles.deanSection}>
            {dean ? (
              <>
                <button onClick={() => setModalOpenDean(true)} className={styles.addButton} style={{marginTop: "4rem"}}>
                  Edit Dean
                </button>
                <DeanCard
                  image={profilePicture}
                  name={dean.name}
                  description={dean.role_description}
                />
              </>
            ) : (
              <button onClick={() => setModalOpenDean(true)} className={styles.addButton} style={{marginTop: "4rem"}}>
                Add Dean
              </button>
            )}
          </div>
        </div>
        
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.headingSecondary}>Add Major</h2>
            <div className={styles.form}>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
            >
              <option value="">Select Major</option>
              {getAvailableMajors().map((major) => (
                <option key={major.id} value={major.id}>{major.name}</option>
              ))}
            </select>
            <div className={styles.btnContainer} style={{marginTop: "2rem"}}>
            <button onClick={handleAttachMajor} className={styles.acceptBtn}>Add</button>
            <button onClick={() => setModalOpen(false)} className={styles.rejectBtn}>Cancel</button>
            </div>
            </div>
          </div>
        </div>
      )}
       {isModalOpenDean && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2 className={styles.headingSecondary}>{dean ? 'Edit Dean' : 'Add Dean'}</h2>
                <div className={styles.form}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                  />
                  <textarea
                    placeholder="Role Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                  />
                  <div className={styles.btnContainer}>
                    <button
                      onClick={dean ? handleEditDean : handleAddDean}
                      className={styles.acceptBtn}
                    >
                      {dean ? 'Update' : 'Add'}
                    </button>
                    <button onClick={() => setModalOpen(false)} className={styles.rejectBtn}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
    </AdminLayout>
  );
};

export default FacultyCampusDetails;
