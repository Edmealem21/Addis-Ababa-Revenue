import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-pulse">
          <h3 className="text-xl font-bold text-navy-800 dark:text-gold-400 mb-2">⏳ እባክዎ ይጠብቁ...</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">ስርዓቱ እየተጫነ ነው</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;