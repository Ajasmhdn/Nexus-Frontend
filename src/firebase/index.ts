
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;

export function initializeFirebase(): {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  if (!app) {
    // Standard singleton pattern for Next.js to prevent multiple initializations
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    firestore = getFirestore(app);
    auth = getAuth(app);
  }

  return { app, firestore, auth };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
