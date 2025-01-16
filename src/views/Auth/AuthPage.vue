<template>
  Войди в чат
  <div>
    <button @click="signIn">Войти через гугл</button>
  </div>
</template>

<script setup>
import { signInWithGoogle } from '../../services/authFirebase';
import { useRouter } from 'vue-router';

const router = useRouter()

const signIn = async() =>{
  const user = await signInWithGoogle();
  if (user) router.push('/main')
}
</script>

<style lang="scss" scoped>

</style>