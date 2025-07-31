import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFpYYdbDGWPRHaU-Is9DELgXE70VtdalA",
  authDomain: "videoapp-a4bd1.firebaseapp.com",
  projectId: "videoapp-a4bd1",
  storageBucket: "videoapp-a4bd1.firebasestorage.app",
  messagingSenderId: "740340872620",
  appId: "1:740340872620:web:1e675e4d36e2f480573609",
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, provider, db };
