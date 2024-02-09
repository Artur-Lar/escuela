import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8uKDQ-CId1T1KC1G5MQLTYfQZFvIGLlw",
  authDomain: "storied-line-386619.firebaseapp.com",
  projectId: "storied-line-386619",
  storageBucket: "storied-line-386619.appspot.com",
  messagingSenderId: "847786641652",
  appId: "1:847786641652:web:8a2423936f3c50fb3ff6a1",
  measurementId: "G-X33LSDMDH2",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
