<template>
  <div class="main" @click="showAddChat=false">
    <UserCard />
    <button class="create-chat" @click.stop="showAddChat=true">Создать новый чат</button>

    <ChatsColumn title="Мои чаты" :chats="adminChats"></ChatsColumn>
    <ChatsColumn title="Чаты, в которых я состою" :chats="chats"></ChatsColumn>
    <InviteChatsColumn title="Чаты, в которые меня пригласили" :chats="inviteChats"></InviteChatsColumn>
    <AddChatPopup @click.stop="" v-show="showAddChat"></AddChatPopup>
  </div>
  <div class="blur" @click="showAddChat=false" v-show="showAddChat"></div>
</template>

<script setup>
  import UserCard from './components/UserCard.vue';
  import AddChatPopup from './components/AddChatPopup.vue';
  import ChatsColumn from './components/ChatsColumn.vue';
  import InviteChatsColumn from './components/InviteChatsColumn.vue';
  import { ref, onMounted } from 'vue';
  import { getAdminChats, getChatsForUser } from '../../services/chatFirebase';
  import { useUserStore } from '../../store/pinia';
  import { useRouter } from 'vue-router';

  const store = useUserStore();
  const adminChats =ref([]);
  const chats = ref([]);
  const showAddChat = ref(false);
  const inviteChats = ref([]);
  const router = useRouter()

  onMounted(async()=>{
    if(store.user){
      adminChats.value = await getAdminChats(store.user.uid);
      const allChats = await getChatsForUser(store.user.uid);
      chats.value = allChats.filter(chat => chat.users[store.user.uid] === true)
      inviteChats.value =  allChats.filter(chat => chat.users[store.user.uid] === false)
    }else{
      router.push('/')
    }
  });
</script>

<style lang="css" scoped>
.main{
  width: 100vw;
  height: 100vh;
}
.blur{
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(5px);
}
.create-chat{
  margin-top: 10%;
}
</style>