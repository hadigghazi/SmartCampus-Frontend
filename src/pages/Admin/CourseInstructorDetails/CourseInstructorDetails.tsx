import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetPredictionMutation,
  useGetCoursePerformanceOverviewMutation,
  useGetBenchmarkComparisonDiagramMutation,
} from '../../../features/api/performanceApi';
import { useGetInstructorByCourseInstructorQuery, useGetCourseDetailsByInstructorIdQuery } from '../../../features/api/coursesApi'; 
import AdminLayout from '../AdminLayout';
import Spinner from '../../../components/Spinner/Spinner';

const CourseInstructorDetails = () => {
  const { id: course_instructor_id } = useParams();

  const [getPrediction, { data: prediction, error: predictError, isLoading: predictLoading }] = useGetPredictionMutation();
  const [getCoursePerformanceOverview, { data: performanceOverviewBlob, error: overviewError, isLoading: overviewLoading }] = useGetCoursePerformanceOverviewMutation();
  const [getBenchmarkComparisonDiagram, { data: benchmarkDiagramBlob, error: benchmarkError, isLoading: benchmarkLoading }] = useGetBenchmarkComparisonDiagramMutation();

  const { data: instructorData, error: instructorError, isLoading: instructorLoading } = useGetInstructorByCourseInstructorQuery(course_instructor_id);
  const { data: courseData, error: courseError, isLoading: courseLoading } = useGetCourseDetailsByInstructorIdQuery(course_instructor_id);

  React.useEffect(() => {
    if (course_instructor_id) {
      getPrediction(course_instructor_id);
      getCoursePerformanceOverview(course_instructor_id);
      getBenchmarkComparisonDiagram(course_instructor_id);
    }
  }, [course_instructor_id, getPrediction, getCoursePerformanceOverview, getBenchmarkComparisonDiagram]);

  if (predictLoading || overviewLoading || benchmarkLoading || instructorLoading || courseLoading) return <Spinner />;
  if (predictError || overviewError || benchmarkError || instructorError || courseError) return <div>Error loading data</div>;

  const performanceOverviewUrl = performanceOverviewBlob ? URL.createObjectURL(performanceOverviewBlob) : null;
  const benchmarkDiagramUrl = benchmarkDiagramBlob ? URL.createObjectURL(benchmarkDiagramBlob) : null;

  return (
    <AdminLayout>
      <h1>Course and Instructor Details Report</h1>

      <section>
        <h2>Course Details</h2>
        <div><strong>Course Code:</strong> {courseData?.course_code}</div>
        <div><strong>Course Name:</strong> {courseData?.course_name}</div>
        <div><strong>Description:</strong> {courseData?.description}</div>
        <div><strong>Credits:</strong> {courseData?.credits}</div>
        <div><strong>Major:</strong> {courseData?.major_name}</div>
        <div><strong>Faculty:</strong> {courseData?.faculty_name}</div>
        <div><strong>Semester:</strong> {courseData?.semester_name}</div>
        <div><strong>Capacity:</strong> {courseData?.capacity}</div>
        <div><strong>Campus:</strong> {courseData?.campus_name}</div>
        <div><strong>Schedule:</strong> {courseData?.schedule}</div>
        <div><strong>Room Number:</strong> {courseData?.room_number}</div>
        <div><strong>Block Name:</strong> {courseData?.block_name}</div>
      </section>

      <section>
        <h2>Instructor Details</h2>
        <div><strong>Instructor Name:</strong> {`${instructorData?.first_name} ${instructorData?.middle_name} ${instructorData?.last_name}`}</div>
        <div><strong>Profile Picture:</strong>
          <img src={instructorData?.profile_picture} alt="Instructor" style={{ width: '100px', height: '100px' }} />
        </div>
        <div><strong>Specialization:</strong> {instructorData?.specialization}</div>
        <div><strong>Department:</strong> {instructorData?.department_name}</div>
      </section>

      <div>
        <h2>Prediction</h2>
        <p>Prediction: {prediction?.prediction}</p>
      </div>

      <div>
        <h2>Course Performance Overview</h2>
        {performanceOverviewUrl && (
          <img src={performanceOverviewUrl} alt="Course Performance Overview" />
        )}
      </div>

      <div>
        <h2>Benchmark Comparison Diagram</h2>
        {benchmarkDiagramUrl && (
          <img src={benchmarkDiagramUrl} alt="Benchmark Comparison Diagram" />
        )}
      </div>
    </AdminLayout>
  );
};

export default CourseInstructorDetails;
