import { useParams } from 'react-router-dom';
import { useGetInstructorByIdQuery } from '../../../features/api/instructorsApi';
import { useGetUserByIdQuery } from '../../../features/api/usersApi';
import { useGetCoursesAssignedToInstructorQuery } from '../../../features/api/coursesApi';
import AdminLayout from '../AdminLayout';
import Table from '../../../components/Table/Table'; 
import styles from '../StudentDetails/StudentDetails.module.css'
import defaultProfile from '../../../assets/images/profileImage.jpg';
import Spinner from '../../../components/Spinner/Spinner';
import { useGetDepartmentByIdQuery } from '../../../features/api/departmentsApi';
import { useAddSalaryPaymentMutation, useDeleteSalaryPaymentMutation, useGetSalaryPaymentsQuery } from '../../../features/api/salaryPaymentsApi'; 
import { useState } from 'react';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../../../components/DialogAndToast/ConfirmationDialog';
import { toASCII } from 'punycode';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';

const InstructorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const instructorId = parseInt(id!, 10);

  const { data: instructor, isLoading: instructorLoading, error: instructorError } = useGetInstructorByIdQuery(instructorId);
  const userId = instructor?.user_id;
  const { data: user, isLoading: userLoading, error: userError } = useGetUserByIdQuery(userId || -1);
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useGetCoursesAssignedToInstructorQuery(instructorId);
  const { data: department } = useGetDepartmentByIdQuery(instructor?.department_id);
  const { data: salaryPayments, isLoading: salaryPaymentsLoading, refetch: refetchPayments } = useGetSalaryPaymentsQuery();
  const [addSalaryPayment] = useAddSalaryPaymentMutation();
  const [deleteSalaryPayment] = useDeleteSalaryPaymentMutation();

  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_date: '',
  });

  if (instructorLoading || userLoading || coursesLoading || salaryPaymentsLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (instructorError || userError || coursesError) return <p>User is deleted from the system!</p>;

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      await addSalaryPayment({
        amount: parseFloat(paymentData.amount),
        payment_date: paymentData.payment_date,
        recipient_id: userId,
        recipient_type: 'Instructor',
      });
      refetchPayments();
      toast.success('Payment Added Successfully!')
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    const isConfirmed = await ConfirmationDialog('Are you sure?', 'You are about to delete this!');
    if (isConfirmed) {
      await deleteSalaryPayment(paymentId);
    }
    toast.success('Payment Deleted Successfully!');
    refetchPayments();
  };

  const salaryColumns = [
    { header: 'Amount', accessor: 'amount' },
    { header: 'Payment Date', accessor: 'payment_date' },
  ];

  const filteredSalaryPayments = salaryPayments?.filter(payment => payment.recipient_id === userId);

  const columns = [
    { header: 'Course Code', accessor: 'course_code' },
    { header: 'Course Name', accessor: 'course_name' },
    { header: 'Campus', accessor: 'campus_name' },
    { header: 'Semester', accessor: 'semester_name' },
    { header: 'Room', accessor: 'room' },
    { header: 'Schedule', accessor: 'schedule' },
  ];

  const actions = (date: any) => (
    <div className={styles.actions}>
      <button onClick={() => handleDeletePayment(date.id)}>Delete</button>
    </div>
  );

  return (
    <AdminLayout>
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
                <p><strong>Department:</strong> {department?.name}</p>
                <p><strong>Specialization:</strong> {instructor.specialization}</p>
                <p><strong>Salary:</strong> {instructor.salary}</p>
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
        <div className={styles.salaryPaymentsSection} style={{ marginTop: '4rem' }}>
          <h2 className={styles.headingSecondary}>Salary Payments</h2>
          {filteredSalaryPayments && filteredSalaryPayments.length > 0 ? (
            <Table columns={salaryColumns} data={filteredSalaryPayments} actions={actions} />
          ) : (
            <p>No salary payments available for this instructor.</p>
          )}

          <div className={styles.paymentForm} style={{marginTop: "5rem"}}>
            <h3 className={styles.headingSecondary}>Add New Payment</h3>
            <form className={styles.uploadForm} onSubmit={handlePaymentSubmit}>
              <div>
                <label style={{marginRight: "2rem"}}>Amount:
                <input
                  type="number"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handlePaymentChange}
                  required
                />
                </label>
                <label style={{marginRight: "2rem"}}>Payment Date:
                <input
                  type="date"
                  name="payment_date"
                  value={paymentData.payment_date}
                  onChange={handlePaymentChange}
                  required
                />
                </label>
              <button className={styles.submitButton} type="submit">Add Payment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastNotifications />
    </AdminLayout>
  );
};

export default InstructorDetails;
