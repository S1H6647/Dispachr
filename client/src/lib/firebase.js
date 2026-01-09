// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCAwIue-voAoNuZEexYmRRxpfwQ5hwn0y4",
    authDomain: "dispachr-ce47f.firebaseapp.com",
    projectId: "dispachr-ce47f",
    storageBucket: "dispachr-ce47f.firebasestorage.app",
    messagingSenderId: "92637024862",
    appId: "1:92637024862:web:e2d521543fd6b9f144dacf",
    measurementId: "G-4M6DT85EQE",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
