import React, { useState } from 'react';
import './LoginSignUp.css';
import MyBackgroundImage from './cdmBack.png'; 
import Cdm from './cdmm.png';

// 1. Tiyakin na Tumatanggap ng 'onLogin' Prop
const LoginSignUp = ({ onLogin }) => { // <--- IBINALIK ANG { onLogin }

    // State para sa inputs (Best Practice)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault(); 

        // Optional: Maglagay ng basic check
        if (!email || !password) {
            alert('Paki-fill up ang lahat ng fields.');
            return;
        }

        // 2. TAWAGIN ANG onLogin() FUNCTION DITO!
        // Ito ang nagpapalit ng state sa App.js at nagpapakita ng Dashboard.
        console.log('Login successful, calling onLogin()');
        onLogin(); // <--- FINAL STEP

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
       {/* Inalis ang background-container div na walang laman */}

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
                           value={email} // I-link sa state
                           onChange={(e) => setEmail(e.target.value)} // Update state
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
                           value={password} // I-link sa state
                           onChange={(e) => setPassword(e.target.value)} // Update state
                       />
                   </div>

                   {/* ... (rest of form elements: options, separator, Google button) ... */}
                   
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