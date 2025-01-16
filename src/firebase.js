import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAYCSLQmxHOVugV8UJprLE1vSrBHfe5UTY",
  authDomain: "sibers-cb6d8.firebaseapp.com",
  databaseURL: "https://sibers-cb6d8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sibers-cb6d8",
  storageBucket: "sibers-cb6d8.firebasestorage.app",
  messagingSenderId: "935621574535",
  appId: "1:935621574535:web:b657b5edbf33c9ad2b1d22",
  measurementId: "G-QXW8RKRDN8"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);