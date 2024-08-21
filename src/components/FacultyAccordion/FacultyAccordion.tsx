import React, { useState } from 'react';
import { useGetMajorsByFacultyAndCampusQuery } from '../../features/api/campusesApi';
import styles from './FacultyAccordion.module.css';

interface FacultyAccordionProps {
  facultyId: number;
  facultyName: string;
  campusId: number;
}

const FacultyAccordion: React.FC<FacultyAccordionProps> = ({ facultyId, facultyName, campusId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: majors, isLoading, error } = useGetMajorsByFacultyAndCampusQuery({ facultyId, campusId });

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.accordion}>
      <button onClick={toggleAccordion} className={styles.accordionHeader}>
        {facultyName}
      </button>
      {isOpen && (
        <div className={styles.accordionContent}>
          {isLoading ? (
            <p>Loading majors...</p>
          ) : error ? (
            <p>Error loading majors</p>
          ) : majors && majors.length > 0 ? (
            <ul>
              {majors.map((major) => (
                <li key={major.major_id}>
                  {major.major_name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No majors available for this faculty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyAccordion;
