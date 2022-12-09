<template>
  <div>
    <v-btn color="primary" elevation="2" @click="loginMe"> Login </v-btn>
  </div>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
const client = useSupabaseAuthClient();

const loginMe = async () => {
  let { data, error } = await client.auth.signInWithPassword({
    email: 'test@test.com',
    password: '123456',
  });
};

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard');
  }
});
</script>
