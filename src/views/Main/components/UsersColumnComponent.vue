<template>
  <div class="users-column">
    <div v-if="store.user" class="user" :class="isSelected(user) ? 'selected' : ''" v-for="user, index in store.filteredUsers" :key="user.uid"
      @click="store.selectUser(user)">
      {{ user.displayName }}
      <div v-if="isSelected(user)">Выбран</div>
    </div>
    <div v-else>Загрузка</div>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../../store/pinia';
  import { onMounted, ref } from 'vue';

  const store = useUserStore();

  const isSelected = (user) => {
    const user_ = store.selectedUsers.find(user_ => user_.uid === user.uid)
    if (user_) return true
  }
  onMounted(async () => {
    
      await store.getUsers(store.user.uid);
  })

</script>

<style lang="css" scoped>
  .users-column{
    height: 100%
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

  .user:hover {
    background-color: #0000001f;
    transition: ease-in-out 200ms;
  }

  .user:first-child {
    border-top: 1px solid rgb(156, 156, 156);
  }

  .selected {
    background-color: #0000001f;
  }
</style>
