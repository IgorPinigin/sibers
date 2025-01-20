<template>
  <div class="main" @click="showAddChat=false">
    <UserCard />
    <!-- <div>
      <input type="text" @keyup.enter="handleSendMessage" v-model="newMessage">
      <button>Отправить сообщение</button>
    </div> -->
      <!-- <input type="text" @keyup.enter="handleCreateChat" v-model="newChat"> -->
    <button class="create-chat" @click.stop="showAddChat=true">Создать новый чат</button>

    <ChatsColumn title="Мои чаты" :chats="adminChats"></ChatsColumn>
    <ChatsColumn title="Чаты, в которых я состою" :chats="chats"></ChatsColumn>
    <AddChatPopup @click.stop="" v-show="showAddChat"></AddChatPopup>
  </div>

</template>

<script setup>
  import UserCard from './components/UserCard.vue';
  import AddChatPopup from './components/AddChatPopup.vue';
  import ChatsColumn from './components/ChatsColumn.vue';
  import { ref, onMounted } from 'vue';
  import { sendMessage, getAdminChats, getChatsForUser } from '../../services/chatFirebase';
  import { useUserStore } from '../../store/pinia';

  const store = useUserStore();
  const newMessage = ref(null);
  const adminChats =ref([]);
  const chats = ref([]);
  const showAddChat = ref(false);

  const handleSendMessage = async () => {
    await sendMessage('', '', newMessage.value)
  };

  onMounted(async()=>{
    adminChats.value = await getAdminChats(store.user.uid);
    chats.value = await getChatsForUser(store.user.uid);
  });
</script>

<style lang="css" scoped>
.main{
  width: 100vw;
  height: 100vh;
}
.create-chat{
  margin-top: 10%;
}
</style>