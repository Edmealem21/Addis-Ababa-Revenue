import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a default page based on role
    if (user.role === 'ICT Administrator') {
      return <Navigate to="/ictadmin/dashboard" />;
    }
    // Fallback: go to main dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleBasedRoute;