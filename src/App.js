import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import FlowBuilder from './components/FlowBuilder';
import FlowView from './components/FlowView';
import Flows from './components/Flows';
import EditFlow from './components/EditFlow';
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
        <Route path="/" element={<Navigate to="/my-flows" replace />} />
        <Route path="/flow-builder" element={<ProtectedRoute><FlowBuilder /></ProtectedRoute>} />
        <Route path="/my-flows" element={<ProtectedRoute><Flows /></ProtectedRoute>} />
        <Route path="/consultations/:consultationId" element={<FlowView />} />
        <Route path="/edit-flow/:consultationId" element={<ProtectedRoute><EditFlow /></ProtectedRoute>} />
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
