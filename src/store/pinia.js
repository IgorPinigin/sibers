import { defineStore } from "pinia";
import { subscribeOnAuthStateChanged, logout } from "../services/authFirebase"; 
import { ref } from "vue";
export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const initUpdateAuth = () => {
    subscribeOnAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser
    })
  };
  const handleLogout = async() =>{
    await logout();
  }
  return {user, initUpdateAuth, handleLogout}
})