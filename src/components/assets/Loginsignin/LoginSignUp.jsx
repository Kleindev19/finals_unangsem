import React, { useState } from 'react';
import './LoginSignUp.css';
import MyBackgroundImage from './cdmBack.png'; 
import Cdm from './cdmm.png';

// 1. FIREBASE IMPORTS: I-import ang auth service at ang sign-in function.
import { auth } from '../../../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; 

// 2. Tiyakin na Tumatanggap ng 'onLogin' Prop
const LoginSignUp = ({ onLogin }) => {

    // State para sa inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // New State: Para sa error messages (papalit sa alert())
    const [error, setError] = useState('');

    // Gawing 'async' ang function dahil gagamit tayo ng await para sa Firebase
    const handleLogin = async (e) => { 
        e.preventDefault(); 
        setError(''); // I-clear ang previous errors

        // Basic validation check
        if (!email || !password) {
            setError('Paki-fill up ang lahat ng Email at Password fields.');
            return;
        }

        try {
            // 3. FIREBASE LOGIN: Subukan i-log in ang user gamit ang credentials
            await signInWithEmailAndPassword(auth, email, password);

            // KUNG SUCCESSFUL: Tawagin ang onLogin()
            console.log('Firebase Login successful, calling onLogin()');
            onLogin(); 

        } catch (firebaseError) {
            // KUNG MAY ERROR: I-handle ang Firebase error codes at magpakita ng user-friendly message
            console.error('Login Failed:', firebaseError.message);
            
            if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                setError('Maling Email o Password. Pakitiyak ang iyong credentials.');
            } else {
                setError('Login failed: ' + firebaseError.message);
            }
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
       {/* Main Content */}
       <div className="container">
           {/* Logo Area */}
           <div className="logo-area">
               <img 
                   src={Cdm} 
                   alt="Colegio de Montalban Logo" 
                   className="logo-image" 
               />
           </div>

           {/* Login Form Card */}
           <div className="login-card">
               <h2>Please login!</h2>
               <p>Access your student progress dashboard</p>

               {/* I-link ang form sa handleLogin */}
               <form onSubmit={handleLogin}> 

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
                           placeholder="Enter your password"
                           required
                           value={password} 
                           onChange={(e) => setPassword(e.target.value)} 
                       />
                   </div>
                   
                   {/* 4. ERROR DISPLAY: Dito ipapakita ang error message kung meron */}
                   {error && (
                        <div style={{ 
                            color: '#FF0000', 
                            textAlign: 'center', 
                            marginBottom: '1rem', 
                            fontWeight: 'bold',
                            padding: '0.5rem',
                            border: '1px solid #FFCCCC',
                            borderRadius: '5px'
                        }}>
                            {error}
                        </div>
                    )}

                   <div className="options-row">
                       <div className="remember-me">
                           <input type="checkbox" id="remember" name="remember" />
                           <label htmlFor="remember">Remember me</label>
                       </div>
                       <div className="forgot-password">
                           <a href="/forgot-password">Forgot password?</a>
                       </div>
                   </div>

                   <button type="submit" className="login-btn">
                       Login
                   </button>
               </form>

               <div className="separator">Or continue with</div>
               <button className="google-btn">Sign in with Google</button>
               <div className="signup-area">
                   <p>Don't have an account?</p>
                   <a href="/signup">Sign up</a>
               </div>
           </div>
       </div>
   </div>
    );
};

export default LoginSignUp;