import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signInAnonymously, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import './Welcome.css';

const Welcome = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      // Sign in anonymously using Firebase Auth
      // This creates a temporary account that persists until the browser session ends
      await signInAnonymously(auth);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in as guest. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to register. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1>Flow Builder</h1>

        {error && <div className="error-message">{error}</div>}

        {!showRegister ? (
          <div className="sign-in-options">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="google-sign-in-button"
            >
              <img src="/google-icon.svg" alt="Google" className="google-icon" />
              {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
            </button>
            
            <button 
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="anonymous-sign-in-button"
            >
              {isSigningIn ? 'Signing in...' : 'Continue as Guest'}
            </button>

            <div className="sign-in-divider">
              <span>or</span>
            </div>

            <button 
              onClick={() => setShowRegister(true)}
              className="register-link-button"
            >
              Create an Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="register-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="register-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="register-input"
            />
            <button 
              type="submit"
              disabled={isSigningIn}
              className="register-button"
            >
              {isSigningIn ? 'Creating Account...' : 'Create Account'}
            </button>
            <button 
              type="button"
              onClick={() => setShowRegister(false)}
              className="back-to-sign-in"
            >
              Back to Sign In
            </button>
          </form>
        )}

        <p className="welcome-note">
          {!showRegister ? 
            "We use anonymous sign-in to keep things simple. Your surveys will be saved to your browser." :
            "Create an account to save your surveys permanently and access them from any device."}
        </p>
      </div>
    </div>
  );
};

export default Welcome; 