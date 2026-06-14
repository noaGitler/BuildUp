import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/authContext.jsx';
import { CategoryProvider } from './context/categoryContext.jsx';

import PublicRoute from './components/Auth/PublicRoute.jsx';
import LoginForm from './components/Auth/Login/LoginForm';
import Register from './components/Auth/Register/Register.jsx';

import MainLayout from './components/Layout/MainLayout/MainLayout';
import ProjectsPage from './components/Projects/ProjectsPage/ProjectsPage.jsx';

import Jobs from './components/Jobs/Jobs.jsx';
import JobsPage from './components/Jobs/JobsPage/JobsPage.jsx';
import JobDetails from './components/Jobs/JobDetails/JobDetails.jsx';

import './App.css';
import Logo from './components/UI/Logo.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoryProvider>
          {/* <div className="App"> */}
          <Routes>
            {/* Home Feed Base */}

            {/* Auth Routes */}
            <Route path="/login" element={<PublicRoute> <LoginForm /> </PublicRoute>} />
            <Route path="/register" element={<PublicRoute> <Register /> </PublicRoute>} />

            <Route path="/" element={<MainLayout />}>
              {/* <Route path="/" element={<></>} /> */}

              {/* Core feature views routes */}
              <Route path="/projects" element={<ProjectsPage />} />

              {/* jobs */}
              <Route path="/jobs" element={<Jobs />}>
                <Route index element={<JobsPage />} />
                <Route path=":id" element={<JobsPage />} />
                <Route path="edit/:id" element={<JobsPage />} />
              </Route>

              <Route path="/favorites" element={<></>} />
              <Route path="/professionals" element={<></>} />

            </Route>

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* </div> */}
        </CategoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;