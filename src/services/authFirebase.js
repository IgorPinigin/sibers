import { auth } from "../firebase";
import {GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from "firebase/auth";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  try {
    const result = await signInWithPopup(auth, provider)
    console.log('Ты вошел');
  return result.user
  } catch (error) {
    console.error('Ошибка при входе через Google:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    console.log('Ты вышел');
  } catch (error) {
    console.error('Ошибка при выходе из аккаунта:', error)
    throw error
  }
}

export const subscribeOnAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback)
}