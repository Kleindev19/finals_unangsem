import React, { useState } from 'react';
import './LoginSignUp.css';
import MyBackgroundImage from './cdmBack.png'; 
import Cdm from './cdmm.png';

// FIREBASE IMPORTS (Auth and Firestore)
import { auth, db } from '../../../apiService'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    // --- NEW IMPORTS FOR GOOGLE SIGN-IN ---
    GoogleAuthProvider, 
    signInWithPopup 
    // ------------------------------------
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const LoginSignUp = ({ onLogin }) => {

    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- LOGIC FOR GOOGLE SIGN-IN (NEW) ---
    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);

        const provider = new GoogleAuthProvider();
        
        try {
            // Initiate the Google sign-in popup flow
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // OPTIONAL: Check and create a user document in Firestore if it's a new user
            // This is good practice to ensure all users have a corresponding profile entry.
            // (You would add logic here to check Firestore before creating the document)

            console.log('Google Sign-In successful, calling onLogin()');
            onLogin(); // Redirect to Dashboard

        } catch (firebaseError) {
            console.error("Google Sign-In Error: ", firebaseError);
            
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                setError('Google sign-in window closed. Please try again.');
            } else if (firebaseError.code === 'auth/cancelled-popup-request') {
                setError('Sign-in cancelled. Try again.');
            } else {
                setError('Google Sign-In failed: ' + firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };
    // ------------------------------------


    // --- LOGIC FOR EMAIL/PASSWORD LOGIN ---
    const handleLogin = async (e) => { 
        e.preventDefault(); 
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Paki-fill up ang lahat ng Email at Password fields.');
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase Login successful, calling onLogin()');
            onLogin(); 

        } catch (firebaseError) {
            console.error('Login Failed:', firebaseError.message);
            
            if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                setError('Maling Email o Password. Pakitiyak ang iyong credentials.');
            } else if (firebaseError.code === 'auth/too-many-requests') {
                setError('Sobrang daming failed attempts. Subukan ulit mamaya.');
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

        // 1. VALIDATION
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
            // 2. FIREBASE AUTH: Create the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. FIRESTORE: Create a user document 
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: fullName,
                email: email,
                role: 'student', 
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
    
    // Function to clear states and switch the view
    const switchView = (toLogin) => {
        setIsLoginView(toLogin);
        setError('');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    // --- JSX RENDER ---
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
               <h2>{isLoginView ? 'Please Login!' : 'Create Account'}</h2>
               <p>{isLoginView ? 'Access your student progress dashboard' : 'Join us and track your progress'}</p>

               <form onSubmit={isLoginView ? handleLogin : handleSignUp}> 

                    {/* Full Name Input (Only visible in Sign Up View) */}
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

                   {/* Email Field */}
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

                   {/* Password Field */}
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
                   
                   {/* Confirm Password Input (Only visible in Sign Up View) */}
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
                        <div style={{ 
                            color: '#FF0000', 
                            textAlign: 'center', 
                            marginBottom: '1rem', 
                            fontWeight: 'bold',
                            padding: '0.5rem',
                            border: '1px solid #FFCCCC',
                            borderRadius: '5px',
                            backgroundColor: '#FFF0F0',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}

                   {/* Options Row (Only visible in Login View) */}
                   {isLoginView && (
                       <div className="options-row">
                           <div className="remember-me">
                               <input type="checkbox" id="remember" name="remember" />
                               <label htmlFor="remember">Remember me</label>
                           </div>
                           <div className="forgot-password">
                               <a href="/forgot-password">Forgot password?</a>
                           </div>
                       </div>
                   )}

                   <button type="submit" className="login-btn" disabled={loading}>
                       {loading ? (isLoginView ? 'Logging in...' : 'Creating Account...') : (isLoginView ? 'Login' : 'Sign Up')}
                   </button>
               </form>

               {/* Separator and Google Button (Only visible in Login View) */}
               {isLoginView && (
                   <>
                       <div className="separator">Or continue with</div>
                       {/* --- THE FIX: Attach the Google handler to the button --- */}
                       <button 
                            className="google-btn" 
                            onClick={handleGoogleSignIn} 
                            disabled={loading}
                        >
                            Sign in with Google
                        </button>
                        {/* ---------------------------------------------------- */}
                   </>
               )}
               
               {/* SWITCH BUTTON AREA */}
               <div className="signup-area">
                   <p>{isLoginView ? "Don't have an account?" : "Already have an account?"}</p>
                   <button 
                       onClick={() => switchView(!isLoginView)}
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