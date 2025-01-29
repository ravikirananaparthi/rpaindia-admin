// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDlRN4XuH94QX8AP_Tm92HEozjDCG2YLA",
  authDomain: "rpaindia-web.firebaseapp.com",
  projectId: "rpaindia-web",
  storageBucket: "rpaindia-web.firebasestorage.app",
  messagingSenderId: "436250009182",
  appId: "1:436250009182:web:edf1ccb066951575341ecf",
  measurementId: "G-LYRE9EDZV7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
