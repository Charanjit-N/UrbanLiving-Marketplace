import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "urbanliving-oauth.firebaseapp.com",
  projectId: "urbanliving-oauth",
  storageBucket: "urbanliving-oauth.firebasestorage.app",
  messagingSenderId: "205471438522",
  appId: "1:205471438522:web:0491466bfbcbbe2476d483"
};

export const app = initializeApp(firebaseConfig);