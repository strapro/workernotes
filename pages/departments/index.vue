<template>
  <v-row class="mb-2">
    <v-col cols="6" class="pt-5"><h3>Departments</h3></v-col>
    <v-col cols="6" class="text-right">
      <v-btn to="/departments/new">New Department</v-btn>
    </v-col>
  </v-row>
  <v-sheet elevation="1">
    <EasyDataTable :headers="headers" :items="workers" alternating>
      <template #item-actions="item">
        <v-btn :to="`/departments/${item.id}`" icon="mdi-magnify" size="x-small" class="my-2"></v-btn>
      </template>
    </EasyDataTable>
  </v-sheet>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';
import type { Header } from 'vue3-easy-data-table';

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const headers: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'Actions', value: 'actions', width: 100 },
];

const { data: workers, refresh: refreshWorkers } = await useAsyncData('departments', async () => {
  if (user.value) {
    const { data, error } = await supabase.from('departments').select('*').eq('manager_id', user.value.id);

    if (!error) {
      return data;
    }
  }

  return null;
});

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
