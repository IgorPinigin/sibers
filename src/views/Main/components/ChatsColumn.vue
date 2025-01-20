<template>
  <div class="chat-block">
    <div class="title">{{ props.title }}</div>
    <div>
      <div class="chat" v-for="chat, index in props.chats" @click="openChat(chat)" :key="index">
        {{ chat.name }}
      </div>
    </div>
  </div>

</template>

<script setup>
  import { defineProps, } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps({
    title: String,
    chats: Array
  });
  const openChat = (chat) => {
    console.log(chat)
    router.push(`/chat/${chat.chatId}`)
  };
</script>

<style lang="css" scoped>
  .chat-block {
    margin-top: 12px;
    height: fit-content;
    max-height: -30%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid rgb(156, 156, 156);
    border-radius: 12px;
    background-color: rgba(247, 247, 247, 0.103);
    box-shadow: rgba(255, 255, 255, 0.109) 0px 3px 8px;
  }

  .title {
    background-color: #242424;
    font-size: x-large;
    text-decoration: underline;
    border-top-left-radius: 13px;
    border-top-right-radius: 13px;
    padding: 6px 0px;
  }

  .chat {
    padding: 12px 12px;
    cursor: pointer;
    text-align: left;
  }
</style>