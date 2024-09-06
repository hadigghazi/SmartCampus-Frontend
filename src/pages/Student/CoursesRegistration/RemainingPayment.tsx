import { useCheckFeesPaidQuery } from "../../../features/api/feesPaymentsApi";
import StudentLayout from "../StudentLayout";
import styles from './Registrations.module.css';

const PaymentPage = () => {
    const { data } = useCheckFeesPaidQuery();
  
    if (data) {
      const { remaining_fees_usd, remaining_fees_lbp } = data;
      
      return (
        <StudentLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Payment Required</h1>
          <p className={styles.description}>You still need to pay the following fees:</p>
          <div className={styles.fees}>
            <p><span className={styles.feeLabel}>USD:</span> ${remaining_fees_usd}</p>
            <p><span className={styles.feeLabel}>LBP:</span> {remaining_fees_lbp} LBP</p>
          </div>
        </div>
        </StudentLayout>
      );
    }
  
    return <div className={styles.container}>Loading...</div>;
  };

export default PaymentPage;
