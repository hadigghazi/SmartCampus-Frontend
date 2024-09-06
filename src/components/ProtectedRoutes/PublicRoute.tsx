import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store';
import { useGetUserQuery } from '../../features/api/authApi';
interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const { data: user, isLoading } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    switch (user.role) {
      case 'Student':
        return <Navigate to="/student-dashboard" />;
      case 'Instructor':
        return <Navigate to="/instructor-dashboard" />;
      case 'Admin':
        return <Navigate to="/admin/applications/students" />;
      default:
        return <Navigate to="/" />; 
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
