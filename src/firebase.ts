// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  HttpsCallable,
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHk4eWhC1CtvHKK5BiAYR-u_YtF_XMPro",
  authDomain: "munitests.firebaseapp.com",
  projectId: "munitests",
  storageBucket: "munitests.appspot.com",
  messagingSenderId: "1077388651771",
  appId: "1:1077388651771:web:57091f8ccde714af1dd45e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFunctionsEmulator(functions, "localhost", 5001);

  try {
    createUserWithEmailAndPassword(auth, "test@email.com", "12345678");
  } catch (error) {
    console.log("User already exists");
  }
}

import { MessageParams, MessageResponse } from "ibm-watson/assistant/v1";

const functionsApi: {
  messageAssistant: HttpsCallable<MessageParams, MessageResponse>;
} = {
  messageAssistant: httpsCallable(functions, "messageAssistant"),
};

export { app, db, auth, functions, functionsApi };
