<template>
  <div class="header" @click="showInfo=true">
    <div class="name">Чат {{ chatData.name }}</div>
  </div>
  <div class="popup-info" v-show="showInfo">
    <div class="close" @click="showInfo=false">x</div>
    <div class="owner">Владелец: {{ owner.displayName }}</div>
    <div class="invite users">
      Участники:
      <div class="user" v-for="user in inviteUsers" :key="user.uid">
        {{ user.displayName }}
        <div v-show="store.user.uid === owner.uid" class="delete" @click="deleteUser(user.uid)">Удалить</div>
      </div>
    </div>
    <div class="invited users">Приглашены:
      <div class="user" v-for="user in invitedUsers" :key="user.uid">
        {{ user.displayName }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, onMounted, ref } from 'vue';
  import { getChatById, getChatUsersByStatus } from '../../../services/chatFirebase'
  import { useUserStore } from '../../../store/pinia';
  const chatData = ref('');
  const owner = ref('');
  const inviteUsers = ref([]);
  const invitedUsers = ref([]);
  const showInfo = ref(false);
  const props = defineProps(
    { chatId: String }
  );
  const store = useUserStore();
  onMounted(async () => {
    chatData.value = await getChatById(props.chatId);
    const users = await getChatUsersByStatus(props.chatId);
    owner.value = users.owner;
    inviteUsers.value = users.trueUsers;
    invitedUsers.value = users.falseUsers;
  });
  const deleteUser = async(user) => {
    store.deleteUserFromChat(props.chatId, user);
  } 

</script>

<style lang="css" scoped>
  .header {
    height: 60px;
    background-color: rgba(253, 253, 253, 0.029);
    cursor: pointer;
  }

  .name {
    font-size: xx-large
  }

  .popup-info {
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

  .owner {
    margin-top: 40px;
    font-size: larger;
  }

  .user {
    text-align: start;
    padding: 16px 12px;
    box-sizing: content-box;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(156, 156, 156);
    cursor: pointer;
  }
  .delete{
    background-color: rgb(128, 0, 0);
    padding: 2px 4px;
    border-radius: 6px;
  }
  .delete:hover{
    background-color: rgb(86, 0, 0);
  }
  .close {
    position: absolute;
    top: 5px;
    right: 20px;
    cursor: pointer;
  }
</style>