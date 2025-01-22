import { createRouter, createWebHistory} from "vue-router";
import AuthPage from "../views/Auth/AuthPage.vue";
import MainPage from "../views/Main/MainPage.vue";
import ChatPage from "../views/Chat/ChatPage.vue";
const routes = [
  {
    path: "/",
    name: "auth",
    component: AuthPage,
  },
  {
    path: "/main",
    name: "main",
    component: MainPage,
  },
  {
    path: "/chat/:id",
    name: "chat",
    component: ChatPage,
    props: true 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;