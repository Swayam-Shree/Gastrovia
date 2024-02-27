import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1jBYA5bfD0x9fZTmxYdXesukEfmQdkRE",
  authDomain: "gastrovia-97419.firebaseapp.com",
  projectId: "gastrovia-97419",
  storageBucket: "gastrovia-97419.appspot.com",
  messagingSenderId: "490378083756",
  appId: "1:490378083756:web:3f0a1ef628cd9ef0978e09"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();