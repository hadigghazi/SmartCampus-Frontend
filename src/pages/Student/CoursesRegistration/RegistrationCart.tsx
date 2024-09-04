import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRegistrationMutation } from '../../../features/api/registrationsApi';
import { getCartFromLocalStorage, setCartInLocalStorage } from '../../../features/api/cartSlice';
import styles from '../../Admin/CourseDetails/CourseDetails.module.css';
import stylesbtn from './Registrations.module.css';
import personalImage from '../../../assets/images/profileImage.jpg';

const RegistrationCart: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<{ [courseId: number]: number[] }>(getCartFromLocalStorage());
  const [createRegistration] = useCreateRegistrationMutation();

  const handleRegisterAll = async () => {
    for (const courseId in cart) {
      const courseInstructorId = cart[courseId][0];

      try {
        await createRegistration({
          course_instructor_id: courseInstructorId,
        }).unwrap();

        console.log(`Successfully registered for course with course_instructor_id: ${courseInstructorId}`);
      } catch (error) {
        console.error(`Failed to register for course with course_instructor_id: ${courseInstructorId}`, error);
      }
    }

    setCart({});
    setCartInLocalStorage({});
    navigate('/registrations');
  };

  const handleRemoveFromCart = (courseId: number) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[courseId];
      setCartInLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  if (Object.keys(cart).length === 0) {
    return <div className={styles.emptyCartMessage}>Your cart is empty. Please add courses to your cart.</div>;
  }

  return (
    <div className={styles.content}>
      <h1 className={styles.headingPrimary} style={{marginBottom: "2rem"}}>Your Registration Cart</h1>
      <ul className={styles.optionsList}>
        {Object.entries(cart).map(([courseId, optionIds]) => (
          <li key={courseId} className={styles.optionItem} style={{position: "relative"}}>
            <img
              src={personalImage}
              alt={`Instructor`}
              className={styles.optionImage}
            />
            <h4 className={styles.optionHeading}>Instructor Name</h4>
            <p className={styles.optionText}>Campus: Example Campus</p>
            <p className={styles.optionText}>Schedule: Example Schedule</p>
            <p className={styles.optionText}>Available Seats: Example Seats</p>
            <p className={styles.optionText}>Semester: Example Semester</p>
            <p className={styles.optionText} style={{marginBottom: '3.5rem'}}>Room: Example Room</p>
            <div className={styles.btnsContainer}>
              <button
                onClick={() => handleRemoveFromCart(Number(courseId))}
                className={stylesbtn.rejectBtn}
              >
                Remove from Cart
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleRegisterAll} className={stylesbtn.goToCartButton}>
        Register All
      </button>
    </div>
  );
};

export default RegistrationCart;
