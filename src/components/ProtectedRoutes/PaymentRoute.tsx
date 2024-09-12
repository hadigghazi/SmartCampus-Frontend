import { Navigate } from 'react-router-dom';
import { useCheckFeesPaidQuery } from '../../features/api/feesPaymentsApi'
import Spinner from '../Spinner/Spinner';

const ProtectedRoute = ({ children }) => {
  const { data, error, isLoading } = useCheckFeesPaidQuery();

  if (isLoading) {
    return <Spinner />;
  }

  if (error || !data) {
    return <div>Error loading fees data</div>;
  }

  const { fees_paid } = data;

  if (!fees_paid ) {
    return <Navigate to="/remaining-payments" />;
  }

  return children;
};

export default ProtectedRoute;
