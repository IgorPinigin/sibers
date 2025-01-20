<template>
  <div class="chat">
    <div class="messages-column" :ref="messageColumn">
      <div v-for="message, index in messages" :key="message.msgId">
        <div class="message-admin" v-if="message.author === 'admin'">{{ message.text }}</div>
        <div v-else :class="[
          'message',
          message.authorId === store.user.uid ? 'message-right' : 'message-left'
        ]">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-avatar"></div>
        </div>
      </div>
    </div>
    <div class="message-insert">
      <input type="" title="Введи сообщение" placeholder="Введи сообщение" @keyup.enter="handleSendMessage"
        v-model="newMessage">
    </div>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref, nextTick } from 'vue';
  import { subscribeToChatMessages, sendMessage } from '../../services/chatFirebase';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '../../store/pinia';
  const store = useUserStore();
  let unsubscribe = null
  const router = useRoute();
  const messages = ref([]);
  const newMessage = ref(null);
  const chatId = router.params.id;
  const messageColumn = ref(null);

  const handleSendMessage = async () => {
    sendMessage(chatId, store.user.uid, newMessage.value)
    newMessage.value = null;
  };

  onMounted(async () => {
    const chatId = router.params.id;
    unsubscribe = subscribeToChatMessages(chatId, (newMessages) => {
      messages.value = newMessages
    })
    await nextTick();
    // После обновления прокручиваем контейнер вниз
    if (messageColumn.value) {
      messageColumn.value.scrollTop = messageColumn.value.scrollHeight;
    }
  })
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

  .messages-column {
    flex: 1;
    overflow-y: auto;
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

  .message {
  display: flex;
  align-items: center;
  margin: 8px 0;
}

/* Оформление «бабла» с текстом */
.message-text {
  text-align: left;
  overflow-wrap: break-word;
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 12px;
}

/* Кружок для аватара (по умолчанию пустой) */
.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  margin-left: 8px; /* Чтобы отделить аватар от текста */
  /* при желании можете добавить border, фон картинки и т.д. */
}

/* --- Сообщения другого пользователя (слева) --- */
.message-left {
  /* Выравниваем основной контент (текст + аватар) влево */
  justify-content: flex-start;
}

.message-left .message-text {
  background-color: #464646;
}

.message-right {
  justify-content: flex-end;
}

.message-right .message-text {
  background-color: #469846;
}

.message-left .message-avatar {
  order: -1;
  margin: 0 8px 0 8px;
}

.message-right .message-avatar {
  order: 1;
  margin: 0 8px 0 8px;
}

</style>