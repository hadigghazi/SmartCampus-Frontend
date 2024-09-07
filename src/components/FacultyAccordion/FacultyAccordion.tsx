import React, { useState } from 'react';
import { useGetMajorsByFacultyAndCampusQuery } from '../../features/api/campusesApi';
import styles from './FacultyAccordion.module.css';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

type Major = {
  major_id: number;
  major_name: string;
};

type FacultyAccordionProps = {
  facultyId: number;
  facultyName: string;
  campusId: number;
};

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
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▲</span>
      </button>
      {isOpen && (
        <div className={styles.accordionContent}>
          {isLoading ? (
            <Spinner />
          ) : error ? (
            <p>Error loading majors</p>
          ) : majors && majors.length > 0 ? (
            <ul>
              {majors.map((major: Major) => (
                <li key={major.major_id}>
                  <Link to={`/majors/${major.major_id}`}>
                    {major.major_name}
                  </Link>
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
