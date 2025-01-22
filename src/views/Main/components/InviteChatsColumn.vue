<template>
  <div class="chat-block">
    <div class="title">{{ props.title }}</div>
    <div>
      <div class="chat" v-for="chat, index in props.chats" :key="index">
        {{ chat.name }}
        <div class="invite">
          <div class="btn true" @click="invite(chat)">принять</div>
          <div class="btn false" @click="deleteChat(chat)">отклонить</div>
        </div>
      </div>
      
      <div class="chat" v-if="props.chats.length === 0"> Не найдено ни одного чата</div>
    </div>
  </div>

</template>

<script setup>
  import { defineProps, } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../../../store/pinia';
  const store = useUserStore();

  const router = useRouter();
  const props = defineProps({
    title: String,
    chats: Array
  });

  const invite = (chat) =>{
    store.inviteToChat(chat.chatId, store.user.uid);
    openChat(chat);
  };
  const deleteChat = (chat) =>{
    store.deleteUserFromChat(chat.chatId, store.user.uid);
  };
  const openChat = (chat) => {
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
    border-bottom: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chat:hover {
    background-color: #0000001f;
    transition: ease-in-out 200ms; 
  }
  .chat:last-child {
    border-bottom: 0px
  }
  .divider{
    height: 1px;
    background-color: black;
  }
  .invite{
    display: flex;
    gap: 8px;
  }
  .true{
    background-color: green;
  }
  .true:hover{
    background-color: rgb(1, 88, 1);
  }
  .false{
    background-color: rgb(128, 0, 0);
  }
  .false:hover{
    background-color: rgb(86, 0, 0);
  }
  .btn{
    padding: 2px 4px;
    border-radius: 6px;
  }
  
</style>