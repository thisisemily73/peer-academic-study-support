import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBx3dELZ5G1l42T-BK-MXvXuNe3CG-WyAs",
  authDomain: "peer-academic-study-support.firebaseapp.com",
  projectId: "peer-academic-study-support",
  storageBucket: "peer-academic-study-support.firebasestorage.app",
  messagingSenderId: "803623793270",
  appId: "1:803623793270:web:cc188fce42ab4d47e6e557"
};

const app = initializeApp(firebaseConfig);

// export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);