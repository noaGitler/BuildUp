import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/authContext.jsx';
import { CategoryProvider } from './context/categoryContext.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';

import PublicRoute from './components/Auth/PublicRoute.jsx';
import LoginForm from './components/Auth/Login/LoginForm';
import Register from './components/Auth/Register/Register.jsx';

import MainLayout from './components/Layout/MainLayout/MainLayout';

import Projects from './components/Projects/Projects.jsx'
import ProjectsPage from './components/Projects/ProjectsPage/ProjectsPage.jsx';
import ProjectDetails from './components/Projects/ProjectDetails/ProjectDetails.jsx';
import CreateProjectPage from './components/Projects/CreateProjectPage/CreateProjectPage.jsx';
import EditProjectPage from './components/Projects/EditProjectPage/EditProjectPage.jsx';

import './App.css';
import Logo from './components/UI/Logo.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          <Routes>

            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute> <LoginForm /> </PublicRoute>} />
            <Route path="/register" element={<PublicRoute> <Register /> </PublicRoute>} />

            <Route path="/" element={<MainLayout />}>

              {/* Projects Routes */}
              <Route path="projects" element={<Projects />}>
                <Route index element={<ProjectsPage />} />
                <Route path="new" element={<CreateProjectPage />} />
                <Route path=":id" element={<ProjectDetails />} />
                <Route path=":id/edit" element={<EditProjectPage />} />
              </Route>

              <Route path="/jobs" element={<></>} />
              <Route path="/favorites" element={<></>} />
              <Route path="/professionals" element={<></>} />

            </Route>

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;