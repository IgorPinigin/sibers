<template>
  <div class="card">
    <div class="icon" :style="iconStyle"></div>
    <div class="name"> {{ store.user.displayName }}</div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../../store/pinia';
import { ref, computed } from 'vue';

const store = useUserStore();
console.log(store.user)
const iconStyle = computed(() => {
  return {
    backgroundImage: store.user 
      ? `url('${store.user.photoURL}')` 
      : 'none'
  }
})
</script>

<style lang="css" scoped>
.card{
  cursor: pointer;
  display: flex;
  align-items: center;
  border-color: rgb(255, 255, 255);
  border-width: 2px;
  gap: 4px;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px;
  background-color: rgba(253, 253, 253, 0.029);
}
.card:hover{
  background-color: rgba(253, 253, 253, 0.069);
}
.icon{
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-position: center;
  background-size: cover;
}
.name{

  color: aliceblue;
  font-size: 20px;
}
</style>