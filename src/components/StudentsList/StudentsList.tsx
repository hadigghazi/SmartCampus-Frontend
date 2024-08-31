import React, { useState, useEffect } from 'react';
import { useAddGradeMutation, useUpdateGradeMutation, useGetGradesByInstructorQuery } from '../../features/api/gradesApi'; 
import styles from './StudentsList.module.css';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify for toasts
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toasts

type Student = {
  student_id: number;
  profile_picture: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
};

type StudentsListProps = {
  students: Student[];
  courseInstructorId: number;
};

const StudentsList: React.FC<StudentsListProps> = ({ students, courseInstructorId }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [grade, setGrade] = useState<number | ''>('');
  const [grades, setGrades] = useState<{ [studentId: number]: any }>({});
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [updateGrade] = useUpdateGradeMutation();
  const [addGrade] = useAddGradeMutation();

  const { data: fetchedGrades, refetch: refetchGrades } = useGetGradesByInstructorQuery(courseInstructorId, {
    skip: false
  });

  useEffect(() => {
    if (fetchedGrades) {
      const gradesMap = fetchedGrades.reduce((acc: { [key: number]: any }, grade) => {
        acc[grade.student_id] = grade;
        return acc;
      }, {});
      setGrades(gradesMap);
    }
  }, [fetchedGrades]);

  const handleAddGrade = async (studentId: number) => {
    if (grade === '') return;

    try {
      await addGrade({
        student_id: studentId,
        course_instructor_id: courseInstructorId,
        grade: Number(grade),
      }).unwrap();
      toast.success('Grade added successfully');
      setGrade('');
      setSelectedStudentId(null); 
      refetchGrades();
    } catch (error) {
      console.error('Failed to add grade:', error);
      toast.error('Failed to add grade: ' + (error.data?.message || error.error));
    }
  };

  const handleUpdateGrade = async (studentId: number) => {
    if (editingGrade === null || grade === '') return;

    try {
      await updateGrade({
        id: grades[studentId].id,
        student_id: studentId,
        course_instructor_id: courseInstructorId,
        grade: Number(grade),
      }).unwrap();
      toast.success('Grade updated successfully');
      setGrade('');
      setEditingGrade(null);
      setSelectedStudentId(null);
      refetchGrades();
    } catch (error) {
      console.error('Failed to update grade:', error);
      toast.error('Failed to update grade: ' + (error.data?.message || error.error));
    }
  };

  return (
    <div className={styles.studentsContainer}>
      {students.map((student) => (
        <div key={student.student_id} className={styles.studentCard}>
          <div className={styles.studentAvatar}>
            <img src={student.profile_picture} alt={`${student.first_name} ${student.last_name}`} />
          </div>
          <div className={styles.studentInfo}>
            <h3 className={styles.studentName}>
              {student.first_name} {student.middle_name} {student.last_name}
            </h3>
            <p className={styles.studentId}>ID: {student.student_id} | Email: {student.email}</p>

            {grades[student.student_id] ? (
              <div className={styles.gradeDetails}>
                <p><strong>Grade:</strong> {grades[student.student_id].letter_grade} - {grades[student.student_id].grade}% - GPA: {grades[student.student_id].gpa} - {grades[student.student_id].status}</p>
                {editingGrade === student.student_id ? (
                  <div className={styles.gradeContainer}>
                    <input
                      type="number"
                      className={styles.gradeInput}
                      placeholder="New Grade"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    />
                    <button
                      className={styles.gradeButton}
                      onClick={() => handleUpdateGrade(student.student_id)}
                      disabled={grade === ''}
                    >
                      Update Grade
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setEditingGrade(student.student_id);
                      setGrade(grades[student.student_id].grade);
                      setSelectedStudentId(student.student_id);
                    }}
                  >
                    Edit Grade
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.gradeContainer}>
                <input
                  type="number"
                  className={styles.gradeInput}
                  placeholder="Final Grade"
                  min="0"
                  max="100"
                  value={selectedStudentId === student.student_id ? grade : ''}
                  onChange={(e) => setGrade(e.target.value)}
                  onFocus={() => setSelectedStudentId(student.student_id)}
                />
                <button
                  className={styles.gradeButton}
                  onClick={() => handleAddGrade(student.student_id)}
                  disabled={selectedStudentId !== student.student_id || grade === ''}
                >
                  Add Grade
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default StudentsList;
