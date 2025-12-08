// src/components/assets/Loginsignin/LoginSignUp.jsx

import React, { useState } from 'react';
import './LoginSignUp.css';
import MyBackgroundImage from './cdmBack.png'; 
import Cdm from './cdmm.png';

// FIREBASE IMPORTS
import { auth, db } from '../../../apiService'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const LoginSignUp = ({ onLogin }) => { 

    const [isLoginView, setIsLoginView] = useState(true);
    
    // Auth States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Function to clear states and switch the view (Login <-> Signup)
    const switchView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };
    
    // --- LOGIC FOR GOOGLE SIGN-IN ---
    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        
        try {
            await signInWithPopup(auth, provider);
            console.log('Google Sign-In successful');
            onLogin(); 
        } catch (firebaseError) {
            console.error("Google Sign-In Error: ", firebaseError);
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                 setError('Google sign-in window closed. Please try again.');
            } else {
                 setError('Google Sign-In failed: ' + firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC FOR EMAIL/PASSWORD LOGIN ---
    const handleLogin = async (e) => { 
        e.preventDefault(); 
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in both Email and Password.');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase Login successful');
            onLogin(); 
        } catch (firebaseError) {
            console.error('Login Failed:', firebaseError.message);
            if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                setError('Invalid Email or Password.');
            } else {
                setError('Login failed: ' + firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC FOR SIGN UP ---
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
             setError("Passwords do not match.");
             setLoading(false);
             return;
        }
        if (password.length < 6) {
             setError("Password must be at least 6 characters.");
             setLoading(false);
             return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create User Document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: fullName,
                email: email,
                role: 'teacher', // Defaulting to teacher since we removed the toggle
                createdAt: new Date()
            });

            console.log('Account created successfully!');
            onLogin(); 
        } catch (firebaseError) {
            console.error("Signup Error: ", firebaseError);
            if (firebaseError.code === 'auth/email-already-in-use') {
                 setError('This email is already registered. Please login.');
            } else {
                 setError(firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
       <div className="login-wrapper"
           style={{
               backgroundImage: `url(${MyBackgroundImage})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               minHeight: '100vh',
               padding: '2rem',
           }}
       >
           <div className="container">
                {/* Logo Area */}
                <div className="logo-area">
                    <img src={Cdm} alt="Colegio de Montalban Logo" className="logo-image" />
                </div>

                {/* Auth Form Card */}
                <div className="login-card">
                    
                    <h2>{isLoginView ? 'Professor Portal' : 'Create Account'}</h2>
                    
                    <p style={{marginBottom: '2rem'}}>
                        {isLoginView 
                            ? 'Welcome back! Please login to access your dashboard.' 
                            : 'Join us and track your student progress'}
                    </p>

                    <form onSubmit={isLoginView ? handleLogin : handleSignUp}> 

                        {/* FULL NAME (Sign Up Only) */}
                        {!isLoginView && (
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Ex. Juan Dela Cruz"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        )}

                        {/* EMAIL FIELD */}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        {/* PASSWORD FIELD */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder={isLoginView ? 'Enter your password' : 'Create a password'}
                                required
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        
                        {/* CONFIRM PASSWORD (Sign Up Only) */}
                        {!isLoginView && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Repeat your password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        )}

                        {/* ERROR DISPLAY */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        {/* FORGOT PASSWORD LINK (Login Only) */}
                        {isLoginView && (
                            <div className="options-row" style={{justifyContent: 'flex-end'}}>
                                <div className="forgot-password">
                                    <a href="#forgot">Forgot password?</a>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading 
                                ? (isLoginView ? 'Logging in...' : 'Creating Account...') 
                                : (isLoginView ? 'Login' : 'Sign Up')
                            }
                        </button>

                        <div className="separator">Or continue with</div>
                        
                        <button 
                             type="button"
                             className="google-btn" 
                             onClick={handleGoogleSignIn} 
                             disabled={loading}
                        >
                             Sign in with Google
                        </button>
                    </form>

                    {/* SWITCH VIEW BUTTON */}
                    <div className="signup-area">
                        <p>{isLoginView ? "Don't have an account?" : "Already have an account?"}</p>
                        <button 
                             onClick={switchView}
                             style={{ 
                                 background: 'none', 
                                 border: 'none', 
                                 color: '#007bff', 
                                 fontWeight: 'bold', 
                                 cursor: 'pointer', 
                                 textDecoration: 'underline',
                                 fontSize: '0.9rem',
                                 padding: '0',
                                 marginLeft: '5px'
                             }}
                        >
                             {isLoginView ? 'Sign up' : 'Login here'}
                        </button>
                    </div>
                </div>
           </div>
       </div>
    );
};

export default LoginSignUp;