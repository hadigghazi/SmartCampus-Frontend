import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../Admin/CourseDetails/CourseDetails.module.css';
import stylesbtn from './Registrations.module.css';
import personalImage from '../../../assets/images/profileImage.jpg';
import {
  useGetCourseByIdQuery,
  useGetCourseOptionsQuery
} from '../../../features/api/coursesApi';
import { getCartFromLocalStorage, setCartInLocalStorage } from '../../../features/api/cartSlice';
import { useGetAvailableCoursesForStudentQuery } from '../../../features/api/registrationsApi';
import Button from '../../../components/Button/Button';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, error: courseError, isLoading: courseLoading } = useGetCourseByIdQuery(Number(id));
  const { data: courseOptions, error: optionsError, isLoading: optionsLoading } = useGetCourseOptionsQuery(Number(id));
  const { data: availableCourses, isLoading: availableCoursesLoading } = useGetAvailableCoursesForStudentQuery();

  const [cart, setCart] = useState<{ [courseId: number]: number[] }>(getCartFromLocalStorage());

  useEffect(() => {
    const availableCourseIds = availableCourses?.map(course => course.course_id) || [];
    if (Number(id) && !availableCourseIds.includes(Number(id))) {
      navigate('/registrations');
    }
  }, [id, availableCourses, navigate]);

  useEffect(() => {
    setCart(getCartFromLocalStorage());
  }, []);

  const handleAddToCart = (courseId: number, optionId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };

      if (updatedCart[courseId] && updatedCart[courseId].length > 0) {
        return prevCart;
      }

      updatedCart[courseId] = [optionId];
      setCartInLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (courseId: number, optionId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };

      if (updatedCart[courseId]) {
        updatedCart[courseId] = updatedCart[courseId].filter(id => id !== optionId);
        if (updatedCart[courseId].length === 0) {
          delete updatedCart[courseId]; 
        }
        setCartInLocalStorage(updatedCart);
      }
      return updatedCart;
    });
  };

  const handleGoToCart = () => {
    navigate('/registrations-cart');
  };

  if (courseLoading || optionsLoading || availableCoursesLoading) return <div>Loading...</div>;
  if (courseError || optionsError) return <div>Error loading course details</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className={styles.content}>
      <h1 className={styles.headingPrimary}>{course.name}</h1>
      <h2 className={styles.headingSecondary}>{course.code}</h2>
      <p className={styles.text}>{course.credits} Credits</p>
      <p className={styles.text}>{course.description}</p>
      
      <div className={styles.header_container}>
        <h3 className={styles.headingTertiary}>- Course Options</h3>
      </div>
      {courseOptions && courseOptions.length > 0 ? (
        <ul className={styles.optionsList}>
          {courseOptions.map((option) => (
            <li key={option.id} className={styles.optionItem} style={{position: "relative"}}>
              <img
                src={personalImage}
                alt={`${option?.instructor_name}`}
                className={styles.optionImage}
              />
              <h4 className={styles.optionHeading}>{option?.instructor_name}</h4>
              <p className={styles.optionText}>Campus: {option?.campus_name}</p>
              <p className={styles.optionText}>Schedule: {option?.schedule}</p>
              <p className={styles.optionText}>Available Seats: {option?.available_seats}</p>
              <p className={styles.optionText}>Semester: {option?.semester_name}</p>
              <p className={styles.optionText} style={{marginBottom: '3.5rem'}}>Room: {option?.room}</p>
              <div className={styles.btnsContainer}>
                {cart[course.id] && cart[course.id].includes(option.id) ? (
                  <button
                    onClick={() => handleRemoveFromCart(course.id, option.id)}
                    className={stylesbtn.rejectBtn}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToCart(course.id, option.id)}
                    className={stylesbtn.acceptBtn}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.text}>No options available for this course.</p>
      )}

      {Object.keys(cart).length > 0 && (
        <div className={styles.cartContainer}>
          <button onClick={handleGoToCart}>
            Go to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
