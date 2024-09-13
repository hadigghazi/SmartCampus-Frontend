import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGetPredictionMutation, useGetCoursePerformanceOverviewMutation, useGetBenchmarkComparisonDiagramMutation } from '../../../features/api/performanceApi';
import { useGetInstructorByCourseInstructorQuery, useGetCourseDetailsByInstructorIdQuery, useAnalyzeCourseInstructorMutation } from '../../../features/api/coursesApi'; 
import AdminLayout from '../AdminLayout';
import Spinner from '../../../components/Spinner/Spinner';
import { useGetCourseEvaluationsByInstructorQuery } from '../../../features/api/courseEvaluationsApi';
import styles from './CourseInstructorDetails.module.css'; 
import html2pdf from 'html2pdf.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faChartLine } from '@fortawesome/free-solid-svg-icons';
import defaultProfileImage from '../../../assets/images/profileImage.jpg'; 

const transformEvaluation = (evaluation) => {
  const numberToText = (number) => {
    switch (number) {
      case 1:
        return 'Good';
      case -1:
        return 'Bad';
      case 0:
        return 'Average';
      default:
        return '';
    }
  };

  return {
    ...evaluation,
    teaching: `${numberToText(evaluation.teaching_number)} - ${evaluation.teaching}`,
    coursecontent: `${numberToText(evaluation.coursecontent_number)} - ${evaluation.coursecontent}`,
    examination: `${numberToText(evaluation.examination_number)} - ${evaluation.examination}`,
    labwork: `${numberToText(evaluation.labwork_number)} - ${evaluation.labwork}`,
    library_facilities: `${numberToText(evaluation.library_facilities_number)} - ${evaluation.library_facilities}`,
    extracurricular: `${numberToText(evaluation.extracurricular_number)} - ${evaluation.extracurricular}`,
  };
};

