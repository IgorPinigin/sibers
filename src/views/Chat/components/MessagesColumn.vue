<template>
  <div class="messages-column" ref="messageColumn">
    <div v-for="message, index in messages" :key="message.msgId">
      <div class="message-admin" v-if="message.authorId === 'admin'">{{ message.text }}</div>
      <div v-else :class="[
        'message',
        message.authorId === store.user.uid ? 'message-right' : 'message-left'
      ]">
        <div class="message-text">{{ message.text }}</div>
        <div class="message-avatar" :style="{
          backgroundImage: message.photoUrl ? `url(${message.photoUrl})` : ''
        }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { subscribeToChatMessages } from '../../../services/chatFirebase';
  import { useUserStore } from '../../../store/pinia';
  const router = useRoute();
  const messages = ref([]);
  const messageColumn = ref(null);
  const store = useUserStore();
  let unsubscribe = null;

  onMounted(async () => {
    const chatId = router.params.id;
    unsubscribe = subscribeToChatMessages(chatId, async (newMessages) => {
      messages.value = newMessages;
      await nextTick();
      messageColumn.value.scrollTop = messageColumn.value.scrollHeight;
    })
  })
</script>


<style lang="css" scoped>
  .messages-column {
    flex: 1;
    overflow-y: auto;
  }

  .message {
    display: flex;
    align-items: start;
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
    margin-left: 8px;
    background-size: cover;
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