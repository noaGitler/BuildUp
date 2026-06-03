import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx';

import PublicRoute from './components/auth/PublicRoute.jsx';
import LoginForm from './components/auth/Login/LoginForm';
import Register from './components/auth/Register/Register.jsx';

import MainLayout from './components/layout/MainLayout/MainLayout';

import './App.css';
import Logo from './components/UI/logo.jsx';

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
              <Route path="/projects" element={<></>} />
              <Route path="/jobs" element={<></>} />
              <Route path="/favorites" element={<></>} />
              <Route path="/users" element={<></>} />

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