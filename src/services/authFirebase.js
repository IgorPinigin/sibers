import { auth, db } from "../firebase";
import {GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from "firebase/auth";
import {
  getDatabase,
  ref,
  get,
  set,
  child
} from "firebase/database"
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user;
    const userRef = ref(db, `users/${user.uid}`)
    const snapshot = await get(userRef)
    if (!snapshot.exists()) {
      await set(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      })
    }
    return result.user
  } catch (error) {
    console.error('Ошибка при входе через Google:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Ошибка при выходе из аккаунта:', error)
    throw error
  }
}

export const subscribeOnAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback)
}