<template>
  <div>
    <v-btn v-if="!user?.id" color="primary" elevation="2" @click="loginMe"> Login </v-btn>
    <div v-else>
      <v-btn color="primary" elevation="2" @click="logout"> Logout </v-btn>
      <v-text-field label="Worker first name" v-model="workerFirstName"></v-text-field>
      <v-text-field label="Worker last name" v-model="workerLastName"></v-text-field>
      <v-btn color="primary" elevation="2" @click="createWorker"> Create worker </v-btn>

      <div v-for="worker in workers">
        <div>{{ worker.id }}</div>
        <div>{{ worker.manager_id }}</div>
        <div>{{ worker.first_name }}</div>
        <div>{{ worker.last_name }}</div>
        <div>{{ worker.created_at }}</div>
        <div>{{ worker.updated_at }}</div>
        <br /><br />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

const { $uuid } = useNuxtApp();

const supabase = useSupabaseClient<Database>();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();

const loginMe = async () => {
  let { data, error } = await client.auth.signInWithPassword({
    email: 'test@test.com',
    password: '123456',
  });
};

const logout = async () => {
  let { error } = await client.auth.signOut();
};

const workerFirstName = ref('');
const workerLastName = ref('');

const { data: workers, refresh: refreshWorkers } = await useAsyncData(
  'workers',
  async () => {
    if (user.value) {
      const { data, error } = await supabase.from('workers').select('*').eq('manager_id', user.value.id);

      if (!error) {
        return data;
      }
    }

    return null;
  },
  { watch: [user] }
);

const createWorker = async () => {
  if (user.value) {
    const { data, error } = await supabase.from('workers').insert([
      {
        id: $uuid(),
        first_name: workerFirstName.value,
        last_name: workerLastName.value,
        manager_id: user.value.id,
      },
    ]);

    if (!error) {
      refreshWorkers();

      return data;
    }

    return null;
  }
};
</script>
