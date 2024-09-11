import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "smartcampus-channels.firebaseapp.com",
  projectId: "smartcampus-channels",
  storageBucket: "smartcampus-channels.appspot.com",
  messagingSenderId: "593617900687",
  appId: "1:593617900687:web:1a529e750105151f8f8cfa"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = getAnalytics(app);