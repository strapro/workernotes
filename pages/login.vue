<template>
  <v-sheet class="login-container d-flex align-center justify-center">
    <div>
      <v-img src="logo.png" />
      <v-card width="400">
        <v-card-text>
          <v-form>
            <v-text-field
              prepend-inner-icon="mdi-account-circle"
              variant="underlined"
              name="email"
              v-model="email"
              placeholder="email"
              type="text"
            ></v-text-field>
            <v-text-field
              prepend-inner-icon="mdi-lock"
              variant="underlined"
              name="password"
              v-model="password"
              placeholder="password"
              type="password"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" variant="text" @click="loginMe"> Login </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-sheet>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
const client = useSupabaseAuthClient();

const email = ref('test@test.com');
const password = ref('123456');

const loginMe = async () => {
  let { data, error } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
};

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard');
  }
});

definePageMeta({
  layout: 'empty',
});
</script>

<style lang="scss">
.login-container {
  height: 100%;
  background: #e76361;

  .v-img {
    margin-left: -30px;
    height: 112px;
  }
}
</style>
