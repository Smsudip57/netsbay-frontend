import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeORWehlO9PWmM1ijeru75n8mbdT24cDg",
  authDomain: "netbay-c3166.firebaseapp.com",
  projectId: "netbay-c3166",
  storageBucket: "netbay-c3166.firebasestorage.app",
  messagingSenderId: "732856487939",
  appId: "1:732856487939:web:e58eca73d0efd03dba7e36",
  measurementId: "G-NB922VC5PQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);

export default app;
