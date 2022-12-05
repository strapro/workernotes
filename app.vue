<template>
  <div>
    <v-btn v-if="!user?.id" color="primary" elevation="2" @click="loginMe"> Login </v-btn>
    <div v-else>
      <v-btn color="primary" elevation="2" @click="logout"> Logout </v-btn>
      <v-text-field label="Worker first name" v-model="workerFirstName"></v-text-field>
      <v-text-field label="Worker last name" v-model="workerLastName"></v-text-field>
      <v-btn color="primary" elevation="2" @click="createWorker"> Create worker </v-btn>

      <v-btn color="primary" elevation="2" @click="getWorkers"> Get worker </v-btn>
      <div v-for="worker in state.workers">
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

type Workers = Awaited<ReturnType<typeof getWorkers>>;

const supabase = useSupabaseClient<Database>();
const client = useSupabaseAuthClient();
const user = useSupabaseUser();

const state: {
  workers: Workers;
} = reactive({
  workers: [],
});

const loginMe = async () => {
  let { data, error } = await client.auth.signInWithPassword({
    email: 'test@test.com',
    password: '123456',
  });

  if (!error) {
    user.value = data.user;

    return data.user;
  }

  return null;
};

const logout = async () => {
  let { error } = await client.auth.signOut();

  if (!error) {
    user.value = null;
  }
};

const workerFirstName = ref('');
const workerLastName = ref('');

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

    console.log(data, error);
  }
};

const getWorkers = async () => {
  if (user.value) {
    let { data: workers, error } = await supabase.from('workers').select('*').eq('manager_id', user.value.id);

    if (!error) {
      state.workers = workers;

      return workers;
    }
  }

  return null;
};
</script>
