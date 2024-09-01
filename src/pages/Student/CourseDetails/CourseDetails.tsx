import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCourseMaterialsByInstructorQuery } from '../../../features/api/courseMaterialsApi';
import { useFetchAssignmentsByInstructorQuery } from '../../../features/api/assignmentsApi';
import { useGetCourseDetailsByInstructorIdQuery } from '../../../features/api/coursesApi';
import MaterialsList from '../../../components/MaterialsList/MaterialsList';
import AssignmentsList from '../../../components/AssignmentsList/AssignmentsList';
import styles from './CourseDetails.module.css';
import { useRequestDropMutation, useDeleteDropRequestMutation, useCheckDropRequestForStudentQuery } from '../../../features/api/courseDropRequestsApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentCourseDetailsPage: React.FC = () => {
  const { courseInstructorId } = useParams<{ courseInstructorId: string }>();
  const { data: materials } = useFetchCourseMaterialsByInstructorQuery(Number(courseInstructorId));
  const { data: assignments } = useFetchAssignmentsByInstructorQuery(Number(courseInstructorId));
  const { data: courseDetails, isLoading: isCourseLoading } = useGetCourseDetailsByInstructorIdQuery(Number(courseInstructorId));

  const [requestDrop, { isLoading: isRequestingDrop }] = useRequestDropMutation();
  const [deleteDropRequest, { isLoading: isDeletingDrop }] = useDeleteDropRequestMutation();
  const { data: dropRequestData, refetch } = useCheckDropRequestForStudentQuery(Number(courseInstructorId));
  
  const [reason, setReason] = useState<string>('');
  const [isDropRequested, setIsDropRequested] = useState<boolean>(!!dropRequestData?.exists);

  useEffect(() => {
    setIsDropRequested(!!dropRequestData?.exists);
  }, [dropRequestData]);

  const handleDropRequest = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsDropRequested(true);

    try {
      await requestDrop({
        course_instructor_id: Number(courseInstructorId),
        reason,
      }).unwrap();
      toast.success('Drop request submitted successfully!');
      refetch(); 
    } catch (error) {
      setIsDropRequested(false);
      toast.error('Failed to submit drop request.');
    }
  };

  const handleCancelDropRequest = async () => {
    if (dropRequestData?.dropRequest?.id) {
      setIsDropRequested(false);

      try {
        await deleteDropRequest(dropRequestData.dropRequest.id).unwrap();
        toast.success('Drop request cancelled successfully!');
        refetch();
      } catch (error) {
        setIsDropRequested(true);
        toast.error('Failed to cancel drop request.');
      }
    }
  };

  return (
    <div className={styles.container}>
      {isCourseLoading ? (
        <p>Loading course details...</p>
      ) : (
        <>
          <h1 className={styles.headingPrimary}>{courseDetails?.course_name} ({courseDetails?.course_code})</h1>
        </>
      )}
      
      <MaterialsList materials={materials} />

      <h2 className={styles.headingSecondary}>- Assignments</h2>
      <AssignmentsList 
        assignments={assignments || []}
        courseInstructorId={courseInstructorId}
        isInstructor={false}
      />

      <div className={styles.dropFormContainer}>
        <h2 className={styles.headingSecondary}>Request to Drop Course</h2>
        {isDropRequested ? (
          <>
            <p>You have already requested to drop this course. Do you want to cancel the request?</p>
            <button
              onClick={handleCancelDropRequest}
              className={styles.cancelButton}
              disabled={isDeletingDrop}
            >
              {isDeletingDrop ? 'Cancelling...' : 'Cancel Drop Request'}
            </button>
          </>
        ) : (
          <form onSubmit={handleDropRequest} className={styles.dropForm}>
            <textarea
              placeholder="Enter the reason for dropping the course..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={styles.textarea}
              required
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isRequestingDrop}
            >
              {isRequestingDrop ? 'Submitting...' : 'Submit Drop Request'}
            </button>
          </form>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentCourseDetailsPage;
