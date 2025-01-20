<template>
  <div>
    <div class="user" v-for="user, index in allUsers" :key="user.uid">
      {{ user.displayName }}
    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../../store/pinia';
  import { getAllUsers } from '../../../services/chatFirebase';
  import { onMounted, ref } from 'vue';

  const allUsers = ref([])
  const store = useUserStore()

  onMounted(async () => {
    allUsers.value = await getAllUsers(store.user.uid);
  })

</script>

<style lang="scss" scoped></style>
