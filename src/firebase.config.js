// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3ik27VTX4OJit1hDesrytLV2vzvTiMEA",
  authDomain: "marketplace-ce168.firebaseapp.com",
  projectId: "marketplace-ce168",
  storageBucket: "marketplace-ce168.appspot.com",
  messagingSenderId: "5695508641",
  appId: "1:5695508641:web:6d00b3a0bb72ab4ac5a0e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
