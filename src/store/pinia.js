import { defineStore } from "pinia";
import { subscribeOnAuthStateChanged, logout } from "../services/authFirebase";
import { getAllUsers, setUserInChatToTrue, removeUserFromChat } from "../services/chatFirebase";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const allUsers = ref([]);
  const filteredUsers = ref([]);
  const selectedUsers = ref([]);
  const selectedUids = computed(() => {
    return selectedUsers.value.map((u) => u.uid);
  });

  const initUpdateAuth = () => {
    subscribeOnAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser;
    });
  };
  const handleLogout = async () => {
    await logout();
  };
  const getUsers = async (user) => {
    allUsers.value = await getAllUsers(user);
    filteredUsers.value = allUsers.value;
  };
  const filterUsers = (str) => {
    filteredUsers.value = allUsers.value.filter((user) =>
      user.displayName.toUpperCase().includes(str.toUpperCase())
    );
  };
  const selectUser = (user) => {
    const user_ = selectedUsers.value.find(
      (user_) => user_.uid.toUpperCase() === user.uid.toUpperCase()
    );
    if (user_) {
      selectedUsers.value = selectedUsers.value.filter(
        (user_) => user_.uid.toUpperCase() !== user.uid.toUpperCase()
      );
    } else {
      selectedUsers.value.push(user);
    }
  };

  const inviteToChat = async (chatId, userId) => {
    await setUserInChatToTrue(chatId, userId);
  };

  const deleteUserFromChat = async (chatId, userId) => {
    await removeUserFromChat(chatId, userId);
  };

  return {
    user,
    allUsers,
    filteredUsers,
    selectedUsers,
    selectedUids,
    selectUser,
    initUpdateAuth,
    handleLogout,
    getUsers,
    filterUsers,
    inviteToChat,
    deleteUserFromChat
  };
});
