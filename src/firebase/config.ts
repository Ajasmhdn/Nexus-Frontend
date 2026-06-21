/**
 * Firebase configuration object for the Nexus project.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCKoV1mUeTMt-8YQtx8oOExyPXPu8ET4AI",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nexus-35a85.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nexus-35a85",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nexus-35a85.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "652636577139",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:652636577139:web:9d0052b29a302c2b0db906",
  measurementId: "G-93TCFJ5J9H"
};
