import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBpywChpZMgafOsBN85iDoUBzRCVhPDPEM",
  authDomain: "expense-tracker-8d3fd.firebaseapp.com",
  projectId: "expense-tracker-8d3fd",
  storageBucket: "expense-tracker-8d3fd.firebasestorage.app",
  messagingSenderId: "534109589861",
  appId: "1:534109589861:web:7671d151f9f794f1ea918c",
  measurementId: "G-V9KZSW6YHH6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;