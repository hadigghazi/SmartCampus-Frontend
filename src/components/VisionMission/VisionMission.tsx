import React from 'react';
import Welcome1 from '../../assets/images/VisionMission.png';
import styles from './VisionMission.module.css'; 

const VisionMission: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.headingSecondary}>- Vision And Mission</h2>
      <h1 className={styles.headingPrimary}>Our View And Goals</h1>
      <div className={styles.contentWrapper}>
        <div className={styles.imageWrapper}>
          <img
            src={Welcome1}
            alt="SmartCampus Vision and Mission"
            className={styles.image}
          />
        </div>
        <div className={styles.textWrapper}>
          <h3 className={styles.smallTitle}>Vision</h3>
          <p className={styles.paragraph}>
            To be a global leader in modern education, we aim to shape the future through innovative learning, smart solutions, and a commitment to excellence. We strive to create a transformative educational experience that prepares our students to excel in a dynamic world and contribute meaningfully to society.
          </p>
          <h3 className={styles.smallTitle}>Mission</h3>
          <p className={styles.paragraph}>
            1. Innovative Education: Deliver cutting-edge, modern education that integrates technology and real-world applications.
            <br /><br />
            2. Equity and Accessibility: Ensure accessibility and equity in education, providing opportunities for all students to succeed.
            <br /><br />
            3. Diverse Community: Foster a diverse and inclusive community that encourages collaboration, creativity, and critical thinking.
            <br /><br />
            4. Future Leaders: Prepare students to become innovative leaders and responsible global citizens who drive positive change.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
