<template>
  <div class="auth">
    Войди в чат
    <div>
      <button @click="signIn">Войти через гугл</button>
    </div>
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

<style lang="css" scoped>
.auth{
  width: 90vw;
  
}
</style>