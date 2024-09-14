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
          <table className={styles.studentDetailsTable}>
            <tbody>
              <tr>
                <td rowSpan={2} className={styles.profilePictureCell}>
                  <img
                    src={user.profile_picture || defaultProfile}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                </td>
                <td>
                  <strong>ID:</strong> {instructor?.id}
                </td>
                <td>
                  <strong>Email:</strong> {user?.email}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Name:</strong> {user?.first_name} {user?.middle_name || ''} {user?.last_name}
                </td>
                <td>
                  <strong>Phone:</strong> {user?.phone_number || 'N/A'}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Date of Birth:</strong> {user?.date_of_birth ? new Date(user?.date_of_birth).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <strong>Nationality:</strong> {user?.nationality || 'N/A'}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Country Of Birth:</strong> {user?.country_of_birth || 'N/A'}
                </td>
                <td>
                  <strong>Gender:</strong> {user?.gender || 'N/A'}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Marital Status:</strong> {user?.marital_status}
                </td>
                <td>
                  <strong>Specialization:</strong> {instructor?.specialization || 'N/A'}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Address:</strong> {user?.address || 'N/A'}
                </td>
                <td>
                  <strong>Marital Status:</strong> {user?.marital_status || 'N/A'}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Second Nationality:</strong> {user?.second_nationality || 'N/A'}
                </td>
                <td>
                  <strong>Salary:</strong> {instructor?.salary || 'N/A'}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Department:</strong> {department?.name || 'N/A'}
                </td>
                <td>
                  <strong>Emergency Contact:</strong> {user?.emergency_contact_number || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No instructor data found.</p>
        )}

        <div className={styles.coursesSection} style={{ marginTop: '4rem' }}>
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
