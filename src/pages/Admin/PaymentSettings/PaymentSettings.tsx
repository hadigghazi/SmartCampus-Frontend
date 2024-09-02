import React, { useState } from 'react';
import { useGetPaymentSettingsQuery, useCreatePaymentSettingMutation, useDeletePaymentSettingMutation } from '../../../features/api/paymentSettingsApi';
import Table from '../../../components/Table/Table'; 
import styles from '../Courses/Courses.module.css'; 
import formstyles from '../StudentDetails/StudentDetails.module.css'

const PaymentSettings: React.FC = () => {
  const { data: paymentSettings, isLoading, isError } = useGetPaymentSettingsQuery();
  const [createPaymentSetting] = useCreatePaymentSettingMutation();
  const [deletePaymentSetting] = useDeletePaymentSettingMutation();

  const [formValues, setFormValues] = useState({
    exchange_rate: '',
    lbp_percentage: '',
    registration_fee_usd: '',
    effective_date: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPaymentSetting(formValues);
    setFormValues({
      exchange_rate: '',
      lbp_percentage: '',
      registration_fee_usd: '',
      effective_date: ''
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this setting?')) {
      await deletePaymentSetting(id);
    }
  };

  const columns = [
    { header: 'Exchange Rate', accessor: 'exchange_rate' },
    { header: 'LBP Percentage', accessor: 'lbp_percentage' },
    { header: 'Registration Fee USD', accessor: 'registration_fee_usd' },
    { header: 'Effective Date', accessor: 'effective_date' },
    { header: 'Actions', accessor: 'actions' },
  ];

  const data = paymentSettings?.map(setting => ({
    ...setting,
    actions: (
      <button onClick={() => handleDelete(setting.id)}>Delete</button>
    )
  })) || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.headingPrimary}>Manage Payment Settings</h1>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading payment settings.</p>}
      {paymentSettings && (
        <Table columns={columns} data={data} />
      )}
      <h2 className={styles.headingSecondary} style={{marginTop: "50px"}}>Add New Setting</h2>
      <div className={formstyles.uploadForm}>
        <form onSubmit={handleSubmit}>
          <label>
            Exchange Rate:
            <input
              type="number"
              name="exchange_rate"
              value={formValues.exchange_rate}
              onChange={handleInputChange}
              required
              style={{display: 'block', marginBottom: "15px"}}
              className={styles.formInput}
            />
          </label>
          <label>
            LBP Percentage:
            <input
              type="number"
              name="lbp_percentage"
              value={formValues.lbp_percentage}
              onChange={handleInputChange}
              style={{display: 'block', marginBottom: "15px"}}
              required
              className={styles.formInput}
            />
          </label>
          <label>
            Registration Fee USD:
            <input
              type="number"
              name="registration_fee_usd"
              value={formValues.registration_fee_usd}
              onChange={handleInputChange}
              style={{display: 'block', marginBottom: "15px"}}
              required
              className={styles.formInput}
            />
          </label>
          <label>
            Effective Date:
            <input
              type="date"
              name="effective_date"
              value={formValues.effective_date}
              onChange={handleInputChange}
              style={{display: 'block', width: "100%", marginBottom: "15px"}}
              required
              className={styles.formInput}
            />
          </label>
          <button type="submit" style={{width: "100%"}} className={styles.submitButton}>Add Setting</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentSettings;