const CourseInstructorDetails = () => {
  const { id: course_instructor_id } = useParams();
  const pdfContentRef = useRef(null);
  
  const [getPrediction, { data: prediction, error: predictError, isLoading: predictLoading }] = useGetPredictionMutation();
  const [getCoursePerformanceOverview, { data: performanceOverviewBlob, error: overviewError, isLoading: overviewLoading }] = useGetCoursePerformanceOverviewMutation();
  const [getBenchmarkComparisonDiagram, { data: benchmarkDiagramBlob, error: benchmarkError, isLoading: benchmarkLoading }] = useGetBenchmarkComparisonDiagramMutation();
  const [analyzeCourseInstructor, { data: analysis, isLoading: analyzeLoading }] = useAnalyzeCourseInstructorMutation();

  const { data: instructorData, error: instructorError, isLoading: instructorLoading } = useGetInstructorByCourseInstructorQuery(course_instructor_id);
  const { data: courseData, error: courseError, isLoading: courseLoading } = useGetCourseDetailsByInstructorIdQuery(course_instructor_id);
  const { data: evaluations, error: evaluationsError, isLoading: evaluationsLoading } = useGetCourseEvaluationsByInstructorQuery(course_instructor_id);

  React.useEffect(() => {
    if (course_instructor_id) {
      getPrediction(course_instructor_id);
      getCoursePerformanceOverview(course_instructor_id);
      getBenchmarkComparisonDiagram(course_instructor_id);
    }
  }, [course_instructor_id, getPrediction, getCoursePerformanceOverview, getBenchmarkComparisonDiagram]);

  const handleAnalyzeClick = async () => {
    if (prediction?.prediction) {
      try {
        await analyzeCourseInstructor({ course_instructor_id, status: prediction.prediction }).unwrap();
      } catch (err) {
        console.error('Failed to analyze the course: ', err);
      }
    }
  };

  const formatAnalysisResponse = (text: any) => {
    if (typeof text !== 'string') {
      console.error("Expected a string, but received:", text);
      return ''; 
    }
    return text.replace(/#### /g, '<h4>')
      .replace(/### /g, '<h3>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />')
      .replace(/<\/p><p>/g, '</p><p>')
      .replace(/<p><br \/>/g, '<p>')
      .replace(/<\/p><p>$/g, '</p>')
      .replace(/## /g, '<h2>')
      .replace(/# /g, '<h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  if (predictLoading || overviewLoading || benchmarkLoading || instructorLoading || courseLoading || evaluationsLoading ) return <Spinner />;
  if (instructorError || courseError ) return <div>Error loading data</div>;

  const performanceOverviewUrl = performanceOverviewBlob ? URL.createObjectURL(performanceOverviewBlob) : null;
  const benchmarkDiagramUrl = benchmarkDiagramBlob ? URL.createObjectURL(benchmarkDiagramBlob) : null;

  const getBase64Image = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (err) => reject(err);
    });
  };
  
  const downloadPdf = async () => {
    const element = pdfContentRef.current;
    if (element) {
      const profileImageBase64 = await getBase64Image(defaultProfileImage);
  
      const instructorImage = instructorData?.profile_picture || profileImageBase64;
  
      const options = {
        margin: [1, 1, 1, 1],
        filename: `${courseData?.course_code}_${courseData?.course_name}_${instructorData?.first_name}${instructorData?.middle_name}${instructorData?.last_name}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: {
          unit: 'px',
          format: [element.offsetWidth, 842],
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
  
      html2pdf().from(element).set(options).save();
    }
  };
  
  return (
    <AdminLayout requiredAdminType='Super Admin'>
      <div className={styles.buttonContainer}>
        <button onClick={downloadPdf}>
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
        <button onClick={handleAnalyzeClick} disabled={analyzeLoading || !prediction?.prediction}>
            <FontAwesomeIcon icon={faChartLine} />
        </button>
      </div>
      <div ref={pdfContentRef} className={styles.container}>
        <h1>Course Details Report</h1>
        <section className={styles.section}>
          <h2>Course Details</h2>
          <div className={styles.details}>
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
          </div>
        </section>

        <section className={styles.section}>
  <h2>Instructor Details</h2>
  <div className={styles.instructorContainer}>
    <div className={styles.imageContainer}>
    <img
  src={instructorData?.profile_picture || defaultProfileImage}
  alt="Instructor"
  className={styles.profileImage}
  onError={(e) => { e.target.src = defaultProfileImage; }} 
/>
    </div>
    <div className={styles.detailsContainer}>
      <div className={styles.name}>
        {`${instructorData?.first_name} ${instructorData?.middle_name} ${instructorData?.last_name}`}
      </div>
      <div className={styles.specialization}>
        <strong>Specialization:</strong> {instructorData?.specialization}
      </div>
      <div className={styles.department}>
        <strong>Department:</strong> {instructorData?.department_name}
      </div>
    </div>
  </div>
</section>
        <section className={styles.section}>
          <h2>Course Status</h2>
          {prediction && (
            <div className={styles.predictionText}>
              The Course Was {prediction.prediction}.
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Performance Overview</h2>
          {performanceOverviewUrl && (
            <div>
              <img src={performanceOverviewUrl} alt="Performance Overview" />
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Benchmark Comparison</h2>
          {benchmarkDiagramUrl && (
            <div>
              <img src={benchmarkDiagramUrl} alt="Benchmark Comparison Diagram" />
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2>Course Evaluations</h2>
          <ul>
            {evaluations?.map((evaluation, index) => {
              const transformedEvaluation = transformEvaluation(evaluation);
              return (
                <li key={index}>
                  <strong>Evaluation {index + 1}</strong>
                  <p><strong>Teaching:</strong> {transformedEvaluation.teaching}</p>
                  <p><strong>Course Content:</strong> {transformedEvaluation.coursecontent}</p>
                  <p><strong>Examination:</strong> {transformedEvaluation.examination}</p>
                  <p><strong>Lab Work:</strong> {transformedEvaluation.labwork}</p>
                  <p><strong>Library Facilities:</strong> {transformedEvaluation.library_facilities}</p>
                  <p><strong>Extracurricular:</strong> {transformedEvaluation.extracurricular}</p>
                </li>
              );
            })}
          </ul>
        </section>
        
        <section className={styles.section}>
          <h2>Analysis Report</h2>
          <div dangerouslySetInnerHTML={{ __html: formatAnalysisResponse(analysis?.analysis || '') }} className={styles.analysis} />
        </section>
      </div>
    </AdminLayout>
  );
};

export default CourseInstructorDetails;
