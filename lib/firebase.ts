// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWsES1g4AC6xgDhMdgOXlqHl8Fhvk6g5Y",
  authDomain: "dss-bantu.firebaseapp.com",
  projectId: "dss-bantu",
  storageBucket: "dss-bantu.appspot.com",
  messagingSenderId: "830591607910",
  appId: "1:830591607910:web:97c2a7347adba61537b9a7",
  measurementId: "G-2VVNQF7DQD"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)

export { app, auth }