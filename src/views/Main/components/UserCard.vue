<template>
  <div v-if="store.user" class="card">
    <img :src="store.user.photoURL" :alt="store.user.displayName" class="icon" />
    <div class="name">
      <div>{{ store.user.displayName }}</div>
    </div>
    <div class="exit" @click="logout">Выйти</div>
  </div>
  <div v-else>
    Загрузка...
  </div>
</template>

<script setup>
import { useUserStore } from '../../../store/pinia';
import { ref, computed } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter()
const store = useUserStore();
const iconStyle = computed(() => {
  return {
    backgroundImage: store.user 
      ? `url('${store.user.photoURL}')` 
      : 'none'
  }
});
const logout = async() =>{
  await store.handleLogout();
  router.push('/')
}
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
.exit{
  border: 1px solid;
  border-radius: 8px;
  padding: 6px 24px;
  border-color: rgb(142, 142, 142);
  margin-left: auto;
}
.exit:hover{
  background-color: rgb(207, 6, 6);
  border-color:rgb(207, 6, 6);
}
</style>
