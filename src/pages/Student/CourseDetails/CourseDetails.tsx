import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchCourseMaterialsByInstructorQuery } from '../../../features/api/courseMaterialsApi';
import { useFetchAssignmentsByInstructorQuery } from '../../../features/api/assignmentsApi';
import { useGetCourseDetailsByInstructorIdQuery } from '../../../features/api/coursesApi';
import MaterialsList from '../../../components/MaterialsList/MaterialsList';
import AssignmentsList from '../../../components/AssignmentsList/AssignmentsList';
import styles from './CourseDetails.module.css';
import { useRequestDropMutation, useDeleteDropRequestMutation, useCheckDropRequestForStudentQuery } from '../../../features/api/courseDropRequestsApi';
import { useGeneratePracticeQuestionsMutation } from '../../../features/api/courseMaterialsApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentLayout from '../StudentLayout';

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
  const [dropRequestStatus, setDropRequestStatus] = useState<'Pending' | 'Approved' | null>(dropRequestData?.dropRequest?.status || null);
  
  const [practiceQuestions, setPracticeQuestions] = useState<string | null>(null);
  const [generatePracticeQuestions, { isLoading: isGenerating }] = useGeneratePracticeQuestionsMutation();

  useEffect(() => {
    setIsDropRequested(!!dropRequestData?.exists);
    setDropRequestStatus(dropRequestData?.dropRequest?.status || null);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('File:', file);
      const response = await generatePracticeQuestions(formData).unwrap();
      console.log('API Response:', response); 
      setPracticeQuestions(response.questions); 
      toast.success('Practice questions generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate practice questions.');
    }
  };
  
  return (
    <StudentLayout>
    <div className={styles.container}>
      {isCourseLoading ? (
        <p>Loading course details...</p>
      ) : (
        <>
          <h1 className={styles.headingPrimary}>{courseDetails?.course_name} ({courseDetails?.course_code})</h1>
        </>
      )}
      
      <MaterialsList materials={materials} />

      
      <div className={styles.practiceQuestionsContainer}>
        <h2 className={styles.headingSecondary}>- Generate Practice Questions</h2>
        
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.docx,.txt"
          disabled={isGenerating}
          className={styles.fileInput}
        />
        
        {isGenerating && <p>Generating questions...</p>}

        {practiceQuestions && (
          <div className={styles.questions}>
            <h3>Practice Questions:</h3>
            <pre>{practiceQuestions}</pre>
          </div>
        )}
      </div>
      

      <h2 className={styles.headingSecondary}>- Assignments</h2>
      <AssignmentsList 
        assignments={assignments || []}
        courseInstructorId={courseInstructorId}
        isInstructor={false}
      />

      <div className={styles.dropFormContainer}>
        <h2 className={styles.headingSecondary}>- Request to Drop Course</h2>
        {dropRequestStatus === 'Approved' ? (
          <p>Your drop request has been approved. If you wish to cancel it, please contact your instructor.</p>
        ) : isDropRequested ? (
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
    </StudentLayout>
  );
};

export default StudentCourseDetailsPage;
