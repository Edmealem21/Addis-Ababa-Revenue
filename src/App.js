import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaxCenterProvider } from './context/TaxCenterContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import Login from './components/auth/Login';
import Layout from './components/common/Layout';
import Dashboard from './components/admin/dashboard/Dashboard';
import TaxCenter from './components/admin/taxcenter/TaxCenter';

// Old ICT Module
import ICTAdmin from './components/admin/ict/ICTAdmin';
import EmployeeData from './components/admin/ict/EmployeeData';
import UserData from './components/admin/ict/UserData';

// New ICT Admin Module
import IctAdminLayout from './components/ictadmin/IctAdminLayout';
import IctDashboard from './components/ictadmin/pages/IctDashboard';
import IctBankAccounts from './components/ictadmin/pages/IctBankAccounts';
import IctEmployeeData from './components/ictadmin/pages/Employees/IctEmployeeData';
import IctUserData from './components/ictadmin/pages/Employees/IctUserData';
import IctTaxPayers from './components/ictadmin/pages/IctTaxPayers';

// Officer Module
import OfficerLayout from './components/officer/OfficerLayout';
import OfficerDashboard from './components/officer/pages/Dashboard';
import Unevaluated from './components/officer/pages/Unevaluated';
import AllNotifies from './components/officer/pages/AllNotifies';
// Authority Module
import AuthorityLayout from './components/authority/AuthorityLayout';
import AuthorityDashboard from './components/authority/pages/Dashboard';

import './styles/App.css';


function App() {
  return (
    <AuthProvider>
      <TaxCenterProvider>
        <Router>
          <Routes>
            {/* Authority Routes (only for role 'Authority') */}
            <Route
              path="/authority"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['Authority']}>
                    <AuthorityLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AuthorityDashboard />} />
            </Route>
            {/* Officer Routes (only for role 'Officer') */}
            <Route
              path="/officer"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['Officer']}>
                    <OfficerLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<OfficerDashboard />} />
              <Route path="taxnotifies/unevaluated" element={<Unevaluated />} />
              <Route path="taxnotifies/all" element={<AllNotifies />} />
            </Route>
            {/* Public Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Routes (only for role 'Admin') */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['Admin']}>
                    <Layout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
            </Route>

            <Route
              path="/taxcenter"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['Admin']}>
                    <Layout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<TaxCenter />} />
            </Route>

            <Route
              path="/ict"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['Admin']}>
                    <Layout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/ict/employee" />} />
              <Route path="employee" element={<EmployeeData />} />
              <Route path="user" element={<UserData />} />
            </Route>

            {/* ICT Admin Routes (only for role 'ICT Administrator') */}
            <Route
              path="/ictadmin"
              element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ICT Administrator']}>
                    <IctAdminLayout />
                  </RoleBasedRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<IctDashboard />} />
              <Route path="bankaccounts" element={<IctBankAccounts />} />
              <Route path="employees/employee-data" element={<IctEmployeeData />} />
              <Route path="employees/user-data" element={<IctUserData />} />
              <Route path="taxpayers" element={<IctTaxPayers />} />
            </Route>

            {/* Catch‑all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </TaxCenterProvider>
    </AuthProvider>
  );
}

export default App;