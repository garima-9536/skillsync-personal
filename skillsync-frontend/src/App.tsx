import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProjectListPage from './components/pages/ProjectListPage';
import ProjectDetailPage from './components/pages/ProjectDetailPage';
import CreateProjectPage from './components/pages/CreateProjectPage';
import EditProjectPage from './components/pages/EditProjectPage';
import UserProfilePage from './components/pages/UserProfilePage';
import EditProfilePage from './components/pages/EditProfilePage';
import TeammateSearchPage from './components/pages/TeammateSearchPage';
import DashboardPage from './components/pages/DashboardPage';
import CollaborationRequestsPage from './components/pages/CollaborationRequestsPage';
import ApplicationsPage from './components/pages/ApplicationsPage';
import MyProjectsPage from './components/pages/MyProjectsPage';

const App = () => (
  <ThemeProvider>
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/create" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/:projectId/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
        <Route path="/users/:userId" element={<UserProfilePage />} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/teammates" element={<TeammateSearchPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/my-projects" element={<ProtectedRoute><MyProjectsPage /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><CollaborationRequestsPage /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  </ThemeProvider>
);

export default App;
