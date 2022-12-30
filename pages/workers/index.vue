<template>
  <v-sheet elevation="1">
    <EasyDataTable :headers="headers" :items="workers" alternating>
      <template #item-pic="{ profile_pic }">
        <v-avatar>
          <v-img :src="$workerPicPuclicUrl(profile_pic)" alt="John"></v-img>
        </v-avatar>
      </template>
      <template #item-actions="item">
        <v-btn :to="`/workers/${item.id}`" icon="mdi-magnify" size="x-small" class="my-2"></v-btn>
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
  { text: '', value: 'pic', width: 60 },
  { text: 'First name', value: 'first_name' },
  { text: 'Last name', value: 'last_name' },
  { text: 'Actions', value: 'actions', width: 100 },
];

const { data: workers } = await useAsyncData('workers', async () => {
  if (user.value) {
    const { data, error } = await supabase.from('workers').select('*').eq('manager_id', user.value.id);

    if (error) {
      throw createError({
        statusCode: 500,
        fatal: true,
      });
    }

    return data;
  }

  return null;
});

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
