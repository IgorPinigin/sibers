<script setup>
import { useUserStore } from './store/pinia'; 
import { onMounted } from 'vue';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const store = useUserStore();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    store.user = user
    if (user) {
    } 
  });
});
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
