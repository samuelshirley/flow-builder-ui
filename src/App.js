import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import SurveyDesigner from './components/SurveyDesigner';
import SurveyView from './components/SurveyView';
import SavedSurveys from './components/SavedSurveys';
import EditSurvey from './components/EditSurvey';
import NavBar from './components/NavBar';
import Welcome from './components/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/common.css';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If user is not authenticated and not on welcome page, redirect to welcome
  if (!user && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className="App">
      <NavBar user={user} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={<Navigate to="/my-surveys" replace />} />
        <Route path="/survey-builder" element={<ProtectedRoute><SurveyDesigner /></ProtectedRoute>} />
        <Route path="/my-surveys" element={<ProtectedRoute><SavedSurveys /></ProtectedRoute>} />
        <Route path="/surveys/:surveyId" element={<SurveyView />} />
        <Route path="/edit-survey/:surveyId" element={<ProtectedRoute><EditSurvey /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
