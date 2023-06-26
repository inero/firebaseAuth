// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as firebase from "firebase/auth";

// import * as auth from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6CQ7RC6CPWnf75TTxkSwFH6QAOyaNNe4",
  authDomain: "fir-auth-aaa2e.firebaseapp.com",
  projectId: "fir-auth-aaa2e",
  storageBucket: "fir-auth-aaa2e.appspot.com",
  messagingSenderId: "904217172879",
  appId: "1:904217172879:web:b39b700ac2266d642d89fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { firebase };
