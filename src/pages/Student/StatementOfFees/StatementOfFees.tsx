import React, { useState } from 'react';
import { useGetUserQuery } from '../../../features/api/authApi';
import { useGetStudentByUserIdQuery } from '../../../features/api/studentsApi';
import { useGetFeesByStudentQuery, useGetPaymentsByStudentQuery } from '../../../features/api/feesPaymentsApi';
import Table from '../../../components/Table/Table';
import styles from '../../Admin/StudentDetails/StudentDetails.module.css';
import styleshead from '../AcademicHistory/AcademicHistory.module.css';
import { useGetFinancialAidsScholarshipsByStudentQuery } from '../../../features/api/financialAidApi';
import { useGetCurrentSemesterQuery } from '../../../features/api/semestersApi';

const StatementOfFees: React.FC = () => {
  const { data: user, isLoading: userLoading, error: userError } = useGetUserQuery();
  const userId = user?.id;
  const { data: currentSemester } = useGetCurrentSemesterQuery();

  const { data: student, isLoading: studentLoading, error: studentError } = useGetStudentByUserIdQuery(userId || -1);
  const studentId = student?.id;

  const { data: fees } = useGetFeesByStudentQuery(studentId || -1);
  const { data: payments } = useGetPaymentsByStudentQuery(studentId || -1);
  const { data: financialAidsScholarships } = useGetFinancialAidsScholarshipsByStudentQuery(studentId);

  const [selectedSemester, setSelectedSemester] = useState<string>('All');

  if (userLoading || studentLoading) return <p>Loading...</p>;
  if (userError || studentError) return <p>Error loading data.</p>;

  const filteredFees = fees || [];
  const filteredPayments = payments || [];
  const financialAids = financialAidsScholarships?.financial_aids_scholarships || [];

  const feesUsd = filteredFees.filter(fee => fee.amount_usd > 0);
  const feesLbp = filteredFees.filter(fee => fee.amount_lbp > 0);
  const paymentsUsd = filteredPayments.filter(payment => payment.currency === 'USD');
  const paymentsLbp = filteredPayments.filter(payment => payment.currency === 'LBP');

  const totalUsd = feesUsd.reduce((acc, fee) => acc + parseFloat(fee.amount_usd), 0);
  const totalLbp = feesLbp.reduce((acc, fee) => acc + parseFloat(fee.amount_lbp), 0);
  const totalPaidUsd = paymentsUsd.reduce((acc, payment) => acc + parseFloat(payment.amount_paid), 0);
  const totalPaidLbp = paymentsLbp.reduce((acc, payment) => acc + parseFloat(payment.amount_paid), 0);

  const financialAidDeductionsUsd = financialAids.reduce((acc, aid) => {
   const percentage = parseFloat(aid.percentage);
   return acc + (percentage / 100) * totalUsd;
 }, 0);
 const financialAidDeductionsLbp = financialAids.reduce((acc, aid) => {
   const percentage = parseFloat(aid.percentage);
   return acc + (percentage / 100) * totalLbp;
 }, 0);

 const remainingUsd = totalUsd - totalPaidUsd - financialAidDeductionsUsd;
 const remainingLbp = totalLbp - totalPaidLbp - financialAidDeductionsLbp;


  const columnsPayments = [
    { header: 'Date', accessor: 'date' },
    { header: 'Description', accessor: 'description' },
    { header: 'Dues', accessor: 'dues' },
    { header: 'Payment Deductions', accessor: 'payment_deductions' },
  ];

  const renderFeesTable = (fees: any[], payments: any[], currency: string) => {
    const financialAidRows = financialAids.map(aid => {
      const percentage = parseFloat(aid.percentage);
      const totalAmount = currency === 'USD' ? totalUsd : totalLbp;
      const deduction = (percentage / 100) * totalAmount;

      return {
        date: aid.created_at,
        description: `${aid.type} (${aid.percentage}%)`,
        dues: '',
        payment_deductions: deduction.toFixed(2),
      };
    });

    const feeRows = fees.map(fee => ({
      date: currentSemester?.start_date,
      description: fee.description,
      dues: currency === 'USD' ? fee.amount_usd : fee.amount_lbp,
      payment_deductions: '',
    }));

    const paymentRows = payments.filter(payment => payment.currency === currency).map(payment => ({
      date: payment.payment_date,
      description: payment.description,
      dues: '',
      payment_deductions: payment.amount_paid,
    }));
    
    return (
      <Table
        columns={columnsPayments} 
        data={[
          ...feeRows,
          ...paymentRows,
          ...financialAidRows,
          {
            date: 'Remaining',
            description: '',
            dues: currency === 'USD' ? remainingUsd.toFixed(2) : remainingLbp.toLocaleString(),
            payment_deductions: '',
          }
        ]}
      />
    );
  };

  return (
    <div className={styleshead.container}>
      <h2 className={styleshead.headingPrimary}>Statement Of Fees</h2>
      {student && (
        <div className={styleshead.studentInfo}>
          <p>{user?.first_name} {user?.middle_name} {user?.last_name} | {student.id}</p>
        </div>
      )}
      <div className={styleshead.semesterSection}>
        <h3 className={styles.headingTertiary}>Fees in USD</h3>
        {renderFeesTable(filteredFees, filteredPayments, 'USD')}
        <h3 className={styles.headingTertiary}>Fees in LBP</h3>
        {renderFeesTable(filteredFees, filteredPayments, 'LBP')}
        </div>
    </div>
  );
};

export default StatementOfFees;
