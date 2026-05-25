import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateSurvey from './components/CreateSurvey';
import SurveyManagement from './components/SurveyManagement';
import Reports from './components/Reports';
import Stores from './components/Stores';
import Brands from './components/Brands';
import Layout from './components/Layout';

import { BrandProvider } from './context/BrandContext';

import {
  UserProvider,
  useUser,
} from './context/UserContext';

const AppRoutes = () => {
  const { user, setUser } = useUser();

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setUser={setUser} />}
      />

      <Route
        path="/*"
        element={
          user ? (
            <Layout user={user}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate to="/dashboard" />
                  }
                />

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="/brands"
                  element={<Brands />}
                />

                <Route
                  path="/stores"
                  element={<Stores />}
                />

                <Route
                  path="/create-survey"
                  element={<CreateSurvey />}
                />

                <Route
                  path="/survey-management"
                  element={<SurveyManagement />}
                />

                <Route
                  path="/reports"
                  element={<Reports />}
                />
              </Routes>
            </Layout>
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <BrandProvider>
        <Router>
          <AppRoutes />
        </Router>
      </BrandProvider>
    </UserProvider>
  );
}

export default App;