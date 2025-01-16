<template>
  Ghbdtn
  <div>
    <button @click="signIn">Авторизоваться</button>
    <button @click="logout">Выйти</button>
  </div>
</template>

<script setup>
import { signInWithGoogle, logout } from '../services/authFirebase';

const signIn = async() =>{
  const user = await signInWithGoogle();
  console.log(user);
}
</script>

<style lang="scss" scoped>

</style>