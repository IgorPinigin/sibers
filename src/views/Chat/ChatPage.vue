<template>
  <div class="chat">
    <ChatInfo :chatId="chatId"></ChatInfo>
    <MessagesColumn></MessagesColumn>
    <div class="message-insert">
      <input type="" title="Введи сообщение" placeholder="Введи сообщение" @keyup.enter="handleSendMessage"
        v-model="newMessage">
      <button @click="handleSendMessage">Отправить</button>
    </div>
  </div>
</template>

<script setup>
  import { onUnmounted, ref } from 'vue';
  import { sendMessage } from '../../services/chatFirebase';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '../../store/pinia';
  import MessagesColumn from './components/MessagesColumn.vue';
  import ChatInfo from './components/ChatInfo.vue';
  const store = useUserStore();
  let unsubscribe = null
  const router = useRoute();
  const newMessage = ref(null);
  const chatId = router.params.id;


  const handleSendMessage = async () => {
    sendMessage(chatId, store.user.uid, store.user.photoURL, newMessage.value)
    newMessage.value = null;
  };

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })
</script>

<style lang="css" scoped>
  .chat {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .message-admin {
    margin-left: auto;
    margin-right: auto;
    font-size: small;
    color: rgb(157, 157, 157);
  }

  .message-insert {
    width: 100vw;
    height: 40px;
    display: flex;
  }

  input {
    font-size: large;
    flex: 1
  }

  

</style>