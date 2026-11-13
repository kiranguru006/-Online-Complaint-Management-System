import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { FileComplaintPage } from './pages/FileComplaintPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ManageUsersPage } from './pages/ManageUsersPage';
import { ManageCategoriesPage } from './pages/ManageCategoriesPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="track" element={<TrackComplaintPage />} />

        {/* User / Citizen Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="complaints/new"
          element={
            <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN']}>
              <FileComplaintPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="complaints"
          element={
            <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_STAFF', 'ROLE_ADMIN']}>
              <MyComplaintsPage />
            </ProtectedRoute>
          }
        />

        {/* Staff Routes */}
        <Route
          path="staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
              <StaffDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff/complaints"
          element={
            <ProtectedRoute allowedRoles={['ROLE_STAFF', 'ROLE_ADMIN']}>
              <StaffDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <ManageCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated Profile Route */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
