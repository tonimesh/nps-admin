import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateSurvey from './components/CreateSurvey';
import SurveyManagement from './components/SurveyManagement';
import SurveyPreview from './components/SurveyPreview';
import Reports from './components/Reports';
import Stores from './components/Stores';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('surveyUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/*"
          element={
            user ? (
              <Layout user={user} setUser={setUser}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/stores" element={<Stores />} />
                  <Route path="/create-survey" element={<CreateSurvey />} />
                  <Route path="/survey-management" element={<SurveyManagement />} />
                  <Route path="/survey-preview" element={<SurveyPreview />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;