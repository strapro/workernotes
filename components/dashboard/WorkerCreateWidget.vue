<template>
  <v-card class="mx-auto">
    <v-img height="150" src="no-pic.png"></v-img>

    <v-card-title>New Worker</v-card-title>

    <v-card-text>
      <v-text-field label="Worker first name" v-model="workerFirstName"></v-text-field>
      <v-text-field label="Worker last name" v-model="workerLastName"></v-text-field>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-actions class="justify-end">
      <v-btn color="primary" elevation="2" @click="createWorker"> Create worker </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

const emit = defineEmits<{
  (e: 'workerCreated'): void;
}>();

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { $uuid } = useNuxtApp();

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

    if (!error) {
      emit('workerCreated');

      return data;
    }

    return null;
  }
};
</script>
