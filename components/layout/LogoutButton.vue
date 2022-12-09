<template>
  <v-btn color="primary" elevation="2" @click="logout"> Logout </v-btn>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
const client = useSupabaseAuthClient();

const logout = async () => {
  let { error } = await client.auth.signOut();
};

watchEffect(() => {
  if (!user.value) {
    navigateTo('/login');
  }
});
</script>
