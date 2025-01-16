<script setup>
import { useUserStore } from './store/pinia'; 
import { onMounted } from 'vue';
const store = useUserStore();
onMounted(() => {
  store.initUpdateAuth();
})
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
