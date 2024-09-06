import { Navigate } from 'react-router-dom';
import { useCheckFeesPaidQuery } from '../../features/api/feesPaymentsApi'

const ProtectedRoute = ({ children }) => {
  const { data, error, isLoading } = useCheckFeesPaidQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading fees data</div>;
  }

  const { fees_paid, remaining_fees_usd, remaining_fees_lbp } = data;

  if ((!fees_paid && !remaining_fees_usd) || (!fees_paid && !remaining_fees_lbp)) {
    return <Navigate to="/remaining-payments" />;
  }

  return children;
};

export default ProtectedRoute;
