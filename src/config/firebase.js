// Firebase v9+ Modular SDK
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'volunteer-6dca7.firebaseapp.com',
  projectId: 'volunteer-6dca7',
  storageBucket: 'volunteer-6dca7.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: 'https://volunteer-6dca7-default-rtdb.firebaseio.com',
}

let app, auth, db, storage, rtdb, googleProvider

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  rtdb = getDatabase(app)
  googleProvider = new GoogleAuthProvider()
} catch (err) {
  console.warn('Firebase init failed – running in demo mode:', err.message)
}

export { auth, db, storage, rtdb, googleProvider }
export default app
