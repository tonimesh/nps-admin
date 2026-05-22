import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateSurvey from './components/CreateSurvey';
import SurveyManagement from './components/SurveyManagement';
import SurveyPreview from './components/SurveyPreview';
import Reports from './components/Reports';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('surveyUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // If not logged in, show login page (still within Router)
  if (!user) {
    return (
      <Router>
        <Login setUser={setUser} />
      </Router>
    );
  }

  // If logged in, show dashboard with layout
  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-survey" element={<CreateSurvey />} />
          <Route path="/survey-management" element={<SurveyManagement />} />
          <Route path="/survey-preview" element={<SurveyPreview />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;