import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetPredictionMutation,
  useGetCoursePerformanceOverviewMutation,
  useGetBenchmarkComparisonDiagramMutation,
} from '../../../features/api/performanceApi';
import AdminLayout from '../AdminLayout';
import Spinner from '../../../components/Spinner/Spinner';

const CourseInstructorDetails = () => {
  const { id: course_instructor_id } = useParams();

  const [getPrediction, { data: prediction, error: predictError, isLoading: predictLoading }] = useGetPredictionMutation();
  const [getCoursePerformanceOverview, { data: performanceOverviewBlob, error: overviewError, isLoading: overviewLoading }] = useGetCoursePerformanceOverviewMutation();
  const [getBenchmarkComparisonDiagram, { data: benchmarkDiagramBlob, error: benchmarkError, isLoading: benchmarkLoading }] = useGetBenchmarkComparisonDiagramMutation();

  React.useEffect(() => {
    if (course_instructor_id) {
      getPrediction(course_instructor_id);
      getCoursePerformanceOverview(course_instructor_id);
      getBenchmarkComparisonDiagram(course_instructor_id);
    }
  }, [course_instructor_id, getPrediction, getCoursePerformanceOverview, getBenchmarkComparisonDiagram]);

  if (predictLoading || overviewLoading || benchmarkLoading) return <Spinner />;
  if (predictError || overviewError || benchmarkError) return <div>Error loading data</div>;

  const performanceOverviewUrl = performanceOverviewBlob ? URL.createObjectURL(performanceOverviewBlob) : null;
  const benchmarkDiagramUrl = benchmarkDiagramBlob ? URL.createObjectURL(benchmarkDiagramBlob) : null;

  return (
    <AdminLayout>
      <h1>Test Endpoints</h1>

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
