<template>
  <div class="back">
    <div class="name">
      <input type="text" placeholder="Введи название чата" @keyup.enter="handleCreateChat" v-model="newChat">
    </div>
    Выбери участников
      <div class="name">
        <input type="text" placeholder="Поиск участника" v-model="filter" @input="store.filterUsers(filter)">
      </div>
    <div class="users">
      <UsersColumnComponent></UsersColumnComponent>
      
    </div>
    <button @click="handleCreateChat">Создать чат</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import UsersColumnComponent from './UsersColumnComponent.vue';
  import { createChat } from '../../../services/chatFirebase';
  import { useUserStore } from '../../../store/pinia';

  const store = useUserStore();
  const newChat = ref(null);
  const filter = ref(null);

  const handleCreateChat = async () => {
    console.log(store.selectedUids)
    await createChat(store.user, newChat.value, store.selectedUids);
  }

</script>

<style lang="css" scoped>
  .back {
    width: 90%;
    max-width: 500px;
    height: 500px;
    background-color: rgb(52, 52, 52);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 24px;
    z-index: 101;
    display: flex;
    flex-direction: column;
  }

  .name {
    margin-top: 12px;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    height: 40px;
    display: flex;
  }

  input {
    font-size: larger;
    flex: 1;
  }

  .users {
    margin-top: 32px;
    color: white;
    overflow-y: auto;
    flex: 1;
  }

</style>