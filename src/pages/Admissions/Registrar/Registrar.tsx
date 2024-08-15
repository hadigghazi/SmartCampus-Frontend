import React from 'react';
import AdmissionsLayout from '../AdmissionsLayout';
import styles from './Registrar.module.css';

const Registrar: React.FC = () => {
  return (
    <AdmissionsLayout title="Registrar Calendar">
    <div className={styles.container}>
    <h2 className={styles.headingSecondary}>- Important Dates</h2>
      <h1 className={styles.headingPrimary}>Registrar Calendar</h1>
          <h2 className={styles.text}>FALL 2024-25</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Admissions Deadline</td>
            <td>September 2, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline – Registration Fees/Initial Payment Continuing Students for Fall 2024-25</td>
            <td>September 13, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Dorms - Deadline for Accepting Applications</td>
            <td>September 13, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Dorms - Deadline for First Payment</td>
            <td>September 13, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Submission of Financial Aid Application and Official Documents for Fall 2024-25 (New Students)</td>
            <td>September 13, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Prophet's Birthday (Tentative)</td>
            <td>September 16, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>New Students Orientation</td>
            <td>September 23, 2024</td>
            <td>September 25, 2024</td>
          </tr>
          <tr>
            <td>Drop and Add Period</td>
            <td>September 26, 2024</td>
            <td>October 3, 2024</td>
          </tr>
          <tr>
            <td>Deadline - Bus Fees Application & Payment</td>
            <td>October 2, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Fall 2024-25 Semester Begins</td>
            <td>October 2, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Registration Fees USD - New Students</td>
            <td>October 3, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Submitting NSSF Declarations for the Academic Year 2024-25</td>
            <td>October 9, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Submission of Applications for Deferral of Payments for Fall 2024-25</td>
            <td>October 16, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - 1st Installment Payment & Tuition without Installment</td>
            <td>October 24, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Dorms - Deadline for Final Payment</td>
            <td>October 30, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Independence Day</td>
            <td>November 22, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - 2nd Installment Payment</td>
            <td>November 25, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Last Day of Withdrawal for Fall 2024-25</td>
            <td>December 6, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - 3rd Installment Payment</td>
            <td>December 20, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Christmas Vacation and New Year Vacation</td>
            <td>December 25, 2024</td>
            <td>January 1, 2025</td>
          </tr>
          <tr>
            <td>Advising for Continuing Students for Spring 2024-25</td>
            <td>December 16, 2024</td>
            <td>December 20, 2024</td>
          </tr>
          <tr>
            <td>Armenian Christmas</td>
            <td>January 6, 2025</td>
            <td></td>
          </tr>
          <tr>
            <td>Registration for Continuing Students for Spring 2024-25</td>
            <td>January 14, 2025</td>
            <td>January 16, 2025</td>
          </tr>
          <tr>
            <td>Last Day of Classes</td>
            <td>January 15, 2025</td>
            <td></td>
          </tr>
          <tr>
            <td>End of Fall 2024-25 Semester</td>
            <td>February 5, 2025</td>
            <td></td>
          </tr>
          <tr>
            <td>Saint Maroun's Day</td>
            <td>February 9, 2025</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h2 className={styles.text}>SUMMER 2023-24</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deadline - Registration Fees for Summer 2023-24</td>
            <td>June 17, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Bus Fees Application & Payment</td>
            <td>July 3, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Summer 2023-24 Semester Begins</td>
            <td>July 3, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Drop and Add Period</td>
            <td>June 27, 2024</td>
            <td>July 4, 2024</td>
          </tr>
          <tr>
            <td>Hijra New Year</td>
            <td>July 8, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Ashoura (Tentative)</td>
            <td>July 17, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Tuition Payment</td>
            <td>July 24, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Last day of Withdrawal for Summer 2023-24</td>
            <td>August 7, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Advising for Continuing Students for Fall 2024-25</td>
            <td>August 19, 2024</td>
            <td>August 23, 2024</td>
          </tr>
          <tr>
            <td>Assumption of Virgin Mary Day</td>
            <td>August 15, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Registration for Continuing Students for Fall 2024-25</td>
            <td>August 26, 2024</td>
            <td>August 28, 2024</td>
          </tr>
          <tr>
            <td>Graduation Clearance Advising</td>
            <td>August 22, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Last Day of Classes</td>
            <td>August 23, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>End of Summer 2023-24 Semester</td>
            <td>September 4, 2024</td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <h2 className={styles.text}>SPRING 2023-24</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deadline - Submission of Application and Official Documents for Spring 2023-24 (New Students)</td>
            <td>January 31, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Registration Fees for Spring 2023-24</td>
            <td>January 22, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Dorms - Deadline for Accepting Applications</td>
            <td>February 5, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Dorms - Deadline for First Payment</td>
            <td>February 5, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Submission of Financial Aid Application and Official Documents for Spring 2023-24 (New Students)</td>
            <td>February 5, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>New Students Orientation</td>
            <td>February 6, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Drop and Add Period</td>
            <td>February 7, 2024</td>
            <td>February 13, 2024</td>
          </tr>
          <tr>
            <td>Deadline - Bus Fees Application & Payment</td>
            <td>February 12, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Spring 2023-24 Semester Begins</td>
            <td>February 12, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Submitting NSSF Declarations for the Academic Year 2023-24</td>
            <td>February 19, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - Submission of Applications for Deferral of Payments for Spring 2023-24</td>
            <td>March 5, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Deadline - 1st Installment Payment & Tuition without Installment</td>
            <td>March 7, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Dorms - Deadline for Final Payment</td>
            <td>March 15, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Annunciation Day</td>
            <td>March 25, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Easter (Western Church)</td>
            <td>March 29, 2024</td>
            <td>April 1, 2024</td>
          </tr>
          <tr>
            <td>Deadline - 2nd Installment Payment</td>
            <td>April 8, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Eid Al Fitr (Tentative)</td>
            <td>April 10, 2024</td>
            <td>April 12, 2024</td>
          </tr>
          <tr>
            <td>Last day of Withdrawal for Spring 2023-24</td>
            <td>April 24, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Labor Day</td>
            <td>May 1, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Easter (Eastern Church)</td>
            <td>May 3, 2024</td>
            <td>May 6, 2024</td>
          </tr>
          <tr>
            <td>Deadline - 3rd Installment Payment</td>
            <td>May 8, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Advising for Continuing Students for Summer 2023-24</td>
            <td>May 13, 2024</td>
            <td>May 17, 2024</td>
          </tr>
          <tr>
            <td>Resistance and Liberation Day</td>
            <td>May 25, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Registration for Continuing Students for Summer 2023-24</td>
            <td>May 28, 2024</td>
            <td>May 30, 2024</td>
          </tr>
          <tr>
            <td>Graduation Clearance Advising</td>
            <td>May 28, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Last Day of Classes</td>
            <td>May 29, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>End of Spring 2023-24 Semester</td>
            <td>June 21, 2024</td>
            <td></td>
          </tr>
          <tr>
            <td>Al Adha Holiday (Tentative)</td>
            <td>June 17, 2024</td>
            <td>June 19, 2024</td>
          </tr>
        </tbody>
      </table>
    </div>

    </AdmissionsLayout>
  );
};

export default Registrar;
