<template>
  <div>
    <v-row>
      <v-col v-for="worker in workers" cols="4"><DashboardWorkerWidget :worker="worker" /></v-col>
      <v-col cols="4"><DashboardWorkerCreateWidget @worker-created="refreshWorkers" /></v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { Database } from 'types/database';

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const { data: workers, refresh: refreshWorkers } = await useAsyncData('workers', async () => {
  if (user.value) {
    const { data, error } = await supabase.from('workers').select('*').eq('manager_id', user.value.id);

    if (error) {
      throw createError({
        statusCode: 500,
        fatal: true,
      });
    }

    return data
  }

  return null;
});

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
