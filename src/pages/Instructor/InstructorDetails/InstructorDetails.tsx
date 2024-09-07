import { useSelector } from 'react-redux'; 
import { useGetInstructorByUserIdQuery } from '../../../features/api/instructorsApi';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi';
import { useGetDepartmentByIdQuery } from '../../../features/api/departmentsApi'; 
import Table from '../../../components/Table/Table'; 
import styles from '../../Student/StudentDetails/StudentDetails.module.css'; 
import defaultProfile from '../../../assets/images/profileImage.jpg';
import InstructorLayout from '../InstructorLayout';
import Spinner from '../../../components/Spinner/Spinner';

const InstructorDetails: React.FC = () => {
  const auth = useSelector((state: any) => state.auth);
  const userId = auth?.user?.id; 

  const { data: instructor, isLoading: instructorLoading, error: instructorError } = useGetInstructorByUserIdQuery(userId || -1);
  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId || -1);

  const instructorId = instructor?.id;
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useGetCoursesAssignedToInstructorQuery(instructorId || -1);

  const { data: department, isLoading: departmentLoading, error: departmentError } = useGetDepartmentByIdQuery(instructor?.department_id || -1);

  if (instructorLoading || userLoading || coursesLoading || departmentLoading) return <InstructorLayout><Spinner /></InstructorLayout>;
  if (instructorError || userError || coursesError || departmentError) return <p>User is deleted from the system!</p>;

  const columns = [
    { header: 'Course Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Campus', accessor: 'campus_name' },
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Room', accessor: 'room' },
    { header: 'Schedule', accessor: 'schedule' },
  ];

  return (
    <InstructorLayout>
      <div className={styles.studentDetailsContainer}>
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
                <p><strong>Department:</strong> {department?.name || 'N/A'}</p>
                <p><strong>Specialization:</strong> {instructor.specialization}</p>
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
    </InstructorLayout>
  );
};

export default InstructorDetails;
