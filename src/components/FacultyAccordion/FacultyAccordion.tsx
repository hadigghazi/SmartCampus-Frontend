import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetMajorsByFacultyAndCampusQuery } from '../../features/api/majorsApi';
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
                <li key={major.id}>
                  <Link to={`/majors/${major.id}`}>{major.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No majors available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyAccordion;
