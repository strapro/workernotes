<template>
  <div>
    <v-row>
      <v-col v-for="worker in workers" cols="4"><DashboardWorkerWidget :worker="worker" /></v-col>
      <v-col cols="4"><DashboardWorkerCreateWidget @worker-created="refreshWorkers" /></v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const workersRepository = useWorkersRepository();
const user = useSupabaseUser();

const { data: workers, refresh: refreshWorkers } = await workersRepository.getByManagerId(user.value?.id!);

definePageMeta({
  middleware: 'auth',
  layout: 'app',
});
</script>
