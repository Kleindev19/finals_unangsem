import React, { useState } from 'react';
import './LoginSignUp.css';
import MyBackgroundImage from './cdmBack.png'; 
import Cdm from './cdmm.png';

// Import the specific component for student number login
// NOTE: Make sure the path below is correct for your project structure
// import StudentLoginStudents from '../path/to/StudentLoginStudents'; 

// FIREBASE IMPORTS (Auth and Firestore)
import { auth, db } from '../../../apiService'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const LoginSignUp = ({ onLogin, history }) => { // Added history prop for navigation

    const [isLoginView, setIsLoginView] = useState(true);
    const [userRole, setUserRole] = useState('teacher'); // NEW: Default to teacher/general
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [studentNumber, setStudentNumber] = useState(''); // NEW: For student login

    // Function to clear states and switch the view
    const switchView = (toLogin) => {
        setIsLoginView(toLogin);
        setError('');
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setStudentNumber(''); // Clear student number on view switch
    };
    
    // NEW: Function to handle role switch and clear credentials
    const handleRoleSwitch = (role) => {
        setUserRole(role);
        switchView(true); // Always switch to login view upon role change
    };

    // NEW: Logic for Student Number Only Login
    const handleStudentLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!studentNumber) {
            setError('Paki-fill up ang Student Number field.');
            setLoading(false);
            return;
        }

        // --- CORE REQUIREMENT: NAVIGATE TO StudentLoginStudents.jsx UI ---
        // Assuming 'history' is passed from react-router-dom, or use a redirect function.
        // If you are using React Router v6, you would use useNavigate().
        // For demonstration, we'll log the action and use a placeholder.
        console.log(`Student Login attempted with Student Number: ${studentNumber}`);
        console.log("Navigating to StudentLoginStudents.jsx UI...");
        
        // **IMPLEMENT ACTUAL NAVIGATION HERE**
        // Example: if using an old React Router:
        // history.push('/student-login-students'); 
        
        // For this example, we'll just simulate success and stop loading.
        // REMEMBER TO REMOVE THE TIMEOUT and implement actual navigation/API call.
        setTimeout(() => {
             setLoading(false);
             // *** Replace with actual navigation to StudentLoginStudents component/route ***
             // If this component IS the StudentLoginStudents.jsx, you'd call onLogin() here.
             // If not, you need a router solution to switch components.
             // For now, let's call a placeholder success action.
             console.log("SUCCESS: Simulated redirect to StudentLoginStudents UI.");
        }, 1000); 
    };

    // --- LOGIC FOR GOOGLE SIGN-IN ---
    const handleGoogleSignIn = async () => {
        // ... (Keep existing handleGoogleSignIn logic here)
        setError('');
        setLoading(true);

        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            console.log('Google Sign-In successful, calling onLogin()');
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
    // ------------------------------------


    // --- LOGIC FOR EMAIL/PASSWORD LOGIN (for Teacher) ---
    const handleLogin = async (e) => { 
        // ... (Keep existing handleLogin logic here)
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
            } else {
                setError('Login failed: ' + firebaseError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC FOR SIGN UP (for Teacher/General) ---
    const handleSignUp = async (e) => {
        // ... (Keep existing handleSignUp logic here)
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

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: fullName,
                email: email,
                // Assign role based on current selected role for signup, or default to general/teacher
                role: userRole === 'teacher' ? 'teacher' : 'general', 
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
    
    // --- JSX RENDER ---
    const isStudentLogin = userRole === 'student' && isLoginView;
    const isTeacherLogin = userRole === 'teacher' && isLoginView;
    const isTeacherSignup = userRole === 'teacher' && !isLoginView;

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
                
                {/* 🎯 NEW: TEACHER/STUDENT TOGGLE */}
                <div className="role-toggle">
                    <button 
                        className={`role-btn ${userRole === 'teacher' ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('teacher')}
                    >
                        Teacher
                    </button>
                    <button 
                        className={`role-btn ${userRole === 'student' ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('student')}
                    >
                        Student
                    </button>
                </div>
                {/* ---------------------------------- */}

                <h2>{isLoginView ? 'Please login!' : 'Create Account'}</h2>
                
                <p>
                    {isStudentLogin 
                        ? 'Enter your Student Number to access your dashboard.' 
                        : isTeacherLogin 
                        ? 'Access your student progress dashboard.' 
                        : 'Join us and track your progress'}
                </p>

                <form onSubmit={isStudentLogin ? handleStudentLogin : (isLoginView ? handleLogin : handleSignUp)}> 

                    {/* 🎯 STUDENT NUMBER FIELD (Only for Student Login) */}
                    {isStudentLogin && (
                        <div className="form-group">
                            <label htmlFor="studentNumber">Student Number</label>
                            <input
                                type="text"
                                id="studentNumber"
                                placeholder="Enter your Student Number"
                                required
                                value={studentNumber}
                                onChange={(e) => setStudentNumber(e.target.value)}
                                autoFocus
                            />
                             
                        </div>
                        
                        
                    )}
                    {isStudentLogin && (
                    <>
                        <div className="separator">Or continue with</div>
                        <button 
                             className="google-btn" 
                             onClick={handleGoogleSignIn} 
                             disabled={loading}
                        >
                             Sign in with Google
                        </button>
                    </>
                )}
                    
                    
                    
                    {/* -------------------------------------------------- */}


                    {/* FULL NAME INPUT (Only visible in Sign Up View) */}
                    {isTeacherSignup && (
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

                    {/* EMAIL FIELD (Visible for Teacher Login/Signup) */}
                    {(isTeacherLogin || isTeacherSignup) && (
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
                    )}

                    {/* PASSWORD FIELD (Visible for Teacher Login/Signup) */}
                    {(isTeacherLogin || isTeacherSignup) && (
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
                    )}
                    
                    {/* CONFIRM PASSWORD INPUT (Only visible in Sign Up View) */}
                    {isTeacherSignup && (
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

                    {/* OPTIONS ROW (Only visible in Teacher Login View) */}
                    {isTeacherLogin && (
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
                        {loading 
                            ? (isLoginView ? 'Logging in...' : 'Creating Account...') 
                            : (isLoginView ? 'Login' : 'Sign Up')
                        }
                    </button>
                         {isTeacherLogin && (
                    <>
                        <div className="separator">Or continue with</div>
                        <button 
                             className="google-btn" 
                             onClick={handleGoogleSignIn} 
                             disabled={loading}
                        >
                             Sign in with Google
                        </button>
                    </>
                )}
                </form>

               
             
                
                {/* SWITCH BUTTON AREA (Only visible for Teacher/General) */}
                {userRole === 'teacher' && (
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
                )}
            </div>
       </div>
   </div>
    );
};

export default LoginSignUp;