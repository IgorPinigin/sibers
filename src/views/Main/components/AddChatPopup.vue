<template>
    <div class="back">
      <input class="search" type="text" @keyup.enter="handleCreateChat" v-model="newChat">
      <div class="users">
        Выбери участников
        <UsersColumnComponent></UsersColumnComponent>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import UsersColumnComponent from './UsersColumnComponent.vue';
import { createChat } from '../../../services/chatFirebase';
import { useUserStore } from '../../../store/pinia';

const store = useUserStore();
const newChat = ref(null);

const handleCreateChat = async() =>{
  await createChat(store.user, newChat.value, ['hgiA1NAeGOaxqwqn6LnIxdKL9Bs1'] );
}

</script>

<style lang="css" scoped>
  .back {
    width: 500px;
    height: 500px;
    background-color: rgb(52, 52, 52);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 24px;
  }

  .users {
    color: white;
  }
</style>