import { initializeApp } from 'firebase/app';
// I-import ang getAuth para sa Authentication
import { getAuth } from 'firebase/auth'; 
// I-import ang getFirestore para sa Database
import { getFirestore } from 'firebase/firestore'; 

// Ang iyong web app's Firebase configuration (galing sa Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDDj92rKECvmKOmevDWe0uYX_N8siky8fw",
  authDomain: "capstone-3rd.firebaseapp.com",
  projectId: "capstone-3rd",
  storageBucket: "capstone-3rd.firebasestorage.app",
  messagingSenderId: "158920983624",
  appId: "1:158920983624:web:1bbea9c41cb481a322047d",
  measurementId: "G-T9QBMSKGTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize at i-export ang services na gagamitin natin
export const auth = getAuth(app);
export const db = getFirestore(app);

// NOTE: Ang mga variables na 'auth' at 'db' ang ginagamit sa ibang files (tulad ng LoginSignUp.jsx)