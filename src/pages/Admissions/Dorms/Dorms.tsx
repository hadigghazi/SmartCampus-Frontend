import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from "./Dorms.module.css";

const Centers: React.FC = () => {
  return (
    <AdmissionsLayout title="Dorms">
    <div className={styles.container}>
      
    <h2 className={styles.headingSecondary} >- Dorms</h2>
      <h1 className={styles.headingPrimary}>Dormitory Information</h1>
        <h2 className={styles.headingSecondary}>Overview</h2>
      <p className={styles.text}>
        Our university offers modern and well-equipped dormitories designed to provide a comfortable and supportive living environment for our students. With a variety of room options and amenities, our dorms are designed to cater to the diverse needs of our student body. Living on campus offers a convenient proximity to academic facilities, dining options, and recreational areas, enhancing the overall university experience.
      </p>
      
      <h2 className={styles.headingSecondary}>Dormitory Features</h2>
      <ul className={styles.list}>
        <li><strong>Room Options:</strong> We offer a range of room types including single, double, and shared accommodations to suit different preferences and budgets.</li>
        <li><strong>Amenities:</strong> Each dormitory room is furnished with essential furniture and includes high-speed internet access, climate control, and ample storage space. Common areas include study lounges, recreational rooms, and communal kitchens.</li>
        <li><strong>Safety and Security:</strong> Our dormitories are equipped with 24/7 security and surveillance to ensure the safety and well-being of all residents. Each building has secure access points and on-site residential assistants.</li>
        <li><strong>Services:</strong> Residents have access to laundry facilities, cleaning services, and maintenance support. Additionally, there are organized social and academic events to foster a sense of community among residents.</li>
      </ul>

      <h2 className={styles.headingSecondary}>Application Process</h2>
      <ol className={styles.list}>
        <li>Submit an Application: Complete the dormitory application form available on our website <a href="/dormitory-application" className={styles.text}>here</a> or at the Admissions Office.</li>
        <li>Application Deadlines: Ensure that your application is submitted by the deadlines specified for each semester. Late applications may be subject to availability.</li>
        <li>Payment: Pay the initial deposit as outlined in the registration fees schedule. The deposit secures your room and is non-refundable.</li>
        <li>Confirmation: After processing your application and payment, you will receive a confirmation of your room assignment.</li>
      </ol>

      <h2 className={styles.headingSecondary}>Important Dates</h2>
      <ul className={styles.list}>
        <li>Fall 2024-25 Application Deadline: September 15, 2024</li>
        <li>Spring 2024-25 Application Deadline: February 4, 2025</li>
        <li>Summer 2024-25 Application Deadline: June 15, 2025</li>
      </ul>

      <h2 className={styles.headingSecondary}>Contact Information</h2>
      <p className={styles.text}>
        For more details about our dormitories or to start your application, please contact the Dormitory Office:
      </p>
      <ul className={styles.list}>
        <li><strong>Phone:</strong> 999999999</li>
        <li><strong>Email:</strong> <a href="mailto:smartcampus@gmail.com" className={styles.text}>smartcampus@gmail.com</a></li>
        <li><strong>Office Hours:</strong> 08:00 AM - 14:00 PM</li>
      </ul>

      <p className={styles.text}>
        We are committed to providing a supportive living environment that enhances your academic and social experiences.
      </p>
    </div>

    </AdmissionsLayout>
  );
};

export default Centers;
