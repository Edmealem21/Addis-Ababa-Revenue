import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Layout from './components/common/Layout';
import Dashboard from './components/dashboard/Dashboard';
import TaxCenter from './components/taxcenter/TaxCenter';
import ICTAdmin from './components/ict/ICTAdmin';
import EmployeeData from './components/ict/EmployeeData';
import UserData from './components/ict/UserData';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="taxcenter" element={<TaxCenter />} />
            <Route path="ict" element={<ICTAdmin />}>
              <Route index element={<Navigate to="/ict/employee" />} />
              <Route path="employee" element={<EmployeeData />} />
              <Route path="user" element={<UserData />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;