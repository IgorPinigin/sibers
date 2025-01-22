import { createApp } from "vue";
import "./style.css";
import router from "./router";
import { createPinia } from "pinia";
import App from "./App.vue";
import { useUserStore } from "./store/pinia";
import { auth } from './firebase' 
import { onAuthStateChanged } from 'firebase/auth'

let app;

onAuthStateChanged(auth, (firebaseUser) => {
  if (!app) {
    app = createApp(App);
    app.use(router);
    app.use(createPinia());
    const store = useUserStore();
    store.user = firebaseUser

    app.mount("#app");
  } else {
    const store = useUserStore();
    store.user = firebaseUser
  }
});
