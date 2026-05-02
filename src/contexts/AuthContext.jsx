import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../config/firebase.js'

const AuthContext = createContext(null)

// Demo user for when Firebase is not configured
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@sevalink.ai',
  displayName: 'Demo User',
  photoURL: null,
  role: 'ngo_admin',
  isDemo: true,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY ||
    import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key' ||
    import.meta.env.VITE_FIREBASE_API_KEY === 'your_firebase_api_key_here'

  useEffect(() => {
    if (isDemoMode) {
      // Check localStorage for demo session
      const saved = localStorage.getItem('seva_demo_user')
      if (saved) {
        const u = JSON.parse(saved)
        setUser(u)
        setUserProfile(u)
      }
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Load extra profile from Firestore
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (snap.exists()) {
            setUserProfile({ ...firebaseUser, ...snap.data() })
          } else {
            setUserProfile(firebaseUser)
          }
        } catch {
          setUserProfile(firebaseUser)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [isDemoMode])

  async function loginWithEmail(email, password) {
    if (isDemoMode) {
      const u = { ...DEMO_USER, email, displayName: email.split('@')[0] }
      setUser(u)
      setUserProfile(u)
      localStorage.setItem('seva_demo_user', JSON.stringify(u))
      return u
    }
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function registerWithEmail(email, password, name) {
    if (isDemoMode) {
      const u = { ...DEMO_USER, email, displayName: name }
      setUser(u)
      setUserProfile(u)
      localStorage.setItem('seva_demo_user', JSON.stringify(u))
      return u
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email, role: 'volunteer', createdAt: new Date().toISOString()
    })
    return cred
  }

  async function loginWithGoogle() {
    if (isDemoMode) {
      const u = { ...DEMO_USER, displayName: 'Google Demo User', email: 'google@sevalink.ai' }
      setUser(u)
      setUserProfile(u)
      localStorage.setItem('seva_demo_user', JSON.stringify(u))
      return u
    }
    return signInWithPopup(auth, googleProvider)
  }

  async function logout() {
    if (isDemoMode) {
      localStorage.removeItem('seva_demo_user')
      setUser(null)
      setUserProfile(null)
      return
    }
    return signOut(auth)
  }

  async function updateUserRole(role) {
    const updated = { ...(userProfile || user), role }
    setUserProfile(updated)
    if (isDemoMode) {
      localStorage.setItem('seva_demo_user', JSON.stringify(updated))
      return
    }
    if (user?.uid) {
      await setDoc(doc(db, 'users', user.uid), { role }, { merge: true })
    }
  }

  const value = {
    user, userProfile, loading, isDemoMode,
    loginWithEmail, registerWithEmail, loginWithGoogle, logout, updateUserRole,
    currentRole: userProfile?.role || user?.role || 'viewer',
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
