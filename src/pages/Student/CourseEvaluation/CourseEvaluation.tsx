import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CourseEvaluations.module.css';
import { useCreateCourseEvaluationMutation } from '../../../features/api/courseEvaluationsApi';
import StudentLayout from '../StudentLayout';
import { toast } from 'react-toastify';
import ToastNotifications from '../../../components/DialogAndToast/ToastNotification';

const CourseEvaluationsPage = () => {
  const { id } = useParams();
  const [createCourseEvaluation] = useCreateCourseEvaluationMutation();
  const [evaluation, setEvaluation] = useState({
    teaching_number: 0,
    teaching: '',
    coursecontent_number: 0,
    coursecontent: '',
    examination_number: 0,
    examination: '',
    labwork_number: 0,
    labwork: '',
    library_facilities_number: 0,
    library_facilities: '',
    extracurricular_number: 0,
    extracurricular: '',
    course_instructor_id: id || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourseEvaluation(evaluation).unwrap();
      toast.success('Course Evaluation submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit evaluation');
    }
  };

  return (
    <StudentLayout>
      <div className={styles.layout}>
        <div className={styles.heading}>
          <h1 className={styles.headingPrimary}>Course Evaluation</h1>
        </div>
        <div className={styles.container}>
          <h2 className={styles.headingPrimary}>Evaluate Your Course</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            {['teaching', 'coursecontent', 'examination', 'labwork', 'library_facilities', 'extracurricular'].map((feature) => (
              <div key={feature} className={styles.formGroup}>
                <h3 className={styles.featureTitle}>
                  {feature.split('_').map((word, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ' '}
                      {word.charAt(0).toUpperCase() + word.slice(1)}
                    </React.Fragment>
                  ))}
                </h3>
                <p className={styles.featureDescription}>
                  Please rate the quality of the {feature.replace('_', ' ')} in the course.
                  Choose "Good", "Average", or "Bad" and provide any additional comments.
                </p>
                <div className={styles.radioGroup}>
                  <label>
                    <input
                      type="radio"
                      name={`${feature}_number`}
                      value={1}
                      checked={evaluation[`${feature}_number`] === '1'}
                      onChange={handleChange}
                    />
                    Good
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`${feature}_number`}
                      value={0}
                      checked={evaluation[`${feature}_number`] === '0'}
                      onChange={handleChange}
                    />
                    Average
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`${feature}_number`}
                      value={-1}
                      checked={evaluation[`${feature}_number`] === '-1'}
                      onChange={handleChange}
                    />
                    Bad
                  </label>
                </div>
                <textarea
                  name={feature}
                  value={evaluation[feature]}
                  onChange={handleChange}
                  placeholder={`Enter comments for ${feature.replace('_', ' ')}`}
                  rows="4"
                  className={styles.textarea}
                />
              </div>
            ))}
            <button type="submit" className={styles.submitButton}>Submit Evaluation</button>
          </form>
        </div>
      </div>
      <ToastNotifications />
    </StudentLayout>
  );
};

export default CourseEvaluationsPage;
