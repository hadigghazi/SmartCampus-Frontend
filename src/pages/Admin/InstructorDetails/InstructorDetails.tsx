import { useParams } from 'react-router-dom';
import { useGetInstructorByIdQuery } from '../../../features/api/instructorsApi';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi'; // Import the query
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table'; 
import styles from './InstructorDetails.module.css'; 
import defaultProfile from '../../../assets/images/profileImage.jpg';

const InstructorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const instructorId = parseInt(id!, 10);

  const { data: instructor, isLoading: instructorLoading, error: instructorError } = useGetInstructorByIdQuery(instructorId);
  const userId = instructor?.user_id;
  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId || -1);
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useGetCoursesAssignedToInstructorQuery(instructorId);

  if (instructorLoading || userLoading || coursesLoading) return <p>Loading...</p>;
  if (instructorError || userError || coursesError) return <p>User is deleted from the system!</p>;

  const columns = [
    { header: 'Course Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Campus', accessor: 'campus_name' },
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Room', accessor: 'room' },
    { header: 'Schedule', accessor: 'schedule' },
  ];

  return (
    <AdminLayout>
      <div className={styles.instructorDetailsContainer}>
        <h1 className={styles.headingPrimary}>Instructor Details</h1>
        {user && instructor ? (
          <div className={styles.detailsWrapper}>
            <div className={styles.profileCard}>
              <div className={styles.profilePicture}>
                <img src={user.profile_picture || defaultProfile} alt="Profile" />
              </div>
              <div className={styles.profileInfo}>
                <p><strong>ID:</strong> {instructor.id}</p>
                <p><strong>Name:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone_number || 'N/A'}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Date of Birth:</strong> {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Nationality:</strong> {user.nationality}</p>
                <p><strong>Country of Birth:</strong> {user.country_of_birth}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Marital Status:</strong> {user.marital_status}</p>
              </div>
            </div>
            <div className={styles.instructorCard}>
              <h2 className={styles.headingSecondary}>More Details</h2>
              <div className={styles.instructorInfo}>
                <p><strong>Department ID:</strong> {instructor.department_id}</p>
                <p><strong>Specialization:</strong> {instructor.specialization}</p>
                <p><strong>Created At:</strong> {instructor.created_at ? new Date(instructor.created_at).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Updated At:</strong> {instructor.updated_at ? new Date(instructor.updated_at).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Deleted At:</strong> {instructor.deleted_at ? new Date(instructor.deleted_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No instructor data found.</p>
        )}

        <div className={styles.coursesSection} style={{marginTop: "4rem"}}>
          <h2 className={styles.headingSecondary}>Assigned Courses</h2>
          {courses && courses.length > 0 ? (
            <Table columns={columns} data={courses} />
          ) : (
            <p>No courses assigned to this instructor.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InstructorDetails;
